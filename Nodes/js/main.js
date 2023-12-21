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
const colorPicker = new ColorPicker(app);

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

container.addChild(colorPicker);

const dataControls = new DataControls(app, vfData, uiNodeArray, uiNodeTemplateArray, nodes, container);

dataControls.loadJSON();
dataControls.loadMenuData(menu);

app.uiControls = new UIControls(app, uiNodeArray, connections, uiNodeTemplateArray, container, containerLinks, connectionLine, selRect);
const viewControls = new ViewControls(app, container, canvas);


/* let onlyOnce = 0;

// Create a render texture
const renderTexture = PIXI.RenderTexture.create({
  width: app.renderer.width,
  height: app.renderer.height,
}); */

const blurredSprite = null;
let gr0 = new PIXI.Graphics();
gr0.blurX = 1000;
gr0.blurY = 200;
gr0.beginFill(0x9897a2);
gr0.drawCircle(1100, 800, 400);
gr0.endFill();
gr0.beginFill(0x96a7e2, 0.5);
gr0.drawCircle(1400, 1000, 300);
gr0.endFill();
gr0.beginFill(0x08a7f, 0.7);
gr0.drawCircle(1800, 1500, 800);
gr0.endFill();
//canvas.addChild(gr0);
let gr1 = new PIXI.Graphics();
gr1.blurX = 120;
gr1.blurY = 0;
gr1.beginFill(0xff0000);
gr1.drawCircle(100, 100, 100);
gr1.endFill();
gr1.beginFill(0x96a7e2, 0.5);
gr1.drawCircle(400, 300, 300);
gr1.endFill();
gr1.beginFill(0x08a7f, 0.5);
gr1.drawCircle(800, 500, 500);
gr1.endFill();
//app.stage.addChild(gr1);
//canvas.addChild(gr1);


//let bitmap = new Bitmap();

let gr2 = new PIXI.Graphics();
gr2.blurX = 300;
gr2.blurY = 50;
gr2.beginFill(0xff00FF);
gr2.moveTo(100, 100);
gr2.lineTo(2200, 100);
gr2.lineTo(2300, 1800);
gr2.lineTo(350, 800);
gr2.beginHole();
gr2.moveTo(120,120);
gr2.lineTo(150,120);
gr2.lineTo(150,150);
gr2.endFill();

applyBlurFilterOnGraphic(gr1, gr1.blurX, gr1.blurY);
applyBlurFilterOnGraphic(gr0, gr0.blurX, gr0.blurY);
applyBlurFilterOnGraphic(gr2, gr2.blurX, gr2.blurY);

maskGraphicByGraphic(gr1, gr2);
maskGraphicByGraphic(gr0, gr2);



function applyBlurFilterOnGraphic(graphic, blurX, blurY){

  const blurFilter = new PIXI.filters.BlurFilter();
  blurFilter.quality = 20;
  blurFilter.blurX = blurX;
  blurFilter.blurY = blurY;
  graphic.filters = [blurFilter];
  
}

function getBitmapFromGraphicsObject(graphicsObject){
  let graphicTexture;
  const graphicBoundaryBox = new PIXI.Rectangle();
  const graphicBitmap = new PIXI.Sprite(graphicTexture);
  graphicBoundaryBox.x = -graphicsObject.blurX;
  graphicBoundaryBox.y = -graphicsObject.blurY;
  graphicBoundaryBox.width = (graphicsObject.width + graphicsObject.blurX) * 2;
  graphicBoundaryBox.height = (graphicsObject.height + graphicsObject.blurY) * 2;

  graphicTexture = app.renderer.generateTexture(graphicsObject, PIXI.SCALE_MODES.NEAREST, 1, graphicBoundaryBox);
  graphicBitmap.texture = graphicTexture;
  return graphicBitmap;
}

function maskGraphicByGraphic(graphic, graphicMask){

  let graphicBitmap = getBitmapFromGraphicsObject(graphic);
  let maskBitmap = getBitmapFromGraphicsObject(graphicMask);

  const masklayer = new PIXI.Container();

  masklayer.addChild(graphicBitmap);
  canvas.addChild(masklayer);
  masklayer.mask = maskBitmap;
  canvas.addChild(maskBitmap);
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
  
  
  