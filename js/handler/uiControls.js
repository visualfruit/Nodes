class UIControls {
    constructor(app, uiNodeArray, uiNodeTemplateArray, container, containerLinks, connectionLine, selRect) {
        this.app = app;

        // Arrays that hold the UI Nodes data
        this.uiNodeArray = uiNodeArray;
        this.uiNodeTemplateArray = uiNodeTemplateArray;

        // display objects
        this.container = container;
        this.containerLinks = containerLinks;
        this.connectionLine = connectionLine;
        this.selRect = selRect;

        this.selectedNodes = []; //stores selected node-ids
        this.hitObject = null;

//        this.delta;

        // Mouse information
        this.lastMousePosition = new PIXI.Point();
        this.clickPosition = new PIXI.Point();
        this.releasePosition = new PIXI.Point();
        this.oldItemPositions = []; //stores the position of all selected windows when they are moved together
        this.selArea = {x: [0,0], y: [0,0]};

        this.moveHandlerBind = this.onPress_Move.bind(this);
        this.mouseUpMoveBind = this.onMouseUp_Move.bind(this);

        this.onPortMouseMoveBind = this.onPortMouseMove.bind(this);

        this.isDragging = false;

        //
        //this.pointerData = null;
        this.initialPointerPos = new PIXI.Point(0,0);
        this.newPointerPos = new PIXI.Point(0,0);
        this.delta = new PIXI.Point(0,0);

        //this.app.view.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.boundPointerUpHandler = this.onPointerUp.bind(this);
    // Event listeners for drawing
        this.app.renderer.plugins.interaction.on("pointerdown", this.onPointerDown.bind(this));
        this.app.renderer.plugins.interaction.on("pointermove", this.onPointerMove.bind(this));
        //this.app.renderer.plugins.interaction.on("pointerup", this.onPointerUp.bind(this));
        this.updateConnections(this.uiNodeArray);
    }

    onPointerMove(evt) {
        this.newPointerPos.copyFrom(evt.data.getLocalPosition(this.container));
        //console.log("newPointerPos: " + this.newPointerPos.x);
        this.delta.x = this.newPointerPos.x - this.initialPointerPos.x;
        this.delta.y = this.newPointerPos.y - this.initialPointerPos.y;
        //console.log("delta: " + this.delta.x);
    }

    onPointerDown(evt) {

        // get the object that you clicked on
        this.hitObject = this.app.renderer.plugins.interaction.hitTest(evt.data.global, this.app.stage);
        let state = null;

        // set the initial pointer
        this.initialPointerPos.copyFrom(evt.data.getLocalPosition(this.container));

        if (this.hitObject) {
          // Handle the interaction with the hit object
          console.log("Clicked on:", this.hitObject.name);
          state = this.hitObject.name;
        } else {
          // Handle the interaction with the background or other non-hit objects
          console.log("Clicked on the background or non-hit object");
          state = "stage";
        }

        switch (state) {
            case "stage":
                console.log('go to selectHandler');
                this.app.renderer.plugins.interaction.on("pointerup", this.boundPointerUpHandler);
                this.selectHandler();
                break;
            case "unselected":
                console.log('go to select and move');
                this.app.renderer.plugins.interaction.on("pointerup", this.boundPointerUpHandler);
                this.selectAndMoveHandler(evt.target.parent);
                break;
            case "selected":
                console.log("goto moveBoxHandler");
                this.moveHandler();
                break;
            case "Input":
                console.log("change new connection");
                this.connectionInputHandler();
                break;
            case "Output":
                console.log("create new connection");
                this.connectionHandler();
                break;
            case "addMenu":
                console.log("clicked on menu item");
                this.addNode(this.hitObject.type);
            default:
                console.log("go to selectHandler");
        }
    }

    onPointerUp(evt) {
        this.setSelectionRectangle();
        for (var i = 0; i < this.uiNodeArray.length; i++) {
            this.hittest(this.uiNodeArray[i]);
        }
        this.app.renderer.plugins.interaction.removeListener("pointerup", this.boundPointerUpHandler);
    }

    setSelectionRectangle() {
        this.selArea.x[0] = this.initialPointerPos.x;
        this.selArea.x[1] = this.newPointerPos.x;
        this.selArea.y[0] = this.initialPointerPos.y;
        this.selArea.y[1] = this.newPointerPos.y;

        this.selArea.x.sort(function (a, b) { return a - b });
        this.selArea.y.sort(function (a, b) { return a - b });
    }

    hittest(inputBox) {
        let hit = this.detectIntersection(inputBox);
        if (hit == true) {
            inputBox.parent.addChild(inputBox);
            inputBox.drawBoxSelected();
            inputBox.nodeBox.headerButton.name = "selected";
            this.selectedNodes.push(inputBox);
            console.log("selectionArrayHittest: " + this.selectedNodes);
        } else {
            inputBox.drawBox();
            inputBox.nodeBox.headerButton.name = "unselected";
        }
    }

    detectIntersection(inputBox) {
        if (this.selArea.x[1] < inputBox.x) {
            return false;
        }
        if (this.selArea.x[0] > inputBox.x + inputBox.width) {
            return false;
        }
        if (this.selArea.y[0] > inputBox.y + inputBox.height) {
            return false;
        }
        if (this.selArea.y[1] < inputBox.y) {
            return false;
        } else {
            return true;
        }
    }

    selectHandler() {
        for (var i = 0; i < this.selectedNodes.length; i++) {
            this.selectedNodes[i].nodeBox.headerButton.name = "unselected";
            this.selectedNodes[i].drawBox();
        }
        this.selectedNodes = [];
        this.selRect.activate();
    }

    selectAndMoveHandler(inputBox) {
        inputBox.parent.parent.addChild(inputBox.parent);
        for (var i = 0; i < this.selectedNodes.length; i++) {
            this.selectedNodes[i].drawBox();
        }
        this.selectedNodes = [];
        this.selectedNodes.push(inputBox.parent);
        inputBox.parent.drawBoxSelected();
        this.moveHandler();
    }


    // Connection Handling

/*     connectionHandler() {
        this.hitObject.on('pointerdown', this.onPortButtonDown.bind(this));


    } */

    connectionHandler(event) {
        if (!this.isDragging) {
            this.isDragging = true;
            console.log(this.isDragging);
            this.hitObject.on("pointermove", this.onPortMouseMoveBind);
            this.app.renderer.plugins.interaction.on('pointerup', this.onPortButtonUp.bind(this));
            //this.connectionLine.clear();
        }
    }
    connectionInputHandler(event) {
        console.log("from Output");
        //const hitObject = this.app.renderer.plugins.interaction.hitTest(event.data.global, this.app.stage);

        // check if node port has connection
        if (this.hitObject.parent.parent.node.Connections.In.length > 0){


        // get the output object and delete the connection

        // set this.hitObject to the output object


        // draw the mouse connection


            const oldInConObj = this.hitObject.parent.parent.node.Connections.In[0];


            // look for the node & port to draw the line from
            for (let i = 0; i < this.uiNodeArray.length; i++) {

                const outArray = this.uiNodeArray[i].node.Connections.Out;
                const indexToRemove = outArray.findIndex(item => JSON.stringify(item) === JSON.stringify(oldInConObj));
              
                if (indexToRemove !== -1) {
                    outArray.splice(indexToRemove, 1);
                    this.hitObject = this.uiNodeArray[i].ports[0];
                    //console.log("jawohl " +this.hitObject.node.label);
                    // clear and redraw Connections
                    this.containerLinks.clear();
                    this.updateConnections(this.uiNodeArray);
                    this.isDragging = true;
                    // move
                    this.app.renderer.plugins.interaction.on("pointermove", this.onPortMouseMoveBind);
                    this.app.renderer.plugins.interaction.on('pointerup', this.onPortButtonUp.bind(this));
                    break;
                }
            }
              
        }
        else {
            console.log("port has no connection");
        }
    }

    onPortMouseMove(event) {
        if (this.isDragging) {
        const point1 = new PIXI.Point(this.hitObject.parent.x + this.hitObject.parent.parent.x, this.hitObject.parent.y + this.hitObject.parent.parent.y);
        this.drawNewConnectionLine(point1, this.newPointerPos);
        console.log("Draggin'");
        }
    }

    onPortButtonUp(event){
        if (this.isDragging) {
            this.isDragging = false;
            this.hitObject.off("pointermove", this.onPortMouseMoveBind);
            this.app.renderer.plugins.interaction.on('pointerup', this.onPortButtonUp.bind(this));
            this.connectionLine.clear();

            const hitObject = this.app.renderer.plugins.interaction.hitTest(event.data.global, this.app.stage);

            if (hitObject.parent.label == this.hitObject.parent.label && hitObject.parent.name !== this.hitObject.parent.name){

                // Create new connection
                console.log("ja es kann verbunden werden");
                const conObj = this.newConnection(this.hitObject.parent, hitObject.parent);

                // check for old connections at the other node plugged in the input node
                const oldInConObj = hitObject.parent.parent.node.Connections.In[0];

                this.uiNodeArray.forEach(obj => {
                    const outArray = obj.node.Connections.Out;
                    console.log(JSON.stringify(obj.node));
                    const indexToRemove = outArray.findIndex(item => JSON.stringify(item) === JSON.stringify(oldInConObj));
                  
                    if (indexToRemove !== -1) {
                      outArray.splice(indexToRemove, 1);
                    }
                });

                // check for already existing connection
                const isObjectInArray = this.hitObject.parent.parent.node.Connections.Out.some(obj => JSON.stringify(obj) === JSON.stringify(conObj));

                if (!isObjectInArray) {
                    // add the new connectionObject to the Node-Data
                    this.hitObject.parent.parent.node.Connections.Out.push(conObj);
                    hitObject.parent.parent.node.Connections.In[0] = conObj;
                    
                    // clear and redraw Connections
                    this.containerLinks.clear();
                    this.updateConnections(this.uiNodeArray);     
                }
                else{
                    console.log("already exists");
                }
                // add to connections at both, the input and the output node

            }
            else {
                console.log("nein, es passt nicht und kann nicht verbunden werden");
            }
        } 
    }

    newConnection(port1, port2){
        return {From: {Node: port1.parent.label, Port: port1.index.toString()}, To: {Node: port2.parent.label, Port: port2.index.toString()}};
    }

    drawNewConnectionLine(Point1, Point2) {
        this.connectionLine.clear();
        this.connectionLine.lineStyle(2, 0x000000);
        this.connectionLine.moveTo(Point1.x, Point1.y);
        this.connectionLine.lineTo(Point2.x, Point2.y);
    }

    onPressDrawConnection() { }

    onMouseUpDrawConnection() { }

    moveHandler() {
        this.oldItemPositions = [];
        for (var i = 0; i < this.selectedNodes.length; i++) {
            this.selectedNodes[i].updateOldLocation();
        }
        this.app.renderer.plugins.interaction.on("pointermove", this.moveHandlerBind);
        this.app.renderer.plugins.interaction.on("pointerup", this.onMouseUp_Move.bind(this));
    }

    onPress_Move(evt) {
        this.containerLinks.clear();

        this.updatePositionOfSelectedItems();
        this.updateConnections(this.uiNodeArray); // links between nodes
    }

    onMouseUp_Move(evt) {
        this.app.renderer.plugins.interaction.off("pointermove", this.moveHandlerBind);
        this.app.renderer.plugins.interaction.off("pointerup", this.onMouseUp_Move.bind(this));
    }

    updatePositionOfSelectedItems() {
        console.log("selection Array: " + this.selectedNodes);
        for (var i = 0; i < this.selectedNodes.length; i++) {
            this.selectedNodes[i].x = this.selectedNodes[i].oldLocation.x + this.delta.x;
            this.selectedNodes[i].y = this.selectedNodes[i].oldLocation.y + this.delta.y;
        }
    }

    drawAllBoxesDeselected() {
        for (var i = 0; i < this.selectedNodes.length; i++) {
            inputBox.drawBox();
        }
    }

    updateConnections(uiNodeArray){
        if (uiNodeArray.length > 0) {
            uiNodeArray.forEach((uiNode) => {
                if (uiNode.node.Connections.Out.length > 0) {
                    uiNode.node.Connections.Out.forEach((uiConnection) => {
                    let index = parseInt(uiConnection.From.Port, 10)-1;
                    let index2 = parseInt(uiConnection.To.Port, 10)-1;

                    const filteredObj = uiNodeArray.filter(obj => obj.label === uiConnection.To.Node)[0];

                    // get start and end-point for the line

                    const point1 = new PIXI.Point(uiNode.ports[index].x + uiNode.x, uiNode.ports[index].y + uiNode.y);
                    const point2 = new PIXI.Point(filteredObj.ports[index2].x + filteredObj.x, filteredObj.ports[index2].y + filteredObj.y);

                    this.drawLine(point1, point2);
                });
            }
           });
          } else {
            console.log("The array is empty");
          }
    }

    removeNode(index){
        this.uiNodeArray.splice(index, 1);
    }

    addNode(type){
        console.log("add a new node: " + type);
        const index = 0;
        var name = `${type}.${String(index).padStart(3, '0')}`;
        console.log(name);

        const nodeTypeData = this.uiNodeTemplateArray.filter(obj => obj.Type === type);

        console.log("nodeTypeData" + this.uiNodeTemplateArray[0]);

        const node = new NodeBox(this.app, nodeTypeData, type, name);
        this.uiNodeArray.push(node);
        this.container.addChild(node);
        console.log(this.uiNodeArray.length);
    }

    nameAlreadyExists(string, checkString){
        
    }

    drawLine(point1, point2){
        this.containerLinks.lineStyle(1, 0x000000);
        this.containerLinks.moveTo(point1.x, point1.y);
        this.containerLinks.lineTo(point2.x, point2.y);
    }
}