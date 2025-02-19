function drawRect(x1,y1,x2,y2,x3,y3,x4,y4,ctx) {

    drawLineBresenham(x1,y1,x2,y2,ctx);
    drawLineBresenham(x1,y1,x3,y3,ctx);
    drawLineBresenham(x3,y3,x4,y4,ctx);
    drawLineBresenham(x4,y4,x2,y2,ctx);
}
