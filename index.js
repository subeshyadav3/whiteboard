

/*
Project Name: Interactive Whiteboard App
Group Members:
1. Sangam Paudel
2. Saroj Rawal
3. Subesh Yadav


*/

//  Initializing the canvas 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const width = canvas.width;
const height = canvas.height;

// initializing all buttons for manipulation
const shapeList = document.getElementById('shapeList');
const applyTransformBtn = document.getElementById('applyTransformBtn');
const selectedColorShow = document.getElementById('selectedColorShow');
const colorSelector = document.querySelectorAll('.colorSelector button');
const btnLineInc=document.getElementById('btn-line-inc');
const btnLineDec=document.getElementById('btn-line-dec');
const btnEraserInc=document.getElementById('btn-eraser-inc');
const btnEraserDec=document.getElementById('btn-eraser-dec');
const HighlightModeBtn=document.getElementById('HighlightModeBtn');
const twoDModeBtn=document.getElementById('twoDModeBtn');
const clearAllBtn=document.getElementById('clearAll');
const UndoBtn=document.getElementById('UndoBtn');
const eraserCursorBtn = document.getElementById('eraserCursorBtn');
const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPicker = document.getElementById('colorPicker');

// initializing default variables
let drawing = false;
let startX = null, startY = null;
let selectedShape = null;
let shapes = [];
let freeHandShapes = [];
let eraserShapes = [];
let lineWidth = 2;
let selectedColor = '#FF6347';
let lastX = 0;
let lastY = 0;
let isLineMode = false;

//modes intialization
let isCircleMode = false;
let isRectMode = false;
let isFreehandMode = true;
let is2dTransformMode = false;
let isEraserMode = false;
let eraserSize = 70;
let eraserX = 0, eraserY = 0;
let isUpdating = false;
let isFillMode = false;
let isHighlightedMode = false;
let isFillEraserTriggered = false;
let currentPaintingShape=null

// default color 
selectedColorShow.style.backgroundColor = selectedColor;

// all event handling like click, mousemove, mousedown, mouseup, keydown, keyup

// for erasing all
clearAllBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
    freeHandShapes = [];

});

// for selective erasing

eraserCursorBtn.addEventListener('click', () => {
    isEraserMode = !isEraserMode;
    eraserCursorBtn.style.backgroundColor = isEraserMode ? 'red' : 'white';
    showNotification(`Eraser Mode is ${isEraserMode?'On':'Off'} `);
    isFillEraserTriggered = true;

    if (!isEraserMode) {
        document.body.style.cursor = "default";
    } else {
        is2dTransformMode = false;
        isLineMode = false;
        isCircleMode = false;
        isRectMode = false;
        isFreehandMode = false;
        drawing = false;
        isHighlightedMode = false;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isEraserMode) {
        eraserX = e.offsetX;
        eraserY = e.offsetY;
        if (!isUpdating) {
            isUpdating = true;
            requestAnimationFrame(updateEraserPosition);
        }
    }
});



colorSelector.forEach((button) => {
    button.addEventListener('click', () => {
        selectedColor = button.name;
        console.log(selectedColor);
        selectedColorShow.style.backgroundColor = selectedColor;
        console.log(selectedColor);

        colorPickerBtn.style.backgroundColor = selectedColor;
    });
});


