class ColorPicker extends PIXI.Container {
    constructor(app){
        super();
        this.app = app;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.colorHex = 0x000000;
        this.hue = 0;
        this.saturation = 0;
        this.value = 0;
        this.lightness = 0;
        this.alpha = 1;


        this.colorPickerBox = new Box(this.app, 0, 0, 300, 600, "Color Picker");
        this.colorPickerBox.headerButton.name = "ColorPicker";
        this.x = 400;
        this.y = 400;
        this.addChild(this.colorPickerBox);
        this.visibility = true;
        this.colorPickerBox.drawBackground(600, 0xFFFFFF);


        this.radius = 140;
        this.centerX = 0;
        this.centerY = 0;

        this.drawHSVWheel();

        this.interactive = true;
        //this.on('mousemove', onColorPickerMouseMove);

        this.sliderLimListItem("Red", "float", 0, 255, this.r, 350);
        this.sliderLimListItem("Green", "float", 0, 255, this.r, 390);
        this.sliderLimListItem("Blue", "float", 0, 255, this.r, 430);

    }
    
    sliderLimListItem(label, dataType, min, max, value, positionY){

        const slider = new Slider(app, 15, positionY, 270, min, max, value, label);
        this.addChild(slider.container);

       // this.itemIndex +=1;
    }

    setPosition(x, y){
        this.colorPickerBox.position.set(x, y);
    }

    onColorPickerMouseMove(event) {
      const position = event.data.global;
      const localPos = colorPicker.toLocal(position);
      const lx = localPos.x;
      const ly = localPos.y;

      const color = this.getColorAtPosition(lx, ly);
      //console.log(color);
      // You can use the color value for your application logic
    }

    getColorAtPosition(positionX, positionY) {

      const dx = positionX - this.centerX;
      const dy = positionY - this.centerY;

      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let hue = (angle + 360) % 360 /360;
      let saturation = 1;
      let value = 1 - (distance / this.radius)/2;
      let alpha = 1;

      if (value <= .5){
        alpha = 0;
      }
      else {
        //console.log(hue, saturation, value);
        //this.setColor(r, g, b);
      }

      return this.hslToRgb(hue, saturation, value, alpha);
    }

    setColor(r, g, b){
      this.r = r;
      this.g = g;
      this.b = b;
    }

    drawHSVWheel(){

      const width = this.radius * 2 + 1;
      const height = this.radius * 2;
      // Create a Uint8ClampedArray and populate it with color data
      const imageDataSize = width * height * 4;
      const imageData = new Uint8ClampedArray(imageDataSize);

      let i = 0;

      for (var x = 0; x <= width; x++){
          for (var y = 0; y <= height; y++){

              const [r, g, b, a] = this.getColorAtPosition(x - this.radius, y - this.radius);

              imageData[i] = r; // Red channel
              imageData[i + 1] = g; // Green channel
              imageData[i + 2] = b; // Blue channel
              imageData[i + 3] = a; // Alpha channel (fully opaque)
              i = i + 4;
          }
      }

      // Create a texture from the Uint8ClampedArray data
      const texture = PIXI.Texture.fromBuffer(imageData, width, height);

      // Create a sprite with the texture and add it to the stage
      const sprite = new PIXI.Sprite(texture);
      sprite.position.set(10, 40);

      this.addChild(sprite);
    }

    hsvToRgb(h, s, v, alpha) {
      let r, g, b;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
      }
      return [Math.round(r * 256), Math.round(g * 256), Math.round(b * 256), Math.round(alpha * 255)];
    }

    hslToRgb(h, s, l, alpha) {
   
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // Achromatic when saturation is 0
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 256), Math.round(g * 256), Math.round(b * 256), Math.round(alpha * 256)];
  }


















}