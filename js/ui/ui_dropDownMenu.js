class DropDownMenu {
    constructor(app){
        this.app = app;
        this.features = null;
        this.container = new PIXI.Container();
        this.mainButton = this.createAddButton(0, 0);
        this.container.addChild(this.mainButton);
        this.container.interactive = true;
        
        // Create the sub-menu container
        this.subMenuContainer = new PIXI.Container();
        this.subMenuContainer.position.set(this.mainButton.width, 0);
        this.container.addChild(this.subMenuContainer);

        this.subMenuContainer.visible = false;
        this.mainButton.on('pointerdown', this.showSubMenu.bind(this));
        this.container.on('pointerout', this.hideSubMenu.bind(this));
    }
    addFeatures(){
        for (let i = 0; i < this.features.length; i++){
            console.log(this.features[i]);
            const button = this.createButton(this.features[i].Type, 0, i * 30);
            this.subMenuContainer.addChild(button);
        }
    }
        // Function to create a button with given label and position
    createButton(label, x, y) {
        const button = new PIXI.Graphics();
        button.beginFill(0xAAAAAA);
        button.drawRect(0, 0, 200, 30);
        button.endFill();
        //button.name = "addMenu";
        button.name = label;
        button.interactive = true;
        button.cursor = 'pointer';
        button.position.set(x, y);
    
        const buttonText = new PIXI.Text(label, { fontSize: 12, fill: 0x000000 });
        buttonText.anchor.set(0.5);
        buttonText.position.set(button.width / 2, button.height / 2);
    
        button.addChild(buttonText);
        button.on('pointerover', function(){button.alpha = .8});
        button.on('pointerout', function(){button.alpha = 1});
        //button.on('click', function(){this.app.uiControls.addNode(label)});
        button.on('click', function() {this.app.uiControls.addNode(label); this.subMenuContainer.visible = false;}.bind(this));
    
        return button;
    }
    
    // Function to toggle the visibility of the sub-menu
    showSubMenu() {
        this.subMenuContainer.visible = true;
    }
    showSubMenuRMB(point) {
        this.subMenuContainer.visible = true;
        this.subMenuContainer.x = point.x;
        this.subMenuContainer.y = point.y;
    }
    hideSubMenu() {
        this.subMenuContainer.visible = false;
    }
    createAddButton(x, y){
        const button = new PIXI.Graphics();
        button.beginFill(0xFFFFFF);
        button.drawRect(0, 0, 40, 40);
        button.endFill();
        button.lineStyle(4, 0x000000);
        button.moveTo(20, 4);
        button.lineTo(20, 36);
        button.moveTo(4, 20);
        button.lineTo(36, 20);
        button.interactive = true;
        button.cursor = 'pointer';
        button.position.set(x, y);
    
        button.on('pointerover', function(){button.alpha = .8});
        button.on('pointerout', function(){button.alpha = 1});
    
        return button;     
    }
}

