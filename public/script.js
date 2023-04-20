  
//canvas working

//Initialize Socket and get context of Canvas.
var socket = io();
var canvas = document.querySelector(".whiteboard");
var context = canvas.getContext("2d");


//Configuration 
var drawing = false;
var current ={
    color:"black"
}

//socket doesn't recieve alot of data that why we create throttle to delay
function throttle(callback,delay){
    var previousCall = new Date().getTime();
    return function(){
        var time = new Date().getTime();

        if(time - previousCall >= delay){
            previousCall = time;
            callback.apply(null,arguments);
        }
    };
}
//So what we need is 3 handler 
//1= when the mouse in on the screen 
//2= when the mouse move on the screen
//3= when the mouse go out of the screen
//also the 4 the one that is touch cancle when we move out of the canvs

function drawLine(x0,y0,x1,y1,color,emit){
    //starting and ending cordionates
    context.beginPath();
    context.moveTo(x0,y0);
    context.lineTo(x1,y1);   // drawing a line from one point to other point
    context.strokeStyle = color;
    context.linewidth = 2;
    context.stroke();   //create a path
    context.closePath()  //close the path

    if(!emit){
        return;
    }

    var w = canvas.width;
    var h = canvas.height;

    //sent the data in object way means x0 ,y0
    socket.emit("drawing",{
        
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color

    });
}


function mousedown(e){
    drawing = true;   //when we are start drawing on the canvas
    current.x = e.clientX || e.touches[0].clientX;    //get the X component from the mouse
    current.y = e.clientY || e.touches[0].clientY;    //touches get the point of touch on X and Y cordinates
}

function mouseup(e){
    if(!drawing){
        return;
    }
    drawing = false;  //when cursor is out of the screen and we are not drawing.

}

function mouseover(e){
    if(!drawing){
        return;
    }
    drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,  //to get the real current coordinates / position of current hand
        e.clientY || e.touches[0].clientY,
        current.color,
        true
    );

    //Updating the value of cuurent x and y.
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
}