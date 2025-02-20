function drawLineBresenham(x0, y0, x1, y1, ctx,shape) {

    ctx.beginPath(); 

    ctx.lineWidth = currentPaintingShape? currentPaintingShape.isHighlighted? 3 : currentPaintingShape.lineWidth : lineWidth;
    ctx.strokeStyle = currentPaintingShape? currentPaintingShape.isHighlighted? 'red' : currentPaintingShape.color : selectedColor;

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let p = dx - dy;

    ctx.moveTo(Math.round(x0), Math.round(y0));  


    while (x0 !== x1 || y0 !== y1) {
        ctx.lineTo(Math.round(x1), Math.round(y1)); 


        let e2 = 2 * p;
        if (e2 > -dy) { 
            p -= dy; 
            x0 += sx; 
        }
        if (e2 < dx) { 
            p += dx; 
            y0 += sy; 
        }
    }

    ctx.stroke(); 
}
