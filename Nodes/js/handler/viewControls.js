class ViewControls {
    constructor(app, containerA, containerB) {
        this.app = app;
        this.container = containerA;
        this.containerA = containerA;
        this.containerB = containerB;
        this.isPinching = false;
        this.initialDistance = 0;
        this.scaleStep = 0.03;
        this.minScale = 0.1;
        this.maxScale = 2;
        this.app.view.addEventListener('wheel', this.onMouseWheel.bind(this));
        this.app.view.addEventListener('touchstart', this.handlePinchStart.bind(this));
        this.app.view.addEventListener('touchmove', this.handlePinchMove.bind(this));
        this.app.view.addEventListener('touchend', this.handlePinchEnd.bind(this));

        document.addEventListener("keydown", this.toggleNodeVisibility.bind(this));
    }

    handlePinchStart(event) {
        const touches = event.touches;
        if (touches.length === 2) {
            isPinching = true;
            initialDistance = getDistance(touches[0], touches[1]);
        }
    }

    handlePinchMove(event) {
        if (isPinching) {
            const touches = event.touches;
            if (touches.length === 2) {
                const currentDistance = getDistance(touches[0], touches[1]);
                const delta = (currentDistance - initialDistance) * scaleStep;

                const currentScale = this.container.scale.x + delta;
                const clampedScale = Math.max(minScale, Math.min(maxScale, currentScale));

                this.container.scale.set(clampedScale);
            }
        }
    }

    handlePinchEnd() {
        this.isPinching = false;
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    onMouseWheel(event) {
        event.preventDefault();

        const pointerPosition = this.eventToGlobalPosition(event);

        const delta = event.deltaY > 0 ? -this.scaleStep : this.scaleStep;
        const currentScale = this.container.scale.x + delta;
        const clampedScale = Math.max(this.minScale, Math.min(this.maxScale, currentScale));

        const containerPointerPosition = pointerPosition.clone();
        this.container.toLocal(containerPointerPosition, null, containerPointerPosition);

        const newContainerPosition = this.container.position.clone();
        newContainerPosition.x -= containerPointerPosition.x * delta;
        newContainerPosition.y -= containerPointerPosition.y * delta;

        this.container.scale.set(clampedScale);
        if (this.container.scale.x < this.maxScale && this.container.scale.x > this.minScale){
           // this.container.position.copyFrom(newContainerPosition);
            this.container.x = newContainerPosition.x;
            this.container.y = newContainerPosition.y;
            //console.log("hifort " + this.container.scale.x + "this " + this.maxScale);
        }

        //console.log("containerView: Scale: " + this.container.scale.x + " x: " + this.container.position.x + " y: " + this.container.position.y);
    }

    eventToGlobalPosition(event) {
        const rect = app.view.getBoundingClientRect();
        return new PIXI.Point(event.clientX - rect.left, event.clientY - rect.top);
    }

    toggleNodeVisibility(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            this.containerA.visible = !this.containerA.visible;
            this.toggleContainer();
        }
    }
    toggleContainer(){
        if (this.container == this.containerA){
            this.container = this.containerB;
            return;
        }
        else{
            this.container = this.containerA;
        }
    }
}
