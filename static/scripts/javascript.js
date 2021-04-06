// JavaScript Document

/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
/*eslint-env browser*/
/*eslint 'no-console':0*/

console.log("hello");

var filterKnop = document.getElementById("filter-knop");

filterKnop.addEventListener("click", openFilterOverlay);

function openFilterOverlay() {
  document.body.classList.toggle("filterOverlayOpenen");
}


var imagesArray = ["dog.jpg", "fox.jpg", "mouse.jpg", "alligator.jpg", "fish.jpg", "parrot.jpg", "cat.jpg"];


//create a function named displayImage
//it should not have any values passed into it