class TreeEvaluation extends PIXI.Container {
    constructor(startNode){
        super();
        this.startNode = startNode;
    }

    startRootEvaluation(){
        this.startNode.evaluate();
    }
}

class NodeTypes {
    constructor() {
        this.types = [
            //"Group",
            "String",
            "Int",
            "Boolean",
            "Bitmap",
            "Mesh",
            "Subdivision",
            "DrawShape",
            "KBlurXY",
            "Mask",
            "Layers",
            "Output",
            "Transform",
            "Mesh",
            "MixRGB",
            "StableDiffusion",
            "Math",
            "Rasterize"
        ] 
    }
}

class Mesh {
    constructor() {
        this.vertices = [];
        this.edges = [];
        this.vertexGroups = [];

        this.dataChanged = true;
    }
    evaluate(){
        console.log(this.vertices, this.edges);
    }
}

class Subdivision {
    constructor(){
        this.inputVertices;
        this.outputVertices;
        this.iterations = 0;

        this.dataChanged = true;
    }
    evaluate(){
        this.outputVertices = this.subdivideMesh(this.inputVertices, this.iterations);
        return this.outputVertices;
    }
    subdivideMesh(inputVertices, iterations){
        //subdividing algorithm
        return subdividesVerticesArray;
    }
}

class DrawShape {
    constructor(){
        this.graphics = new PIXI.Graphics();
        this.vertices = null;

        this.dataChanged = true;
    }
    evaluate(){
        this.graphics = this.drawShape();
        return this.graphics;
    }
    drawShape(){
        console.log("Draw shapes from vertices reference");
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
        if (dataChanged){
            this.outputBitmap = Canvas.getBitmapFromGraphics(this.graphics);
        }
        return this.outputBitmap;
    }
/*     getBitmapFromGraphics(graphicsObject, blurX, blurY){

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
    } */
}

class Mask {
    constructor(){
        this.dataChanged = true;
        this.canvas;
        this.graphic;
        this.mask;
    }
    evaluate(){
        this.canvas = Canvas.maskGraphicByGraphic(graphic, mask);
        return this.canvas;
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
