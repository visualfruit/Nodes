PIXI.settings.PREFER_ENV = 'WEBGL2';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xCCCCCC,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  });
document.body.appendChild(app.view);

//INIT /////////////////////////////////////////

vfUI = new WFUI(app);
let vfData = null;
let uiNodeTemplateArray = [];
let uiNodeArray = [];
let nodes = {};

const container = new PIXI.Container();
const containerLinks = new PIXI.Graphics();
const connectionLine = new PIXI.Graphics();
container.addChild(containerLinks);
container.addChild(connectionLine);
const menuContainer = new PIXI.Container();
const selRect = new SelectionRectangle(app);
const menu = new DropDownMenu(this.app, null);
menuContainer.addChild(menu.container);
app.stage.addChild(container);
app.stage.addChild(menuContainer);

app.uiControls = new UIControls(app, uiNodeArray, uiNodeTemplateArray, container, containerLinks, connectionLine, selRect);
const dataControls = new DataControls(app, vfData, uiNodeArray, uiNodeTemplateArray, nodes, container);
const viewControls = new ViewControls(app, container);

dataControls.loadJSON();
dataControls.loadMenuData(menu);




///////////////////////
// Resize handler to update the app size on window resize
const resizeHandler = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Resize the renderer
    app.renderer.resize(width, height);
  
    // Update the stage scale based on the new dimensions
    /*const scaleFactor = Math.min(width / appWidth, height / appHeight);
    console.log(scaleFactor);
    app.stage.scale.set(scaleFactor);*/
    
    // Center the stage
    //app.stage.position.set(width / 2, height / 2);
  };
  
  // Call resizeHandler on initial load and whenever the window is resized
  window.addEventListener('resize', resizeHandler);
  resizeHandler();
  
  
  