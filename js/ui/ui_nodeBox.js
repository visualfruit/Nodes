class NodeBox extends PIXI.Container {
    constructor (app, data){
        super();
        this.app = app;
        this.node = data;
        this.type = data.Type;
        this.label = data.Name;
        
        this.x = data.Position.x;
        this.y = data.Position.y;

        this.itemsCount = 3;
        this.selected = false;
        this.itemIndex = 1;
        this.oldLocation = {x: this.x, y: this.y};
        //this.delta = {x: 0, y: 0};
        this.ports = [];

        //Change Evaluation
        //this.changesToPath = true;

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
        this.nodeBox.drawBackground(this.heightY, 0xffffff, 1);
    }

    drawBox(){
        this.nodeBox.drawBackground(this.heightY, 0x000000, 1);
    }

    #createListItems(type){
        switch(type){
            case "Mesh":
                this.heightY = 2 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Vertices", "Vertices");
                //this.#checkBoxListItem("Closed", "Boolean", true);
                break;
            case "DrawShape":
                this.heightY = 8 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas", "Canvas");
                this.#inputListItem("Vertices", "Vertices");
                this.#colourListItem("Fill Colour", "Colour", this.node.FillColor);
                this.#colourListItem("Stroke Colour", "Colour", this.node.StrokeColor);
                this.#sliderLimListItem("Stroke Thickness", "Int", 0, 100, this.node.StrokeThickness);
                this.#sliderLimListItem("Fill Alpha", "Int", 0, 1, this.node.FillAlpha);
                this.#sliderLimListItem("Stroke Alpha", "Int", 0, 100, 50);
                break;
            case "Mask":
                this.heightY = 4 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas", "Canvas");
                this.#inputListItem("Canvas", "Canvas");
                this.#inputListItem("Mask", "Canvas");
                break;
            case "Layers":
                this.heightY = 8 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas", "Canvas");
                this.#inputListItem("Canvas1", "Canvas");
                break;
            case "KBlurXY":
                this.heightY = 6 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Canvas", "Canvas");
                this.#inputListItem("Canvas", "Canvas");
                this.#sliderLimListItem("Blur X", "Int", 0, 500, this.node.BlurX);
                this.#sliderLimListItem("Blur Y", "Int", 0, 500, this.node.BlurY);
                this.#checkBoxListItem("Mute", "Boolean", false);
                break;
            case "Subdivision":
                this.heightY = 4 * this.spacingY;
                this.drawBox();
                this.#outputListItem("Verteces", "Verteces");
                this.#inputListItem("Verteces", "Verteces");
                this.#sliderLimListItem("Iterations", "Int", 0, 5, this.node.Iterations);
                break;
            case "slider8":
                this.#slider8ListItem("Unlimited", "Int", 59, true);
                break;
            case "colour":
                this.#colourListItem("Colour", "Colour", "#FF0000");
                break;
            case "Output":
                this.heightY = 2 * this.spacingY;
                this.drawBox();
                this.#inputListItem("Canvas", "Canvas");
                break;
        }
    }

    #inputListItem(label, dataType){
        let port = new Nodeport(this.app, label, dataType, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const labelText = new PIXI.Text(label, { fontSize: 14, fill: 0xffffff });
        labelText.position.set(15, this.itemIndex*this.spacingY + 4);
        this.addChild(labelText);

        this.itemIndex +=1;
    }
    #outputListItem(label, dataType){
        let port = new Nodeport(this.app, label, dataType, "Output", this.itemIndex);
        port.x = this.width;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const labelText = new PIXI.Text(label, { fontSize: 14, fill: 0xffffff });
        labelText.anchor.set(1, 0);
        labelText.position.set(this.width- 25, this.itemIndex*this.spacingY + 4);
        this.addChild(labelText);

        this.itemIndex +=1;
    }
    #checkBoxListItem(label, dataType, bool){
        let port = new Nodeport(this.app, label, dataType, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const checkBox = new Checkbox(this.app, 170, this.itemIndex*this.spacingY+5, label);
        checkBox.setToggle(bool);
        this.addChild(checkBox.container);

        const checkBoxText = new PIXI.Text(label, { fontSize: 16, fill: 0x000000 });
        checkBoxText.position.set(15, this.itemIndex*this.spacingY + 4);
        this.addChild(checkBoxText);

        this.itemIndex +=1;
    }
    #sliderLimListItem(label, dataType, min, max, value){
        let port = new Nodeport(this.app, label, dataType, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        const slider = new Slider(app, 15, this.itemIndex*this.spacingY, 175, min, max, value, label);
        this.addChild(slider.container);

        this.itemIndex +=1;
    }
    #slider8ListItem(label, dataType, value, allowNegative){
        let port = new Nodeport(this.app, label, dataType, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY+15;
        this.addChild(port);
        this.ports.push(port);

        this.itemIndex +=1;
    }
    #colourListItem(label, dataType, color){
        let port = new Nodeport(this.app, label, dataType, "Input", this.itemIndex);
        port.x = 0;
        port.y = this.itemIndex*this.spacingY + 15;
        this.addChild(port);
        this.ports.push(port);

        const colourButton = new LabeledButton(this.app, 15, this.itemIndex*this.spacingY, 175, 25, label);
        colourButton.changeColor(color);
        this.addChild(colourButton.container);
        this.itemIndex +=1;             
    }
    /*
    #colourOutputListItem(label, dataType, value){
        let port = new Nodeport(this.app, label, dataType, "Input", this.itemIndex);
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
    */
}