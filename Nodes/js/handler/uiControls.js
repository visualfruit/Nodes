class UIControls {
    constructor(app, uiNodeArray, connections, uiNodeTemplateArray, container, containerLinks, connectionLine, selRect) {
        this.app = app;

        // Arrays that hold the UI Nodes data
        this.uiNodeArray = uiNodeArray;
        this.connections = connections;
        this.uiNodeTemplateArray = uiNodeTemplateArray;

        // display objects
        this.container = container;
        this.containerLinks = containerLinks;
        this.connectionLine = connectionLine;
        this.selRect = selRect;

        this.selectedNodes = []; //stores selected node-ids
        this.hitObject = null;

        //this.delta;

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
          //console.log("Clicked on the background or non-hit object");
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
                console.log("Start from Input-Port to create, change or removes connection");
                this.connectionInputHandler();
                break;
            case "Output":
                console.log("Start from Output-Port to create new connection");
                this.connectionOutputHandler();
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
            //console.log("selectionArrayHittest: " + this.selectedNodes);
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

    connectionOutputHandler(event) {
        if (!this.isDragging) {
            this.isDragging = true;
            console.log(this.isDragging);
            this.hitObject.on("pointermove", this.onPortMouseMoveBind);
            this.app.renderer.plugins.interaction.on('pointerup', this.onPortButtonUp.bind(this));
            //this.connectionLine.clear();
        }
    }

    connectionInputHandler(event) {

        var oldInConnObj = null;

        var toNode = this.hitObject.parent.parent;
        var toNodePort = this.hitObject;

        if (toNode.node.Connections.In.length > 0){

            var index = toNode.node.Connections.In[0];
            oldInConnObj = this.connections[index];
            console.log("index und object " + index);
            console.log("index und object " + JSON.stringify(oldInConnObj));
            console.log("index und object " + JSON.stringify(this.connections));

            this.connections.splice(index, 1);

            this.containerLinks.clear();
            this.updateConnections(this.uiNodeArray);

            const fromNode = this.uiNodeArray.find(node => node.label === oldInConnObj.From.Node);
            //console.log("fromNode " + fromNode.label);


            // find the From Port from the connected node
            this.hitObject = this.uiNodeArray.find(node => node.label === oldInConnObj.From.Node).ports[oldInConnObj.From.Port-1].button;

            this.isDragging = true;
            this.app.renderer.plugins.interaction.on("pointermove", this.onPortMouseMoveBind);
            this.app.renderer.plugins.interaction.on('pointerup', this.onPortButtonUp.bind(this));
              
        }
        else {
            console.log("port has no connection");
        }
    }

    onPortMouseMove(event) {
        if (this.isDragging) {

        const pa = new PIXI.Point(this.hitObject.parent.parent.x, this.hitObject.parent.parent.y);
        const pb = new PIXI.Point(this.hitObject.parent.x, this.hitObject.parent.y);
        
        const pointPort = new PIXI.Point(pa.x + pb.x, pa.y + pb.y);

        //const point1 = new PIXI.Point(this.hitObject.parent.x + this.hitObject.parent.parent.x, this.hitObject.parent.y + this.hitObject.parent.parent.y);
        this.drawNewConnectionLine(pointPort, this.newPointerPos);
        }
    }

    onPortButtonUp(event){

        // when the mouse is released above PortButton
        if (this.isDragging) {
            this.isDragging = false;
            this.hitObject.off("pointermove", this.onPortMouseMoveBind);
            this.app.renderer.plugins.interaction.on('pointerup', this.onPortButtonUp.bind(this));
            this.connectionLine.clear();

            const hitPort = this.app.renderer.plugins.interaction.hitTest(event.data.global, this.app.stage);

            var fromNode = this.hitObject.parent.parent;
            var toNode = hitPort.parent.parent;

            if (fromNode.dataType == toNode.dataType && fromNode !== toNode){

                //check which receiving input port
                
                const fromNodeIndex = fromNode.name;
                const fromPortIndex = hitObject.parent.index;

                const toNodeIndex = toNode.name;
                const toPortIndex = this.hitObject.index;

                console.log("fromPortIndex" + fromPortIndex);
                console.log("toPortIndex  " + toPortIndex);
                console.log("fromNodeIndex" + fromNodeIndex);
                console.log("toNodeIndex  " + toNodeIndex);

                // Create new connection
                
                const connObj = this.newConnection(this.hitObject.parent, hitObject.parent);
                this.connections.push(connObj);
                fromNode.node.Connections.In.push(this.connections.length-1);
                toNode.node.Connections.Out.push(this.connections.length-1);

                // check for existing connection to this port
                // if any connection to the node.name & node.index:
                // delete from connection_array & from input-node & from output-node
                const oldInConnObj = toNode.node.Connections.In[0];

                toNode.node.Connections.In.forEach(obj => {
                    console.log("in-connection object: " + JSON.stringify(obj));
                });

                this.uiNodeArray.forEach(obj => {
                    const outArray = obj.node.Connections.Out;
                    console.log(JSON.stringify(obj.node));
                    const indexToRemove = outArray.findIndex(item => JSON.stringify(item) === JSON.stringify(oldInConnObj));
                  
                    if (indexToRemove !== -1) {
                      outArray.splice(indexToRemove, 1);
                    }
                });

                // check for already existing connection
                const isObjectInArray = toNode.node.Connections.Out.some(obj => JSON.stringify(obj) === JSON.stringify(connObj));

                if (!isObjectInArray) {
                    // add the new connectionObject to the input and output Node-Data
                    fromNode.node.Connections.Out.push(connObj);
                    toNode.node.Connections.In[0] = connObj;
                    
                    // clear and redraw Connections
                    this.containerLinks.clear();
                    this.updateConnections(this.uiNodeArray);     
                }
                else{
                    console.log("already exists");
                }


            }
            else {
                console.log("nein, es passt nicht und kann nicht verbunden werden");
            }
        } 
    }

    newConnection(port1, port2){
        return {From: {Node: port1.parent.label, Port: port1.index}, To: {Node: port2.parent.label, Port: port2.index}};
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

        if (this.connections.length > 0) {
            this.connections.forEach((connection) => {

                var fromNode = uiNodeArray.find(node => node.label === connection.From.Node);
                var toNode = uiNodeArray.find(node => node.label === connection.To.Node);

                var index = connection.From.Port-1;
                var index2 = connection.To.Port-1;

                const point1 = new PIXI.Point(fromNode.ports[index].x + fromNode.x, fromNode.ports[index].y + fromNode.y);
                const point2 = new PIXI.Point(toNode.ports[index2].x + toNode.x, toNode.ports[index2].y + toNode.y);

                this.drawLine(point1, point2);

            });
        }
         else {
            console.log("The array is empty");
        }
    }

    removeNode(index){
        this.uiNodeArray.splice(index, 1);
        this.removeConnectionsFromNodes(node);
    }

    removeConnectionsFromNodes(node) {
        console.log("all connections and indices removed");
    }

    addNode(type){
        var count = 0;
        const name = `${type}.${String(count).padStart(3, '0')}`;
        //const nodeTypeData = this.uiNodeTemplateArray.filter(obj => obj.Type === type);
        const index = this.uiNodeTemplateArray.findIndex(obj => obj.Type === type);

        this.uiNodeTemplateArray[index].Name = name;
          
        const node = new NodeBox(this.app, this.uiNodeTemplateArray[index]);
        this.uiNodeArray.push(node);
        this.container.addChild(node);
    }

    drawLine(point1, point2){
        this.containerLinks.lineStyle(1, 0x000000);
        this.containerLinks.moveTo(point1.x, point1.y);
        this.containerLinks.lineTo(point2.x, point2.y);
    }

    updateTemplateData(data){
        this.uiNodeTemplateArray = data;
    }
}