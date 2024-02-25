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
        this.verteces = [];
        this.edges = [];
    }
    execute(){
        return
    }
}
