
//WebGL variables
var canvas;
var gl;


//Window
var WindowWidth, WindowHeight, ncp = 0.1, fcp = 20;

var perspectiveMatrix, orthoMatrix = makeOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0);

var shaderNormal; //Shaders
var OBJobject = [];
var imageTexture = [];

//Object transformation
var translateA = [new Vector3D(-2.,1.0,0.0),new Vector3D(-1.0,0.0,0.0),new Vector3D(0.0,1.0,0.0), new Vector3D(0.0,-1.0,0.0), new Vector3D(+2,1.0,0.0), 
                  new Vector3D(-2.,-1.0,0.0), new Vector3D(1.,0.0,0.0), new Vector3D(2,-1.0,0.0), new Vector3D(-1,0,-7.0), new Vector3D(+1, 0,-7.0)];
var scale = [0.8, 0.9, .5, .5, 0.7, 1.0, 0.40, 0.9, 1.0, 1.0];
//Mouse
var pressed = -1;
var lastx, lasty;
var quaternion = new Quaternion(0.0, 0.0, 0.0, 1.0), q2 = new Quaternion(0.0, 0.0, 0.0, 1.0);
var shiftKey = false;



//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
	
  canvas = document.getElementById("glcanvas");
  canvas.addEventListener("webglcontextlost", function(event) {
            event.preventDefault();
          }, false);


      
  WindowWidth = canvas.width;
  WindowHeight = canvas.height;
  

  initWebGL(canvas);      // Initialize the GL context


  // Only continue if WebGL is available and working
  
  if (gl) {
	var ext = gl.getExtension('OES_element_index_uint');
  
    gl.viewport(0,0,WindowWidth,WindowHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();

    
    //Make the perspective Matrix
    perspectiveMatrix = makePerspective(45.0, WindowWidth/WindowHeight, ncp, fcp);


  	

    let toLoad = [
                {name: 'farao.obj', texName: 'farao.jpg'},
                {name: 'ton.obj', texName: 'ton.jpg'},
                {name: 'teapot.obj', texName: 'Tile41a.jpg'},
                {name: 'Girl_face.obj', texName: null},
                {name: 'sb_ball_bind.dff.obj', texName: null},
                {name: 'spongebob_bind.obj', texName: 'spongebob.png'}, 
                {name: 'thor.obj', texName: null},
                {name: 'boxstack.obj', texName: null},
                {name: 'cube.obj', texName: null},
                {name: 'battletank.obj', texName: null}
    ];


    //loop to load all objects and their textures
    for(let i=0;i<toLoad.length;++i){
      let oReq = new XMLHttpRequest();
      oReq.onload =  function () {
        let ob = new OBJ(gl);
        ob.loadModel(this.responseText);
        OBJobject.push(ob);


        //load texture, if there is any
        if(toLoad[i].texName !== null){
          let myimage = new Image();
          myimage.onload = function() {
            //Pass the texture to OpenGL
            ob.loadFromImage(gl, myimage);
          }
          myimage.src = toLoad[i].texName;
          imageTexture.push(myimage);
        }
      };  

      oReq.open("GET", toLoad[i].name);
      oReq.send();
    }
    
    

    // Add event listener for `click` events.
    //On Click
    canvas.addEventListener('mousedown', mousedown, false);
    //On Release
    canvas.addEventListener('mouseup', mouseup, false);
    //On leave
    canvas.addEventListener('mouseleave', mouseleave, false);
    //On move
    canvas.addEventListener('mousemove', mousemove, false);


    //On key pressed
    window.addEventListener('keydown', keydown, false);
    //On key up
    window.addEventListener('keyup', keyup, false);


    createMenu();


	
    
    // Set up to draw the scene periodically.
    setInterval(drawScene, 1);
  }else{
    console.log("Your browser doesn't support WebGL");
  }
}

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
  gl = null;

  
  try {
    gl = canvas.getContext("experimental-webgl");
  }
  catch(e) {
  }
  
  // If we don't have a GL context, give up now
  
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}


//
// drawScene
//
// Draw the scene.
//
function drawScene() {
  

	gl.clearColor(0.25,0.25,0.25,1.0);
	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  //<Draw object normally>
  shaderNormal.bind(gl);

  gl.activeTexture(gl.TEXTURE0);

  gl.enableVertexAttribArray(shaderNormal.getAttLoc("aVertexPos"));
  gl.enableVertexAttribArray(shaderNormal.getAttLoc("aNormalPosition"));
  gl.enableVertexAttribArray(shaderNormal.getAttLoc("aTexturePosition"));

  gl.uniform1i(shaderNormal.getUniformLoc("light"), menuText.light);
  gl.uniform1i(shaderNormal.getUniformLoc("texture"), menuText.texture);
  gl.uniform1i(shaderNormal.getUniformLoc("tex"), 0);


  for (var i = 0; i < OBJobject.length; i++) {
    //Set uniforms
    gl.uniformMatrix4fv(shaderNormal.getUniformLoc("uPMatrix"), false, new Float32Array(perspectiveMatrix.flatten()));
    var uViewMatrix = Matrix.I(4);
    gl.uniformMatrix4fv(shaderNormal.getUniformLoc("uViewMatrix"), false, new Float32Array(uViewMatrix.flatten()));

    quaternion.normalize();
    var RotarioMat = quaternion.toMat4();
    //var rot = $M(RotarioMat);
    var trans2 = Matrix.glTranslate($V([translateA[i].x, translateA[i].y, -5.0 + translateA[i]  .z]));
    var scaleMat = Matrix.glScale($V([scale[i], scale[i], scale[i]]));
    uModelMatrix = trans2.x(RotarioMat.x(scaleMat));

    gl.uniformMatrix4fv(shaderNormal.getUniformLoc("uModelMatrix"), false, new Float32Array(uModelMatrix.flatten()));


 	  OBJobject[i].draw(gl, shaderNormal.getAttLoc("aVertexPos"), shaderNormal.getAttLoc("aNormalPosition"), shaderNormal.getAttLoc("aTexturePosition"));
  }


	gl.disableVertexAttribArray(shaderNormal.getAttLoc("aVertexPos"));
  gl.disableVertexAttribArray(shaderNormal.getAttLoc("aNormalPosition"));
  gl.disableVertexAttribArray(shaderNormal.getAttLoc("aTexturePosition"));

}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {

  // Create normal rendering shader program
  shaderNormal = new Shader("Normal Rendering", "shader-vs", "shader-fs");
  shaderNormal.compileShader(gl);
  shaderNormal.bind(gl);


}
