class Mesh {
    constructor(){
        this.verteces;
        this.edges;
        this.vertexGroups;

        this.dataChanged = true;
    }
    evaluate(){
        return this.verteces;
    }
}
class Subdivision {
    constructor(){
        this.verteces;
        this.outputVerteces;

        this.dataChanged = true;
    }
    evaluate(){
        this.subdivideMesh()
        return this.outputVerteces;
    }
    subdivideMesh(){
        //subdividing algorithm
    }
}
class DrawShape {
    constructor(){
        this.graphics = new PIXI.Graphics();

        this.dataChanged = true;
    }
    evaluate(){
        drawShape();
        return this.graphics;
    }
    drawShape(verteces, fillColor, strokeColor, strokeThickness, fillAlpha, strokeAlpha){
        //shape gets drawn
        this.graphics.clear();
        this.graphics.beginFill(fillColor, fillAlpha);
        this.graphics.moveTo(verteces[0].x, verteces[0].y);
        for (var i=1; i < verteces.length-1; i++){
            this.graphics.lineTo(verteces[i].x, verteces[i].y);
        }
        this.graphics.endFill();
    }
}
class KBlurXY {
    constructor(app){
        this.app = app;
        this.graphics = new PIXI.Graphics();
        this.outputBitmap;
        this.graphics.blurX = 20;
        this.graphics.blurY = 210;
        this.mute = false;
        this.quality = 20;

        this.dataChanged = true;
    }
    evaluate(){
        if (dataChanged == true){
            this.outputBitmap = getBitmapFromGraphics(this.graphics);
            return this.outputBitmap;
        }
        else {
            return this.outputBitmap;
        }
    }
    getBitmapFromGraphics(graphicsObject, blurX, blurY){

        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.quality = this.quality;
        blurFilter.blurX = blurX;
        blurFilter.blurY = blurY;
        graphicsObject.filters = [blurFilter];
        return getBitmapFromGraphicsObject(graphicsObject);
    }
    getBitmapFromGraphicsObject(graphicsObject){
        let graphicTexture;
        const graphicBoundaryBox = new PIXI.Rectangle();
        const graphicBitmap = new PIXI.Sprite(graphicTexture);
        graphicBoundaryBox.x = -graphicsObject.blurX;
        graphicBoundaryBox.y = -graphicsObject.blurY;
        graphicBoundaryBox.width = (graphicsObject.width + graphicsObject.blurX) * 2;
        graphicBoundaryBox.height = (graphicsObject.height + graphicsObject.blurY) * 2;
      
        graphicTexture = app.renderer.generateTexture(graphicsObject, PIXI.SCALE_MODES.NEAREST, 1, graphicBoundaryBox);
        graphicBitmap.texture = graphicTexture;
        return graphicBitmap;       
    }
}
class Mask {
    constructor(){
        this.dataChanged = true;
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