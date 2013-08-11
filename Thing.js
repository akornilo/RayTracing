function Thing() {}

Thing.prototype.isHit = function(direction, point) {
  throw new Error("no collision algorithm defined");
}

function Ball(x,y,z,r,color) {
  Thing.call(this);
  this.x = x;
  this.y = y;
  this.z = z;
  this.r = r;
  // color is array with 3 ints for rgb
  this.color = color;
}

Ball.prototype = new Thing();

Ball.prototype.isHit = function(direction, point) {

  var sceneToCenter = new Vector(this.x - point.x, this.y - point.y, this.z - point.z);

  var v = Vector.dotProduct(direction, sceneToCenter);

  var disc = Math.pow(this.r, 2) - (Vector.dotProduct(sceneToCenter, sceneToCenter) - v*v);

//  console.log(direction, point, sceneToCenter, v, disc);

  if(disc >= 0) {
    return v - Math.sqrt(disc);
  }
  return -1;
}

Ball.prototype.getNormalVector = function(point) {

  var pointToCenter = new Vector(point.x - this.x, point.y - this.y, point.z - this.z);
  return pointToCenter.normalized(); 
}

function Plane(a, b, c, d, color) {

  //create plane described by ax + by + cz = d;

  Thing.call(this);
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.color = color;
}

  Plane.prototype = new Thing();

  Plane.prototype.isHit = function(direction, point) {

    var v = this.a * direction.x + this.b * direction.y + this.z * direction.z;

    if (v == 0) {
      return -1;
    } else {
      var t = (this.d - point.x * this.a - point.y * this.b - point.z * this.c) / v;
      if (t < 0) {
        return -1;
      } else {
        return t;
      }
    }
  }

  Plane.prototype.getNormalVector = function(point) {
    return new Vector(-this.a, -this.b, -this.c).normalized();
  }

