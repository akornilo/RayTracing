function Thing() {

}

Thing.prototype.isHit = function(point, direction) {
  throw new Error("no collision algo defined");
}

function Ball(x,y,z,r) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.r = r;
}

Ball.prototype = new Thing();

Ball.prototype.isHit = function(point, direction) {

  console.log("magic");

}

Ball.prototype.normalVector = function(x, y, z) {
  return new Vector(x - this.x, y - this.y, z - this.z).normalized();
}


function Scene() {
  var eyeX;
  var eyeY;
  var eyeZ;
  var sunX;
  var sunY;
  var sunZ;

}



function render() {
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  var imgData = context.createImageData(400,400);
  var data = imgData.data;

  for(var i=0; i < (400*400*4); i+=4) {
    calculatePixel(data, i);
  } 

  context.putImageData(imgData, 0, 0);
}



