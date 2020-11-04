/*
Dillon Bastan, 2019.
This is the JavaScript for managing the home page
*/


var scrollLock = false;
var stopScrollThresh = 500;



//Jquery init
$(document).ready( function() {
	$(".fakead").css({ "display": "none" });
});



$(window).bind('mousewheel',function() {
	//Start scroling
	if (!scrollLock) {
		$(".fakead").css({ "display": "block" });
		scrollLock = true;
		//Stop scrolling
		setTimeout(function() {
	    	$(".fakead").css({ "display": "none" });
	        scrollLock = false;
	    }, stopScrollThresh);
	}
});