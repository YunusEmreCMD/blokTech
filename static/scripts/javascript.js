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



// var meerinfoKnop = document.getElementById("meerinfoKnop");
// var meerinfoDiv = document.getElementById("meerinfoDiv");
// var niks = document.querySelector(".niks");

// meerinfoKnop.addEventListener("click", openmeerInfoOverlay);

// function openmeerInfoOverlay() {
//   meerinfoDiv.classList.toggle("meerInfoOverlay");
//   niks.classList.toggle("niksStyle");
// }




// var meerinfoKnop = document.querySelectorAll("#meerinfoKnop");
// var meerinfoDiv = document.getElementById("meerinfoDiv");
// var niks = document.querySelector(".niks");


// for (i = 0; i < meerinfoKnop.length; i++) {
//   meerinfoKnop[i].addEventListener("click", openmeerInfoOverlay);
// }

// // meerinfoKnop.addEventListener("click", openmeerInfoOverlay);

// function openmeerInfoOverlay() {
//   // meerinfoKnop.classList.remove("link");
//   meerinfoDiv.classList.toggle("meerInfoOverlay");
//   niks.classList.toggle("niksStyle");
// }