function updateEraserPosition() {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.arc(eraserX, eraserY, eraserSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.fill();
    ctx.stroke();
    isUpdating = false;
}




// undo event 
UndoBtn.addEventListener('click', () => {
    if (isFreehandMode) {
        freeHandShapes.pop();
    } else {
        shapes.pop();
    }
    redrawCanvas();
}
);


// handling modes with key press

document.addEventListener('keydown', (e) => {
    if (e.key == 'e') {
        lineWidth += 1;
    }
    if (e.key == 'd') {
        lineWidth -= 1;
    }
    if (e.key == 'h') {
        isHighlightedMode = !isHighlightedMode;
        showNotification(`Highlighting Mode is  ${isHighlightedMode?'On':'Off'} `);
    }
    if (e.key == 'b') {
        eraserSize += 10;
    }
    if (e.ctrlKey && e.key == 'z') {
        if (isFreehandMode) {
            freeHandShapes.pop();
        } else {
            shapes.pop();
        }
        redrawCanvas();
    }
});


// handling all the modes onclick

btnEraserInc.addEventListener('click', () => {
    eraserSize += 10;
    btnEraserInc.childNodes[1].value=eraserSize;
    btnEraserDec.childNodes[1].value='';
}
);                      

btnEraserDec.addEventListener('click', () => {
    eraserSize -= 10;
    btnEraserDec.childNodes[1].value=eraserSize;
    btnEraserInc.childNodes[1].value='';
}
);

btnLineInc.addEventListener('click', () => {
    lineWidth += 1;
    btnLineInc.childNodes[1].value=lineWidth;
    btnLineDec.childNodes[1].value='';
}
);

btnLineDec.addEventListener('click', () => {
    lineWidth -= 1;
    btnLineDec.childNodes[1].value=lineWidth;
    btnLineInc.childNodes[1].value='';
}
);

// for highlighting mode and 2d transformation mode

HighlightModeBtn.addEventListener('click', () => {
    isHighlightedMode = !isHighlightedMode;
    HighlightModeBtn.style.backgroundColor = isHighlightedMode ? 'red' : 'white';
    showNotification(`Highlighting Mode is ${isHighlightedMode?'On':'Off'} `);
}

);

twoDModeBtn.addEventListener('click', () => {
    is2dTransformMode = !is2dTransformMode;
    twoDModeBtn.style.backgroundColor = is2dTransformMode ? 'red' : 'white';
    showNotification(`2D Transformation Mode is ${is2dTransformMode?'On':'Off'} `);

}

);


// event to pick the color

colorPicker.addEventListener('input', (e) => {
    selectedColor = e.target.value;
    selectedColorShow.style.backgroundColor = selectedColor;
    colorPickerBtn.style.backgroundColor = selectedColor;
    if(colorPickerBtn.style.backgroundColor<='rgb(20, 20, 20)') colorPickerBtn.style.color='white';
});

// for toggling between drawing modes 

document.getElementById('lineModeBtn').addEventListener('click', () => setMode('line'));
document.getElementById('circleModeBtn').addEventListener('click', () => setMode('circle'));
document.getElementById('rectModeBtn').addEventListener('click', () => setMode('rect'));
document.getElementById('freehandModeBtn').addEventListener('click', () => setMode('freehand'));

function setMode(mode) {
    isLineMode = mode === 'line';
    isCircleMode = mode === 'circle';
    isRectMode = mode === 'rect';
    isFreehandMode = mode === 'freehand';
}

// event for filling the color

document.getElementById('fillBtn').addEventListener('click', () => {
    isFillMode = !isFillMode;
    isFillEraserTriggered = true;
    fillBtn.style.backgroundColor = isFillMode ? 'red' : 'white';
    showNotification(`Fill Mode is ${isFillMode?'On':'Off'} `);
    console.log("Fill Mode changed");
    console.log(isFillMode);
});



canvas.addEventListener('click', (e) => {

    if (isFillMode) {
        const x = e.offsetX;
        const y = e.offsetY;
        if(selectedColor=='#000000')  alert('Please select a color to fill');
        console.log(typeof selectedColor)
        const fillColor = hexToRgb  (selectedColor);
        floodFill(x, y, fillColor);
        
    }
});
// takes hex and conver to rgb
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}


// game starts here, for drawing the shapes

canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    drawing = true;
    isEraserMode = false;
    document.body.style.cursor = "default";
    if (isFreehandMode) {
        freeHandShapes.push({ type: 'freehand', points: [{ x: startX, y: startY }], color: selectedColor, lineWidth: lineWidth });
    }
    if (isHighlightedMode) {
        shapes.forEach((shape) => {
            if (isPointInShape(e.offsetX, e.offsetY, shape)) {
                selectedShape = shape;
                highlightSelectedShape(shape);
            }
        });
    }
    currentPaintingShape={color:selectedColor,lineWidth:lineWidth};
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    if (isFreehandMode) {
        handleFreehandDrawing(e, drawing, freeHandShapes);
    }

    if(!isFillMode && !is2dTransformMode && !isFillEraserTriggered ){
       redrawCanvas();
        const x = e.offsetX;
        const y = e.offsetY;
        const width = x - startX;
        const height = y - startY;
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        if (Math.abs(width) < 3 && Math.abs(height) < 3) {
            return;
        }
        if (isLineMode) {

            drawLineBresenham(startX, startY, x, y, ctx);
        } else if (isCircleMode) {

            drawCircle(startX, startY, radius, ctx);
        } else if (isRectMode) {

            drawRect(startX,startY,x,startY,startX,y,x,y, ctx);
        }

    }


});

canvas.addEventListener('mouseup', (e) => {
    if (!drawing) return;
    drawing = false;
    tempShapes = [];
    if (!isFreehandMode) {
        const x = e.offsetX;
        const y = e.offsetY;
        const width = x - startX;
        const height = y - startY;
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        if (Math.abs(width) < 3 && Math.abs(height) < 3) {
            return;
        }
        if (isLineMode) {
            shapes.push({ type: 'line', x1: startX, y1: startY, x2: x, y2: y ,color:selectedColor,lineWidth:lineWidth});
            drawLineBresenham(startX, startY, x, y, ctx);
        } else if (isCircleMode) {
            shapes.push({ type: 'circle', x: startX, y: startY, radius: radius , color:selectedColor,lineWidth:lineWidth}); 
            drawCircle(startX, startY, radius, ctx);
        } else if (isRectMode) {
            shapes.push({type:'rectangle',x1:startX,y1:startY,x2:x,y2:startY,x3:startX,y3:y,x4:x,y4:y,color:selectedColor,lineWidth:lineWidth});
            drawRect(startX,startY,x,startY,startX,y,x,y, ctx);
           
        }
    }
});


