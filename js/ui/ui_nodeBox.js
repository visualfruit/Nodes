class NodeBox extends PIXI.Container {
    constructor (app, data, type, name){
        super();
        this.app = app;
        this.node = data;
        this.type = type;
        this.label = name;
        
/*         if (data !== null){
            if (this.node.Connections.In.length > 0){
            console.log("node connections: " + this.node.Connections.In[0].From.Node);
            console.log("node connections: " + this.node.Connections.In[0].From.Node);}


        } */
        this.x = Number(data.Position.x);
        this.y = Number(data.Position.y);

        this.itemsCount = 3;
        this.selected = false;
        this.itemIndex = 1;
        this.oldLocation = {x: this.x, y: this.y};
        //this.delta = {x: 0, y: 0};
        this.ports = [];

        //Layout
        //this.container = null;
        this.spacingY = 30;
        this.width = 200;
        this.heightY = (this.itemsCount+1)*this.spacingY;

        //console.log("type" + this.type)
        this.nodeBox = new Box(this.app, 0, 0, 200, 200, this.label);
        this.addChild(this.nodeBox);
        this.#createListItems(this.type);
    }

    updateOldLocation(){
        this.oldLocation.x = this.x;
        this.oldLocation.y = this.y;
    }

    drawBoxSelected(){
        this.nodeBox.drawBackground(this.heightY, 0x00FFFF);
    }

    drawBox(){
        this.nodeBox.drawBackground(this.heightY, 0xEEEEEE);
    }

    #createListItems(type){
        switch(type){
            case "Mesh":
                this.heightY = 3 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Verteces");
                this.#checkBoxListItem("Closed", true);
                break;
            case "DrawShape":
                this.heightY = 8 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas");
                this.#inputListItem("Verteces");
                this.#colourListItem("Fill Colour", this.node.FillColor);
                this.#colourListItem("Stroke Colour", this.node.StrokeColor);
                this.#sliderLimListItem("Stroke Thickness", 0, 100, this.node.StrokeThickness);
                this.#sliderLimListItem("Fill Alpha", 0, 1, this.node.Alpha);
                this.#sliderLimListItem("Stroke Alpha", 0, 100, 50);
                break;
            case "Mask":
                this.heightY = 4 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas");
                this.#inputListItem("Canvas");
                this.#inputListItem("Mask");
                break;
            case "Layers":
                this.heightY = 8 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas");
                this.#inputListItem("Canvas1");
                break;
            case "KBlurXY":
                this.heightY = 6 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas");
                this.#inputListItem("Canvas");
                this.#sliderLimListItem("Blur X", 0, 500, this.node.BlurX);
                this.#sliderLimListItem("Blur Y", 0, 500, this.node.BlurY);
                this.#checkBoxListItem("Mute", false);
                break;
            case "Subdivision":
                this.heightY = 4 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Verteces");
                this.#inputListItem("Verteces");
                this.#sliderLimListItem("Iterations", 0, 5, this.node.Iterations);
                break;
            case "slider8":
                this.#slider8ListItem("Unlimited", 59, true);
                break;
            case "colour":
                this.#colourListItem("Colour", "#FF0000");
                break;
            case "Output":
                this.heightY = 2 * this.spacingY;
                this.drawBox();
                this.#inputListItem("Canvas");
                break;
        }
    }

    #inputListItem(label){
        let port = new Nodeport(this.app, label, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const labelText = new PIXI.Text(label, { fontSize: 16, fill: 0x000000 });
        labelText.position.set(15, this.itemIndex*this.spacingY + 4);
        this.addChild(labelText);

        this.itemIndex +=1;
    }
    #outputListItem(label){
        let port = new Nodeport(this.app, label, "Output", this.itemIndex);
        port.x = this.width;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const labelText = new PIXI.Text(label, { fontSize: 16, fill: 0x000000 });
        labelText.anchor.set(1, 0);
        labelText.position.set(this.width- 25, this.itemIndex*this.spacingY + 4);
        this.addChild(labelText);

        this.itemIndex +=1;
    }
    #checkBoxListItem(label, bool){
        let port = new Nodeport(this.app, label, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const checkBox = new Checkbox(this.app, 170, this.itemIndex*this.spacingY+5, label);
        this.addChild(checkBox.container);

        const checkBoxText = new PIXI.Text(label, { fontSize: 16, fill: 0x000000 });
        checkBoxText.position.set(15, this.itemIndex*this.spacingY + 4);
        this.addChild(checkBoxText);

        this.itemIndex +=1;
    }
    #sliderLimListItem(label, min, max, value){
        let port = new Nodeport(this.app, label, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const slider = new Slider(app, 15, this.itemIndex*this.spacingY, 175, min, max, value, label);
        this.addChild(slider.container);

        this.itemIndex +=1;
    }
    #slider8ListItem(label, value, allowNegative){
        let port = new Nodeport(this.app, label, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);
        
        this.itemIndex +=1;
    }
    #colourListItem(label, value){
        let port = new Nodeport(this.app, label, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY + 15;
        this.addChild(port);
        this.ports.push(port);

        const colourButton = new LabeledButton(this.app, 15, this.itemIndex*this.spacingY, 175, 25, label)
        this.addChild(colourButton.container);
        this.itemIndex +=1;             
    }
    #colourOutputListItem(label, value){
        let port = new Nodeport(this.app, label, "Input", this.itemIndex);
        port.x = this.width;
        port.y = this.itemIndex*this.spacingY + 15;
        this.addChild(port);
        this.ports.push(port);
        let colourItem = new Colourfield(label, value);
        colourItem.x = 10;
        colourItem.y = this.itemIndex*this.spacingY;
        this.addChild(colourItem);   
        this.itemIndex +=1;
    }
}