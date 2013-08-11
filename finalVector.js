function Vector (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.magnitude = Math.pow(this.x*this.x + this.y*this.y + this.z*this.z, 0.5);

  Vector.dotProduct = function (vector1, vector2) {
  	return (vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z);
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
function Thing() {}

Thing.prototype.isHit = function(direction, point) {
  throw new Error("no collision algo defined");
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

    var v = this.a * direction.x + this.b * direction.y + this.c * direction.z;


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

function Ray(canvas) {
  
  var self = this;

  //canvas and context
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;
  
  //the pixels
  this.imgData = this.context.createImageData(400,400);
  this.data = this.imgData.data;

  //objects and light sources
  this.lights = new Point(200, 0, -100);
  this.objects = [];
  //default background is blue.
  this.background = [0, 0, 255, 255];

  //eye/camera of the view
  this.eye = new Point(200, 100, -600);


  this.draw = function draw() {
    for(var i = 0; i < 4 * self.width * self.height; i+=4) {
      calculatePixel( (i / 4) % self.width, Math.floor((i / 4) / self.width));
    }

    self.context.putImageData(self.imgData, 0, 0);
    return self;
  
  }
  //fills in rgba values for pixel at (x,y) of screen
   function calculatePixel(x, y) {
    var target = objectHit(new Vector(x-self.eye.x, y - self.eye.y, 0 - self.eye.z).normalized(),  new Point(x, y, 0));

    if (target.index > -1) {

     var intensity = isLit(target.position, self.objects[target.index].getNormalVector(target.position));
     var pixel = (y * self.width + x) * 4;

      var color = self.objects[target.index].color;
      self.data[pixel] = color[0] * (.9 * intensity + .1);
      self.data[pixel + 1] = color[1] * (.9 * intensity + .1);
      self.data[pixel + 2] = color[2] * (.9 * intensity + .1);
      self.data[pixel + 3] = 255;
    } else {
      var pixel = (y * self.width + x) * 4;
      self.data[pixel] = self.background[0];
      self.data[pixel + 1] = self.background[1];
      self.data[pixel + 2] = self.background[2];
      self.data[pixel + 3] = self.background[3];
    }
  }


  //returns index of object hit, and (x,y,z) position in scene.
  //ray is vector
  //pos is array of length 3 [x, y, z]
  function objectHit(ray, pos) {
    var t = Infinity;
    var objectHitIndex = -1;

    for(var i = 0; i < self.objects.length; i++) {
      var temp = self.objects[i].isHit(ray, pos);
      if(temp >= 0 && temp < t) {
        t = temp;
        objectHitIndex = i;
      }
    }

    if(objectHitIndex > -1) {
      var hitPoint = new Point(pos.x + ray.x * t,
            pos.y + ray.y * t,
            pos.z + ray.z * t);

      return {index : objectHitIndex, position : hitPoint};
    } 
    else {
      return {index : -1};
    }
  }

  function isLit(pos, normalVector) {

    var lightVector = new Vector(self.lights.x - pos.x,self.lights.y - pos.y, self.lights.z - pos.z).normalized();
    var shade = Vector.dotProduct(lightVector, normalVector);
    

    if(shade < 0) {
      return 0;
    } else { 
      //we want to create offset, so the object will not collide with itself.
      var collision = objectHit(lightVector, new Point(
          pos.x + normalVector.x * 0.001,
          pos.y + normalVector.y * 0.001,
          pos.z + normalVector.z * 0.001
          ));


      if(collision.index == -1) {
        return shade;
      } else {
        return 0;
      }

    }
  }

  this.addThing = function addThing(thing) {
    self.objects.push(thing);
    return self;
  }

  this.addLight = function addLight(light) {
    self.lights = light;
    return self;
  }
}

