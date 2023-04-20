  
//canvas working

//Initialize Socket and get context of Canvas.
var socket = io();
var canvas = document.querySelector(".whiteboard");
var context = canvas.getContext("2d");


// Configuration.
var drawing = false;
var current = {
  color: "black"
};

//socket doesn't recieve alot of data that why we create throttle to delay
function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
      var time = new Date().getTime();
  
      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }
// //So what we need is 3 handler 
// //1= when the mouse in on the screen 
// //2= when the mouse move on the screen
// //3= when the mouse go out of the screen
// //also the 4 the one that is touch cancle when we move out of the canvs

function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);      // drawing a line from one point to other point
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();              //create a path
    context.closePath();           //close the path
  
    if (!emit) {
      return;
    }
  
    var w = canvas.width;
    var h = canvas.height;
  
    socket.emit("drawing", {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color
    });
  }


  function onMouseDown(e) {
    drawing = true;
    current.x = e.clientX || e.touches[0].clientX;   //get the X component from the mouse
    current.y = e.clientY || e.touches[0].clientY;   //touches get the point of touch on X and Y cordinates
  }


  function onMouseUp(e) {
    if (!drawing) {
      return;
    }
    drawing = false;      //when cursor is out of the screen and we are not drawing.
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      current.color,
      true
    );
  }

  function onMouseMove(e) {
    if (!drawing) {
      return;
    }
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,    //to get the real current coordinates / position of current hand
      e.clientY || e.touches[0].clientY,
      current.color,
      true
    );
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }

// Desktop Events
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mouseout", onMouseUp, false);
canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

// Mobile Events
canvas.addEventListener("touchstart", onMouseDown, false);
canvas.addEventListener("touchend", onMouseUp, false);
canvas.addEventListener("touchcancel", onMouseUp, false);
canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", onResize, false);
onResize();

function onDrawingEvent(data) {
  var w = canvas.width;
  var h = canvas.height;
  drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
}

socket.on("drawing", onDrawingEvent);
