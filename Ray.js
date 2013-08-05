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
	this.lights = [];
	this.objects = [];
	//default background is blue.
	this.background = [0, 0, 255, 255];

	//eye/camera of the view
	this.eye = new Vector(0, 0, 0)


	this.draw = function draw() {
		for(var i = 0; i < this.width * this.height * 4; i+=4) {
			calculatePixel(i / 400, i % 400);
		}
		self.context.put(self.imgData, 0, 0);
		return self;
	}

	//fills in rgba values for pixel at (x,y) of screen
	function calculatePixel(x, y) {
		var target = objectHit(new Vector(x - self.eye[0], y - self.eye[1]), 0 - self.eye[2], new Point(x, y, 0));

		if (target.index > -1) {

			var intensity = isLit(target.position, self.objects[target.index].getNormalVector(target.position));

			var color = objects[target].color;
			self.imgData[x * self.width + y] = color[0] * intensity;
			self.imgData[x * self.width + y + 1] = color[1] * intensity;
			self.imgData[x * self.width + y + 2] = color[2] * intensity;
			self.imgData[x * self.width + y + 3] = color[3];
		}
		else {
			self.imgData[x * self.width + y] = self.background[0];
			self.imgData[x * self.width + y + 1] = self.background[1];
			self.imgData[x * self.width + y + 2] = self.background[2];
			self.imgData[x * self.width + y + 3] = self.background[3];
		}

	}

	//returns index of object hit, and (x,y,z) position in scene.
	//ray is vector
	//pos is array of length 3 [x, y, z]
	function objectHit(ray, pos) {
		var t = Infinity;
		var objectHitIndex = -1;

		for(var i = 0; i < self.objects.length; i++) {
			var temp = self.objects[i].hitPoint(ray, pos);
			if(temp >= 0 && temp < t) {
				t = temp;
				objectHit = i;
			}
		}

		if(objectHit > -1) {
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

		var lightVector = new Vector(light.x - pos.x,light.y - pos.y, light.z - pos.z);
		var shade = Vector.dotProduct(lightVector, normalVector);
		if(shade < 0) {
			return 0;
		} else {
			//we want to create offset, so the object will not collide with itself.
			var collision = objectHit(new Point(
					pos.x + normalVector.x * 0.1,
					pos.y + normalVector.y * 0.1,
					pos.z + normalVector.z * 0.1
					), normalVector;

			if(collision.index > -1) {
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
		self.lights.push(light);
		return self;
	}
}