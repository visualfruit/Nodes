class Mesh {
    constructor(){

    }
    evaluate(){
        return this.verteces;
    }
}
class Subdivision {
    constructor(){
        this.verteces;
    }
    evaluate(){
        this.subdivideMesh()
        return this.verteces;
    }
    subdivideMesh(){
        //subdividing algorithm
    }
}
class DrawShape {
    constructor(){
        this.graphics = new PIXI.Graphics();
    }
    evaluate(){
        drawShape();
        return this.graphics;
    }
    drawShape(vertices, fillColor, strokeColor, strokeThickness, fillAlpha, strokeAlpha){
        //shape gets drawn
    }
}
class KBlurXY {
    constructor(){
        this.graphics = new PIXI.Graphics();
    }
    evaluate(){
        applyBlurFilterOnGraphic();
        return this.graphics;
    }
    applyBlurFilterOnGraphic(graphic, blurValue){
        const blurAmount = blurValue;
        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.quality = 20;
        graphic.blurAmount = blurValue;
        graphic.filters = [blurFilter];
        blurFilter.blur = blurAmount;      
      }
}
class Mask {
    constructor(){

    }
    maskGraphicByGraphic(graphic, graphicMask){
        let texture;
        const masklayer = new PIXI.Container();
        const bounds = new PIXI.Rectangle();
        const focus = new PIXI.Sprite(texture);
        bounds.width = (graphic.width + graphic.blurAmount) * 2;
        bounds.height = (graphic.height + graphic.blurAmount) * 2;
      
        texture = app.renderer.generateTexture(graphicMask, PIXI.SCALE_MODES.NEAREST, 2, bounds);
        masklayer.addChild(graphic);
        //app.stage.addChild(masklayer);
        canvas.addChild(masklayer);
        focus.texture = texture;   
        masklayer.mask = focus;
        //app.stage.addChild(focus);
        canvas.addChild(focus);
      }
}
class Output {
    constructor(){
        this.canvas = null;
    }
    evaluate(){
        return this.canvas;
    }
    assignCanvas(canvas){
        this.canvas = canvas;
    }
}