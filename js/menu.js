//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> MENU
var FizzyText = function() {
  this.message = 'dat.gui';
  this.speed = 0.8;
  this.vertex = false;
  this.normal = false;
  this.wireframe = false;
  this.texture = true;
  this.TexturedView = false;
  this.light = true;
};

var menuText = new FizzyText();

function createMenu() {
  var gui = new dat.GUI();

  var f1 = gui.addFolder('View');
  f1.add(menuText, 'light').name('Enable Light');
  f1.add(menuText, 'texture').name('Enable Texture');

  
  //gui.add(text, 'explode');
};













//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MOUSE EVENTS
mousedown = function(event) {
  var box = canvas.getBoundingClientRect();
  var xx = (event.pageX - box.left) * (canvas.width /box.width);
  var yy = (event.pageY - box.top) * (canvas.height /box.height);

    
  if(event.button == 0){
    pressed = event.button;
    lastx = xx/WindowWidth;
    lasty = (WindowHeight - yy)/WindowHeight;

  }else if(event.button == 1){
    pressed = event.button;
  }else if(event.button == 2){
    pressed = event.button;
  }

  lastx = xx;
  lasty = yy;
  
  }

mouseup = function(event) {
    var box = canvas.getBoundingClientRect();
    var xx = (event.pageX - box.left) * (canvas.width /box.width);
    var yy = (event.pageY - box.top) * (canvas.height /box.height);

    if(pressed == 0){
      lastx = xx/WindowWidth;
      lasty = (WindowHeight - yy)/WindowHeight;
      
    }else if(pressed == 1){
      if(shiftKey){
        //Bring object closer
        var dx = (xx - lastx);
        var dy = (yy - lasty);

        translate.z -= dy/100;
      }else{
        //translate object
        var dx = (xx - lastx)/100;
        var dy = -(yy - lasty)/100;

        translate.x += dx;
        translate.y += dy;
      }

    }else if(pressed == 2){
      //Rotate object using quaternion
      var dx = (xx - lastx);
      var dy = (yy - lasty);

      if(!(dx == 0 && dy == 0)){
        //Calculate angle and rotation axis
        var angle = Math.sqrt(dx*dx + dy*dy)/50.0;
          
        //Acumulate rotation with quaternion multiplication
        var vec = new Vector3D(dy, dx, 0.0);
        q2.setFromAxisAngle(vec, angle);
        q2.normalize(); 
        quaternion = quaternion.multiply(q2, quaternion);
        quaternion.normalize();
      }
    }
    lastx = xx;
    lasty = yy;
      
    pressed = -1;
  }



  mousemove = function(event) {

    var box = canvas.getBoundingClientRect();
    var xx = (event.pageX - box.left) * (canvas.width /box.width);
    var yy = (event.pageY - box.top) * (canvas.height /box.height);
    
    if(pressed == 0){
      lastx = xx/WindowWidth;
      lasty = (WindowHeight - yy)/WindowHeight;

    }else if(pressed == 1){
      if(shiftKey){
        //Bring object closer
        var dx = (xx - lastx);
        var dy = (yy - lasty);
      
        translate.z -= dy/100;
      }else{
        //translate object
        var dx = (xx - lastx)/100;
        var dy = -(yy - lasty)/100;
        
        translate.x += dx;
        translate.y += dy;
      }
  
    }else if(pressed == 2){
      var dx = (xx - lastx);
      var dy = (yy - lasty);
      
      if(!(dx == 0 && dy == 0)){
        //Calculate angle and rotation axis
        var angle = Math.sqrt(dx*dx + dy*dy)/50.0;
          
        //Acumulate rotation with quaternion multiplication
        var vec = new Vector3D(dy, dx, 0.0);
        q2.setFromAxisAngle(vec, angle);
        q2.normalize(); 
        quaternion = quaternion.multiply(q2, quaternion);
        quaternion.normalize();
        
      }
    }

    lastx = xx;
    lasty = yy;

  }


  mouseleave = function(event) {  
    pressed = -1;
  }

  keydown = function(event) {
      if (event.keyCode == 76) menuText.light = !menuText.light;
      if (event.keyCode == 85) menuText.TexturedView = !menuText.TexturedView;
      if (event.keyCode == 86) menuText.vertex = !menuText.vertex;
      if (event.keyCode == 78) menuText.normal = !menuText.normal;
      if (event.keyCode == 87) menuText.wireframe = !menuText.wireframe;
      if (event.keyCode == 84) menuText.texture = !menuText.texture;
       if(event.shiftKey) shiftKey = true;
  }

  keyup = function(event) {
      if(!event.shiftKey) shiftKey = false;
  }

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MOUSE EVENTS