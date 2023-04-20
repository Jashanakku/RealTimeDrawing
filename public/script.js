  
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