function drawCircle(x, y, r, ctx) {
    let xc = x;  
    let yc = y;   
    let xi = 0;   
    let yi = r;   
    let d = 1 - r; 
    ctx.fillStyle=  currentPaintingShape? currentPaintingShape.isHighlighted? 'red' : currentPaintingShape.color : selectedColor;

    while (xi < yi) {
        ctx.fillRect(xc + xi, yc + yi, 1, 1);
        ctx.fillRect(xc - xi, yc + yi, 1, 1);
        ctx.fillRect(xc + xi, yc - yi, 1, 1);
        ctx.fillRect(xc - xi, yc - yi, 1, 1);
        ctx.fillRect(xc + yi, yc + xi, 1, 1);
        ctx.fillRect(xc - yi, yc + xi, 1, 1);
        ctx.fillRect(xc + yi, yc - xi, 1, 1);
        ctx.fillRect(xc - yi, yc - xi, 1, 1);
        
        if (d < 0) {

            xi++;
            d = d + 2 * xi + 1;
        } else {

            xi++;
            yi--;
            d = d + 2 * (xi - yi) + 1;
        }


       
    }
}
