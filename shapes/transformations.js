function applyTranslation(shape, tx, ty) {
  
    if (shape.type === 'line') {
        shape.x1 += tx;
        shape.y1 += ty;
        shape.x2 += tx;
        shape.y2 += ty;

        shape.x1 = Math.round(shape.x1);
        shape.y1 = Math.round(shape.y1);
        shape.x2 = Math.round(shape.x2);
        shape.y2 = Math.round(shape.y2);

            console.log('Line:', JSON.stringify(shape));

    } else if (shape.type === 'circle') {
        shape.x += tx;
        shape.y += ty;
    } else if (shape.type === 'rectangle') {
        shape.x += tx;
        shape.y += ty;
        shape.x1 += tx;
        shape.y1 += ty;

        shape.x = Math.round(shape.x);
        shape.y = Math.round(shape.y);
        shape.x1 = Math.round(shape.x1);
        shape.y1 = Math.round(shape.y1);

    }
   
}



function applyScaling(shape, sx, sy) {
    // console.log('Before Scaling:', JSON.stringify(shape)); 
    // console.log(typeof(shape.x1));

    if (shape.type === 'line') {

        const centerX = shape.x1;
        const centerY = shape.y1;
        
   
        shape.x1 -= centerX;
        shape.y1 -= centerY;
        shape.x2 -= centerX;
        shape.y2 -= centerY;
        
        console.log(sx, sy);
        shape.x1 *= sx;
        shape.y1 *= sy;
        shape.x2 *= sx;
        shape.y2 *= sy;
        

        shape.x1 += centerX;
        shape.y1 += centerY;
        shape.x2 += centerX;
        shape.y2 += centerY;


        shape.x1= Math.round(shape.x1);
        shape.y1= Math.round(shape.y1);
        shape.x2= Math.round(shape.x2);
        shape.y2= Math.round(shape.y2);

    } else if (shape.type === 'circle') {

        const centerX = shape.x;
        const centerY = shape.y;

       

        shape.x -= centerX;
        shape.y -= centerY;

        // redrawCanvas();
        shape.radius *= sx;

        // redrawCanvas();
        shape.x += centerX;
        shape.y += centerY;


    } else if (shape.type === 'rectangle') {

        const centerX = shape.x;
        const centerY = shape.y;


        shape.x -= centerX;
        shape.y -= centerY;
        shape.x1 -= centerX;
        shape.y1 -= centerY;


        shape.x *= sx;
        shape.y *= sy;
        shape.x1 *= sx;
        shape.y1 *= sy;
        

        shape.x += centerX;
        shape.y += centerY;
        shape.x1 += centerX;
        shape.y1 += centerY;

        shape.x= Math.round(shape.x);
        shape.y= Math.round(shape.y);
        shape.x1= Math.round(shape.x1);
        shape.y1= Math.round(shape.y1);

    }

    // console.log('After Scaling:', JSON.stringify(shape)); 
    

}

function applyRotation(shape, angle) {
    const radians = ((Math.PI / 180) * angle).toFixed(3);
    if (shape.type === 'line') {

      
        const cx = shape.x1 
        const cy = shape.y1 

        // Translate line to origin
        shape.x1 -= cx;
        shape.y1 -= cy;
        shape.x2 -= cx;
        shape.y2 -= cy;

        // Rotate the endpoints
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);

        const newX1 = shape.x1 * cosTheta - shape.y1 * sinTheta;
        const newY1 = shape.x1 * sinTheta + shape.y1 * cosTheta;
        const newX2 = shape.x2 * cosTheta - shape.y2 * sinTheta;
        const newY2 = shape.x2 * sinTheta + shape.y2 * cosTheta;

        // Translate back to the original center
        shape.x1 = newX1 + cx;
        shape.y1 = newY1 + cy;
        shape.x2 = newX2 + cx;
        shape.y2 = newY2 + cy;

        shape.x1 = Math.round(shape.x1);
        shape.y1 = Math.round(shape.y1);
        shape.x2 = Math.round(shape.x2);
        shape.y2 = Math.round(shape.y2);



    } else if (shape.type === 'circle') {
       // same thing after rotating the circle
    } else if (shape.type === 'rectangle') {
        //taking all points
        const cx = shape.x;
    const cy = shape.y;

    // Get all four corners of the rectangle
    let points = [
        { x: shape.x, y: shape.y }, // Top-left
        { x: shape.x, y: shape.y1 }, // Top-right
        { x: shape.x1, y: shape.y }, // Bottom-right
        { x: shape.x1, y: shape.y1 }  // Bottom-left
    ];

    // Rotate each point around the center
    points = points.map(point => {
        let x = point.x - cx;
        let y = point.y - cy;
        return {
            x: cx + (x * Math.cos(radians) - y * Math.sin(radians)),
            y: cy + (x * Math.sin(radians) + y * Math.cos(radians))
        };
    });

    // Create a new object with the rotated rectangle's coordinates
    const rotatedRect = {
        type: 'rotated-rectangle',
        x1: Math.round(points[0].x), y1: Math.round(points[0].y), // Top-left
        x2: Math.round(points[1].x), y2: Math.round(points[1].y), // Top-right
        x3: Math.round(points[2].x), y3: Math.round(points[2].y), // Bottom-right
        x4: Math.round(points[3].x), y4: Math.round(points[3].y)  // Bottom-left
    };

    // Push the new rotated rectangle into the shapes array
    shape.rotatedRect=rotatedRect;

    console.log(shape)}

}

function applyReflection(shape, axis) {
    if (axis === 'x') {
        if (shape.type === 'line') {
            shape.y1 = 200+shape.y1;
            shape.y2 = 200+shape.y2;
        } else if (shape.type === 'circle') {
            shape.y = 200+shape.y;
        } else if (shape.type === 'rectangle') {
            shape.y = 200+shape.y;
            shape.y1= 200+shape.y1;
        }
    } else if (axis === 'y') {
        if (shape.type === 'line') {
            shape.x1 = -200+shape.x1;
            shape.x2 = -200+shape.x2;
        } else if (shape.type === 'circle') {
            shape.x = -200+shape.x;
        } else if (shape.type === 'rectangle') {
            shape.x = -200+shape.x;
            shape.x1 = -200+shape.x1;
        }
    }
}

