class SelectionRectangle {
    constructor(app) {
        this.app = app;
        this.startPoint = null;
        this.currentPoint = null;
        this.rectangle = null;

        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);

    }

    activate(){
       this.app.view.addEventListener('pointerdown', this.handlePointerDown);

    }

    deactivate(){
       this.app.view.removeEventListener('pointerdown', this.handlePointerDown);

    }

    handlePointerDown(event) {
        this.startPoint = new PIXI.Point(event.clientX, event.clientY);

        this.rectangle = new PIXI.Graphics();
        //this.rectangle.lineStyle(1, 0xFF0000);
        this.app.stage.addChild(this.rectangle);

        this.app.view.addEventListener('pointermove', this.handlePointerMove);
        this.app.view.addEventListener('pointerup', this.handlePointerUp);
    }

    handlePointerMove(event) {
        this.currentPoint = new PIXI.Point(event.clientX, event.clientY);
        this.drawRect(this.currentPoint);
    }

    handlePointerUp(event) {
        this.currentPoint = new PIXI.Point(event.clientX, event.clientY);
        this.drawRect(this.currentPoint);
        // Remove the previous rectangle from the stage
        if (this.rectangle) {
            this.app.stage.removeChild(this.rectangle);
        }
        this.app.view.removeEventListener('pointermove', this.handlePointerMove);
        this.app.view.removeEventListener('pointerup', this.handlePointerUp);
        this.deactivate();
    }

    drawRect(currentPoint) {
        this.rectangle.clear();
        this.rectangle.lineStyle(1, 0xffffff);
        this.rectangle.drawRect(
            this.startPoint.x,
            this.startPoint.y,
            currentPoint.x - this.startPoint.x,
            currentPoint.y - this.startPoint.y
        );
    }
}