// for handling highlight mode

function highlightSelectedShape(shape) {
    currentPaintingShape ={color:selectedColor,lineWidth:lineWidth,isHighlighted:true};
    if (shape.type === 'line') {
        drawLineBresenham(shape.x1, shape.y1, shape.x2, shape.y2, ctx);
    } else if (shape.type === 'circle') {
        drawCircle(shape.x, shape.y, shape.radius, ctx);
    } else if (shape.type === 'rectangle') {
        drawRect(shape.x1,shape.y1,shape.x2,shape.y2,shape.x3,shape.y3,shape.x4,shape.y4,  ctx);
    }
}

// checking if clicked point is in the shape

function isPointInShape(x, y, shape) {
    if (shape.type === 'rectangle') {
        return x >= shape.x1 && x <= shape.x4 && y >= shape.y1 && y <= shape.y4;
    } else if (shape.type === 'circle') {
        const dist = Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2));
        return dist <= shape.radius;
    } else if (shape.type === 'line') {
        return isPointNearLine(x, y, shape);
    }
    return false;
}

// specifically for line with threshold value of 2

function isPointNearLine(px, py, line) {
    const x1 = line.x1, y1 = line.y1, x2 = line.x2, y2 = line.y2;
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const distance = Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) / lineLength;
    return distance < 2;
}

// redraw logic for animating the 2d's

function redrawCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        currentPaintingShape = shape;
        console.log("true")
        if (shape.type === 'line') {
            drawLineBresenham(shape.x1, shape.y1, shape.x2, shape.y2, ctx);
        } else if (shape.type === 'circle') {
            drawCircle(shape.x, shape.y, shape.radius, ctx);
        } else if (shape.type === 'rectangle') {
            drawRect(shape.x1,shape.y1,shape.x2,shape.y2,shape.x3,shape.y3,shape.x4,shape.y4,  ctx);
            
        }
    });
    currentPaintingShape = null;
    freeHandShapes.forEach(shape => {
        shape.points.forEach((point, index) => {

            if (index > 0) {
                const prevPoint = shape.points[index - 1];
                ctx.beginPath();
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = shape.lineWidth;
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
        });
    });

}


// 2d transformation with animation 

applyTransformBtn.addEventListener('click', () => {
    if (!selectedShape) {
        notification('Please select a shape to transform');
        return;
    }
       
    is2dTransformMode = true;
    twoDModeBtn.style.backgroundColor = is2dTransformMode? 'red':'white'
    let originalShape = { ...selectedShape };
    let translateX = parseFloat(document.getElementById('translateX').value);
    let translateY = parseFloat(document.getElementById('translateY').value);
    let scaleX = parseFloat(document.getElementById('scaleX').value);
    let scaleY = parseFloat(document.getElementById('scaleY').value);
    let rotateAngle = parseFloat(document.getElementById('rotateAngle').value);
    let reflectionAxis = document.getElementById('reflectionAxis').value;
    if (translateX === 0 && translateY === 0 && scaleX === 1 && scaleY === 1 && rotateAngle === 0 && reflectionAxis === 'none') {
        alert('No transformation Applied!');
        return;
    }
    if (is2dTransformMode) {
        let steps = reflectionAxis !== 'none' ? 1 : 30;
        let step = 0;
        function animateTransformation() {
            if (step >= steps || !is2dTransformMode) return;
            let progress = (step + 1) / steps;
            let tempShape = { ...originalShape };
            if (translateX || translateY) {
                applyTranslation(tempShape, translateX * progress, translateY * progress);
            }
            if (scaleX !== 1 || scaleY !== 1) {
                applyScaling(tempShape, 1 + (scaleX - 1) * progress, 1 + (scaleY - 1) * progress);
            }
            if (rotateAngle !== 0) {
                applyRotation(tempShape, rotateAngle * progress);
            }
            if (reflectionAxis !== 'none' && step === steps - 1) {
                applyReflection(tempShape, reflectionAxis);
            }

            Object.assign(selectedShape, tempShape);
            redrawCanvas();
            step++;
            setTimeout(animateTransformation, 50);
        }
        animateTransformation();
    }

    // resetting to default values
    document.getElementById('translateX').value = 0;
    document.getElementById('translateY').value = 0;
    document.getElementById('scaleX').value = 1;
    document.getElementById('scaleY').value = 1;
    document.getElementById('rotateAngle').value = 0;
    document.getElementById('reflectionAxis').value = 'none';


});


// extra things for notifcation

function showNotification(message) {
    const container = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2000);
}
