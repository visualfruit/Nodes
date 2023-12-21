class TreeEvaluation extends PIXI.Container {
    constructor(startNode){
        super();
        this.startNode = startNode;
    }

    startRootEvaluation(){
        this.startNode.evaluate();
    }
}
