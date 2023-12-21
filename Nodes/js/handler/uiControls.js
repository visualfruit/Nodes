class UIControls {
    constructor(app, uiNodeArray, connections, uiNodeTemplateArray, container, containerLinks, connectionLine, selRect, dropDownMenu) {
        
        this.app = app;
        this.uiNodeArray = uiNodeArray;
        this.connections = connections;
        this.uiNodeTemplateArray = uiNodeTemplateArray;
        // display objects
        this.container = container;
        this.containerLinks = containerLinks;
        this.connectionLine = connectionLine;
        this.selRect = selRect;
        this.dropDownMenu = dropDownMenu;
        this.selectedNodes = []; //stores selected node-ids
        this.hitObject = null;

        // Mouse information
        this.lastMousePosition = new PIXI.Point();
        this.clickPosition = new PIXI.Point();
        this.releasePosition = new PIXI.Point();
        this.oldItemPositions = []; //stores the position of all selected windows when they are moved together
        this.selArea = {x: [0,0], y: [0,0]};
        this.initialPointerPos = new PIXI.Point(0,0);
        this.newPointerPos = new PIXI.Point(0,0);
        this.delta = new PIXI.Point(0,0);
        this.isDragging = false;

        this.moveHandlerBind = this.onPress_Move.bind(this);
        this.mouseUpMoveBind = this.onMouseUp_Move.bind(this);
        this.onPortMouseMoveBind = this.onPortMouseMove.bind(this);
        this.boundPointerUpHandler = this.onPointerUp.bind(this);
        // Event listeners for drawing
        this.app.renderer.plugins.interaction.on("pointerdown", this.onPointerDown.bind(this));
        this.app.renderer.plugins.interaction.on("pointermove", this.onPointerMove.bind(this));
        //this.app.renderer.plugins.interaction.on("pointerup", this.onPointerUp.bind(this));
        this.updateConnections(this.uiNodeArray);
    }

    onPointerMove(evt) {
        this.newPointerPos.copyFrom(evt.data.getLocalPosition(this.container));
        this.delta.x = this.newPointerPos.x - this.initialPointerPos.x;
        this.delta.y = this.newPointerPos.y - this.initialPointerPos.y;
    }

    onPointerDown(evt) {

        // get the object that you clicked on
        this.hitObject = this.app.renderer.plugins.interaction.hitTest(evt.data.global, this.app.stage);
        let context = null;

        // set the initial pointer
        this.initialPointerPos.copyFrom(evt.data.getLocalPosition(this.container));

        if (event.button === 2) {
            // Right mouse button (button code 2)
+           console.log('Right mouse button clicked!');
            this.dropDownMenu.showSubMenuRMB(new PIXI.Point(evt.data.global.x, evt.data.global.y));
        }

        if (this.hitObject) {
          // Handle the interaction with the hit object
          context = this.hitObject.name;
        } else {
          // Handle the interaction with the background or other non-hit objects
          //console.log("Clicked on the background or non-hit object");
          context = "stage";
        }

        console.log("context: " + context);

        switch (context) {
            case "stage":
                console.log('go to selectHandler');
                this.app.renderer.plugins.interaction.on("pointerup", this.boundPointerUpHandler);
                this.selectHandler();
                break;
            case "unselected":
                console.log('go to select and move');
                //this.app.renderer.plugins.interaction.on("pointerdown", this.boundPointerUpHandler);
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
                console.log("no matched context");
        }
    }

    onPointerUp(evt) {
        this.setSelectionRectangle();
        for (var i = 0; i < this.uiNodeArray.length; i++) {
            this.hittest(this.uiNodeArray[i]);
        }
        //this.app.renderer.plugins.interaction.removeListener("pointerup", this.boundPointerUpHandler);
        this.app.renderer.plugins.interaction.off("pointerup", this.boundPointerUpHandler);
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
            this.selectedNodes[i].nodeBox.headerButton.name = "unselected";
            this.selectedNodes[i].drawBox();
        }
        this.selectedNodes = [];
        inputBox.parent.nodeBox.headerButton.name = "selected";
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
        const toNode = this.hitObject.parent.parent;
        const toPortIndex = this.hitObject.parent.index;
        const portUsed = this.isPortUsed(toNode, toPortIndex);

        if (portUsed){

            const conId = this.getConnectionIdOfToPortIndex(toNode.label, toPortIndex);
            const fromNode = this.getFromNodeByConnectionId(conId);
            const oldInConnObj = this.removeItemById(conId);

            this.removeIndexFromArray(toNode.node.Connections.In, conId);
            this.removeIndexFromArray(fromNode.node.Connections.Out, conId);

            this.containerLinks.clear();
            this.updateConnections(this.uiNodeArray);

            this.hitObject = this.uiNodeArray.find(node => node.label === oldInConnObj.FromNode).ports[oldInConnObj.FromPort-1].button;   
        
        }
        else {
            console.log("This port is not used");
        }
        this.isDragging = true;
        this.app.renderer.plugins.interaction.on("pointermove", this.onPortMouseMoveBind);
        this.app.renderer.plugins.interaction.on('pointerup', this.onPortButtonUp.bind(this));
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

            const hitReleaseObject = this.app.renderer.plugins.interaction.hitTest(event.data.global, this.app.stage);

            if (hitReleaseObject !== null){

                const fromPort = this.hitObject.parent;
                const toPort = hitReleaseObject.parent;
            
                const fromNode = this.hitObject.parent.parent;
                const toNode = hitReleaseObject.parent.parent;

                const flag1 = () => {
                    return fromPort.name !== toPort.name;
                  };
                  
                  // Call the flag1 function and store the result in a variable
                const areNamesEqual = flag1();                

                console.log("dataTypeFrom " + fromPort.type);
                console.log("fromPort.name " + toPort.type);
                console.log("fromPort.name " + toPort.name);
                console.log("areNamesEqual " + areNamesEqual);

                if (fromPort.dataType == toPort.dataType && fromNode !== toNode && fromPort.name !== toPort.name){
        
                    //check which receiving input port
                    
                    const fromNodeIndex = fromNode.name;
                    const fromPortIndex = this.hitObject.parent.index;
                    const toNodeIndex = toNode.name;
                    const toPortIndex = this.hitObject.index;
                    const oldConId = this.getConnectionIdOfToPortIndex(hitReleaseObject.parent.parent.label, hitReleaseObject.parent.index);

                    if (oldConId !== null){

                        const oldFromNode = this.uiNodeArray.find(node => node.label === this.connections[oldConId].FromNode);
                        console.log("old from node " + oldFromNode.label);
                        // remove old connection at Target
                        const oldConnection = this.removeItemById(oldConId);

                        console.log("oldConnectionRemovedatIndex: " + oldConId + " conn: " + JSON.stringify(oldConnection));

                        this.removeIndexFromArray(toNode.node.Connections.In, oldConId);
                        this.removeIndexFromArray(oldFromNode.node.Connections.Out, oldConId);
            
                    }
                    else {
                        console.log("OldConn: " + oldConId);
                    }

                    // Create new connection
                    
                    const connObj = this.newConnection(this.hitObject.parent, hitReleaseObject.parent, this.getID());
                    this.connections.push(connObj);
                    fromNode.node.Connections.In.push(this.connections.length-1);
                    toNode.node.Connections.Out.push(this.connections.length-1);

                    // check for existing connection to this port
                    // if any connection to the node.name & node.index:
                    // delete from connection_array & from input-node & from output-node
                    const oldInConnObj = toNode.node.Connections.In[0];

                    toNode.node.Connections.In.forEach(obj => {
                        //console.log("in-connection object: " + JSON.stringify(obj));
                    });


                    this.containerLinks.clear();
                    this.updateConnections(this.uiNodeArray);  

                    console.log(JSON.stringify(this.connections));
                }
            }
            else {
                console.log("nein, es passt nicht und kann nicht verbunden werden");
            }
        } 
    }

    newConnection(port1, port2, id){
        return {Id: id,FromNode: port1.parent.label, FromPort: port1.index, ToNode: port2.parent.label, ToPort: port2.index};
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

        console.log("das ist der status: " + this.selectedNodes[0].label);
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

                const fromNode = uiNodeArray.find(node => node.label === connection.FromNode);
                const toNode = uiNodeArray.find(node => node.label === connection.ToNode);
                const index = connection.FromPort-1;
                const index2 = connection.ToPort-1;

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
        let count = 0;

        const name = this.generateUniqueName(this.uiNodeArray, type);
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

    getID() {
        const ids = new Set(this.connections.map(obj => obj.Id)); // Collect all existing IDs in a Set
      
        let expectedId = 0;
      
        // Find the next available unique ID
        while (ids.has(expectedId)) {
          expectedId++;
        }
      
        return expectedId;
      }

    getConnectionIdOfToPortIndex(toNode, index){
        for (const obj of this.connections) {
            if (obj.ToNode === toNode && obj.ToPort === index) {
                return obj.Id;
            }
        }
        return null; // If no matching element is found
    }

    removeIndexFromArray(array, index){
        for (const i of array) {
            if (i == index) {
                array.splice(i);
            }
        }
    }

    getFromNodeByConnectionId(id){
        const nodeName = this.connections[id].FromNode;
        for (const node of this.uiNodeArray){
            if (nodeName == node.label) {
                return node;
            }
        }
    }

    isPortUsed(toNode, toPortIndex){
        for (let i = 0; i < toNode.node.Connections.In.length; i++) {
            for (let j = 0; j < this.connections.length; j++) {
                if (this.connections[j].ToPort == toPortIndex) {
                    return true;
                }
            }
        }
        return false;
    }

    removeItemById(idToRemove) {
        const indexToRemove = this.connections.findIndex(obj => obj.Id === idToRemove);
      
        if (indexToRemove !== -1) {
            const removedItem = this.connections.splice(indexToRemove, 1);
            return removedItem[0];
        } else {
            return null; // Return null if item with the specified Id is not found
        }
      }

    generateUniqueName(existingObjects, category) {
        const existingNames = existingObjects.map(obj => obj.label);

        console.log("allNames " + existingNames);
        let suffix = 1;
        let newName;
        do {
            newName = `${category}.${String(suffix).padStart(3, '0')}`;
            const found = existingNames.find(name => name === newName);
            if (!found) {
                return newName;
            }
            suffix++;
        } while (true);
      }
}