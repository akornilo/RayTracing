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
  this.lights = new Point(300, 0, -60);
  this.objects = [];
  //default background is blue.
  this.background = [0, 0, 255, 255];

  //eye/camera of the view
  this.eye = new Point(200, 200, -900);


  this.draw = function draw() {
    for(var i = 0; i < 4 * self.width * self.height; i+=4) {
    //  console.log(self.data, "before")
      calculatePixel( (i / 4) % self.width, Math.floor((i / 4) / self.width));
     // console.log(self.data, "after");
    }

    console.log(self.data);
    self.context.putImageData(self.imgData, 0, 0);
    return self;
  
  }
  //fills in rgba values for pixel at (x,y) of screen
   function calculatePixel(x, y) {
    var target = objectHit(new Vector(x-self.eye.x, y - self.eye.y, 0 - self.eye.z).normalized(),  new Point(x, y, 0));

    if (target.index > -1) {

     var intensity = isLit(target.position, self.objects[target.index].getNormalVector(target.position)) * .8 + .2
     var pixel = (y * self.width + x) * 4;

      var color = self.objects[target.index].color;
      self.data[pixel] = color[0] * intensity;
      self.data[pixel + 1] = color[1] * intensity;
      self.data[pixel + 2] = color[2] * intensity;
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
      var collision = objectHit(normalVector, new Point(
          pos.x + normalVector.x * 0.001,
          pos.y + normalVector.y * 0.001,
          pos.z + normalVector.z * 0.001
          ));

      if(collision.index == -1) {
        return shade;
      } else {
        console.log("??");
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