class Canvas {

    static drawShape(verteces, fillColor, strokeColor, strokeThickness, fillAlpha, strokeAlpha){
        const graphics = new PIXI.Graphics();
        graphics.beginFill(fillColor, fillAlpha);
        graphics.moveTo(verteces[0].x, verteces[0].y);
        for (var i=1; i < verteces.length; i++){
            graphics.lineTo(verteces[i].x, verteces[i].y);
        }
        graphics.endFill();
        return graphics;
    }

    static applyBlurFilterOnGraphic(graphic, blurX, blurY){
        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.quality = 20;
        blurFilter.blurX = blurX;
        blurFilter.blurY = blurY;
        graphic.filters = [blurFilter];
        return graphic;
    }
    
    static getBitmapFromGraphicsObject(graphicsObject){
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
    
    static maskGraphicByGraphic(graphic, graphicMask){
    
        const canvas = new PIXI.Container();
        const graphicBitmap = Canvas.getBitmapFromGraphicsObject(graphic);
        const maskBitmap = Canvas.getBitmapFromGraphicsObject(graphicMask);
    
        const masklayer = new PIXI.Container();
    
        masklayer.addChild(graphicBitmap);
        canvas.addChild(masklayer);
        masklayer.mask = maskBitmap;
        canvas.addChild(maskBitmap);
        return canvas;
    }
}
