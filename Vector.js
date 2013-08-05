function Vector (data) {
  this.x = data[0];
  this.y = data[1];
  this.z = data[2];
  this.magnitude = Math.pow(x*x + y*y + z*z, 0.5);

  this.dotProduct = function (vector1, vector2) {
  	return (vector1.x + vector2.x + vector1.y + vector2.y + vector1.z + vector2.z);
  }
}

Vector.prototype.normalized = function() {
  return new Vector(this.x/this.magnitude,
    this.y/this.magnitude,
    this.z/this.magnitude);
}

function Point (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
