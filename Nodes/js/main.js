PIXI.settings.PREFER_ENV = 'WEBGL2';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x555555,
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
let connections = [];

const canvas = new PIXI.Container();
app.stage.addChild(canvas);

const container = new PIXI.Container();
const containerLinks = new PIXI.Graphics();
const connectionLine = new PIXI.Graphics();
container.addChild(containerLinks);
container.addChild(connectionLine);
const menuContainer = new PIXI.Container();
const selRect = new SelectionRectangle(app);
const menu = new DropDownMenu(app, null);
menuContainer.addChild(menu.container);
app.stage.addChild(container);
app.stage.addChild(menuContainer);

const dataControls = new DataControls(app, vfData, uiNodeArray, uiNodeTemplateArray, nodes, container);

dataControls.loadJSON();
dataControls.loadMenuData(menu);

app.uiControls = new UIControls(app, uiNodeArray, connections, uiNodeTemplateArray, container, containerLinks, connectionLine, selRect);
const viewControls = new ViewControls(app, container, canvas);




let gr0 = new PIXI.Graphics();
gr0.blurAmount = 0;
gr0.beginFill(0xff0000);
gr0.drawCircle(1100, 800, 400);
gr0.endFill();
gr0.beginFill(0x96a7e2);
gr0.drawCircle(1400, 1300, 300);
gr0.endFill();
gr0.beginFill(0x08a7f);
gr0.drawCircle(1800, 1500, 800);
gr0.endFill();
canvas.addChild(gr0);
let gr1 = new PIXI.Graphics();
gr1.blurAmount = 0;
gr1.beginFill(0xff0000);
gr1.drawCircle(100, 100, 100);
gr1.endFill();
gr1.beginFill(0x96a7e2);
gr1.drawCircle(400, 300, 300);
gr1.endFill();
gr1.beginFill(0x08a7f);
gr1.drawCircle(800, 500, 500);
gr1.endFill();
//app.stage.addChild(gr1);
canvas.addChild(gr1);
applyBlurFilterOnGraphic(gr1, 1000);

let gr2 = new PIXI.Graphics();
gr2.blurAmount = 0;
gr2.beginFill(0xff00FF);
gr2.moveTo(100, 100);
gr2.lineTo(1200, 100);
gr2.lineTo(1000, 800);
gr2.lineTo(350, 800);
gr2.beginHole();
gr2.moveTo(120,120);
gr2.lineTo(150,120);
gr2.lineTo(150,150);
gr2.endFill();
applyBlurFilterOnGraphic(gr2, 160);

maskGraphicByGraphic(gr1, gr2, 0);

function applyBlurFilterOnGraphic(graphic, blurValue){
  const blurAmount = blurValue;
  const blurFilter = new PIXI.filters.BlurFilter();
  blurFilter.quality = 50;
  graphic.blurAmount = blurValue;
  graphic.filters = [blurFilter];
  blurFilter.blur = blurAmount;      
}

function maskGraphicByGraphic(graphic, graphicMask, blurAmount){
  let texture;
  const masklayer = new PIXI.Container();
  const bounds = new PIXI.Rectangle();
  const focus = new PIXI.Sprite(texture);
  bounds.width = (graphic.width + graphic.blurAmount) * 2;
  //bounds.width = graphic.width*2;
  bounds.height = (graphic.height + graphic.blurAmount) * 2;

  texture = app.renderer.generateTexture(graphicMask, PIXI.SCALE_MODES.NEAREST, 2, bounds);
  masklayer.addChild(graphic);
  //app.stage.addChild(masklayer);
  canvas.addChild(masklayer);
  focus.texture = texture;   
  masklayer.mask = focus;
  //app.stage.addChild(focus);
  canvas.addChild(focus);
}

gr1.beginFill(0x54a76b);
gr1.drawCircle(400, 400, 100);
gr1.endFill();
gr1.beginFill(0xffaa7b);
gr1.drawCircle(500, 400, 300);
gr1.endFill();
gr1.beginFill(0xffa3333);
gr1.drawCircle(1100, 400, 300);
gr1.endFill();

//applyBlurFilterOnGraphic(gr1, 220);
//maskGraphicByGraphic(gr1, gr2, 0); */

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
  
  
  