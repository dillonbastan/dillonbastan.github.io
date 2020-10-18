//
var startPlay = false;
var animInit = false;
var actionInit = false;
var nactions = 4;
var minDelay = 5000; //5000
var maxDelay = 240000; //240000
var delaySlope = 1.7;
var delayRange = maxDelay - minDelay;
var actionLoop;
var nimg = 23;
var nsounds = 20;
var nsubAction = 4;
var qindex = -1;
var btnTask;
var btnCounter = 0;
var btnCounter2 = Math.random()*200;
// Manifesto modal
var modal_man = document.getElementById("manModal");
var btn_man = document.getElementById("manBtn");
var span_man = document.getElementById("manClose");
// Action modal
var modal_action = document.getElementById("actionModal");
var span_action = document.getElementById("actionClose");
var modal_question = document.getElementById("questionModal");
//Youtube video
var ytID = '2R58bSNWIoA';
var player = null;
var ytTag = document.createElement('script');
ytTag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(ytTag, firstScriptTag);
// Audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioElement = document.querySelector('audio');
let audioCtx;
let track;
let panner;
var isPlaying = false;
var gain = 1;




//Jquery init
$(document).ready( function() {
	initAudio();
});




//YOUTUBE VIDEO**************************************************
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		videoId: ytID,
		playerVars: {
			modestbranding: 1,
			enablejsapi: 1,
			loop: 1,
			disablekb: 1,
			controls: 0,
			fs: 0
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}
//
function onPlayerReady(event) {
	//event.target.playVideo();
	if (startPlay) {
		player.playVideo();
	}
}
//
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !actionInit) {
	  	actionInit = true;
	  	newAction();
	} else if (event.data == YT.PlayerState.PAUSED) {
		stopAction();
	}
}




//ACTIONS ******************************************
//new action
function newAction() {
	var delayTime = Math.pow(Math.random(),delaySlope)*delayRange + minDelay;
	var actionIndex = rindex(nactions);
	console.log("delay: ", delayTime, "  action: ", actionIndex);
	actionLoop = setTimeout(doAction, delayTime, actionIndex);
}
//
function stopAction() {
	clearTimeout(actionLoop);
	actionInit = false;
}
//
function closeActionModal() {
	modal_action.style.display = "none";
    newAction();
}
//
function closeQuestionModal() {
	modal_question.style.display = "none";
    newAction();
}
//
function doAction(actionIndex) {
	$( "#actionContent" ).empty();
	//actionIndex
	switch (actionIndex) {
		//Picture
		case 0:
			var imgIndex = 1 + rindex(nimg);
			var img = $('<img id="dynamic">');
			img.attr('src', 'images/'+imgIndex+'.JPG');
			img.appendTo('#actionContent');
			//Display
			$( "#actionModal" ).children().css("background-color", "rgba(0,0,0,0)");
			$( "#actionModal" ).children().css("position", "relative");
			$( "#actionModal" ).children().css("top", "0%");
			$( "#actionModal" ).children().css("left", "0%");
			modal_action.style.display = "block";
			break;
		//Message
		case 1:
			var msgIndex = rindex(messages.length);
			var msg = $('<p>'+messages[msgIndex]+'</p>');
			msg.appendTo('#actionContent');
			//Display
			$( "#actionModal" ).children().css("background-color", "#fefefe");
			$( "#actionModal" ).children().css("position", "absolute");
			$( "#actionModal" ).children().css("top", "35%");
			$( "#actionModal" ).children().css("left", "5%");
			modal_action.style.display = "block";
			break;
		//Sound
		case 2:
			var audioIndex = 1 + rindex(nsounds);
			playSound(audioIndex);
			break;
		//sub action
		case 3:
			var subAction = rindex(nsubAction);
			$( "#questionContent" ).empty();
			//subAction
			switch (subAction) {
				// Answer Question
				case 0:
					qindex = rindex(qa.length);
					var form = $( '<label>'+qa[qindex][0]+'</label><br> <input type="text" id="question"> <br><input type="button" value="Check Answer" onclick="checkAns()"><span id="inputErr"></span>' );
					form.appendTo('#questionContent');
					modal_question.style.display = "block";
					$( '#player' ).css("pointer-events", "none");
					break;
				//Survey
				case 1:
					$(surveys[ rindex(surveys.length) ]).appendTo('#questionContent');
					//Display
					modal_question.style.display = "block";
					$( '#player' ).css("pointer-events", "none");
					break;
				//Opinion/Essay
				case 2:
					var opindex = rindex(opinions.length);
					var form = $( '<label>'+opinions[opindex]+'</label><br> <textarea cols="40" rows="5"></textarea> <br><input type="button" value="Submit" onclick="surveyClick()">' );
					form.appendTo('#questionContent');
					modal_question.style.display = "block";
					$( '#player' ).css("pointer-events", "none");
					break;
				//Press the button!
				case 3:
					$( '#player' ).css("pointer-events", "none");
					$( '#floatingBtn' ).css({display: "block"});
					btnTask = setInterval(moveBtn, 30);
					break;
			}
			break;
	}
}




//MANIFESTO MODAL ******************************************
btn_man.onclick = function() {
  modal_man.style.display = "block";
}
span_man.onclick = function() {
  closeManModal();
}
function closeManModal() {
	modal_man.style.display = "none";
    // animate manifesto movement
    if (!animInit) {
    	animInit = true;
		$("#manBtn").animate( {top: '1%'}, {
			duration: 5000, complete: function() {
				$( this ).animate({width: '100%'}, 2000);
			}
		});
		//Auto play at beginning
		if (player === null) startPlay = true;
		else player.playVideo();
    }
}

//ACTION MODAL
span_action.onclick = function() {
  closeActionModal();
}

//ALL MODAL
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal_man) {
    closeManModal();
  }
  if (event.target == modal_action) {
    closeActionModal();
  }
}






//AUDIO*****************************
//Init Audio
function initAudio() {
	audioCtx = new AudioContext();
	track = audioCtx.createMediaElementSource(audioElement);
	// volume
	const gainNode = audioCtx.createGain();
	gainNode.gain.value = gain;
	//Pan
	panner = new StereoPannerNode(audioCtx, {pan: 0});
	// connect our graph
	track.connect(gainNode).connect(panner).connect(audioCtx.destination);
}

//
function playSound(audioIndex) {
	if(!audioCtx) initAudio();
	// check if context is in suspended state (autoplay policy)
	if (audioCtx.state === 'suspended') audioCtx.resume();
	//
	if (isPlaying) {
		audioElement.pause();
	}
	//Load sound
	audioElement.setAttribute('src', 'sounds/'+audioIndex+'.mp3');
	//Pan randomly
	panner.pan.value = Math.random()*2-1;
	//Play
	audioElement.play();
	isPlaying = true;
}

// if track ends
audioElement.addEventListener('ended', () => {
	isPlaying = false;
	newAction();
}, false);




// SUB ACTIONS **********************************
//Question answer
function checkAns() {
	var a = document.getElementById("question");
	//multiple valid answers
	for (var i = 0; i < qa[qindex][1].length; i++) {
		if ( a.value.toLowerCase() == qa[qindex][1][i] ) {
			$( '#player' ).css("pointer-events", "auto");
			closeQuestionModal();
			return;
		} 
	}
	document.getElementById('inputErr').innerHTML = ' Incorrect, try again.';
}
var qa = [
	["Are cats cute? (Yes or No)", ["yes"]],
	["If f(x)=x^2, what is the value of the derivative for x=3? (Hint: Power Rule)", [6]],
	["How many eyes does a fly have? (Enter a number)", [3, "three"]],
	["On a scale from 1-5, how cute is my cat?", [6]],
	["What connects most trees and plants together?", ["mycorrhizal network", "the mycorrhizal network", "mycelium"]],
	["where do potatoes originate from?", ["peru"]],
	["In what region of the brain does the fear response start from?", ["amygdala", "the amygdala"]]
];
//SURVEYS
// close modal when selection chosen
 function surveyClick() {
	$( '#player' ).css("pointer-events", "auto");
	closeQuestionModal();
}
var surveys = [
	'<label>Your species:</label><br> <input type="radio" name="surv" onclick="surveyClick()"> Crane<br> <input type="radio" name="surv" onclick="surveyClick()"> Sloth<br> <input type="radio" name="surv" onclick="surveyClick()"> Tiger<br> <input type="radio" name="surv" onclick="surveyClick()"> Narwhal<br>',
	'<label>Preferred Habitat:</label><br> <input type="radio" name="surv" onclick="surveyClick()"> Mountain<br> <input type="radio" name="surv" onclick="surveyClick()"> City<br> <input type="radio" name="surv" onclick="surveyClick()"> Small Town<br> <input type="radio" name="surv" onclick="surveyClick()"> At sea<br> <input type="radio" name="surv" onclick="surveyClick()"> In Space<br> <input type="radio" name="surv" onclick="surveyClick()"> Underground<br>',
	'<label>Yes or No?</label><br> <input type="radio" name="surv" onclick="surveyClick()"> Yes<br> <input type="radio" name="surv" onclick="surveyClick()"> No<br> <input type="radio" name="surv" onclick="surveyClick()"> Falafel<br>',
	'<label>Choose:</label><br> <input type="radio" name="surv" onclick="surveyClick()"> Existential Crisis<br> <input type="radio" name="surv" onclick="surveyClick()"> Lobotomy<br> <input type="radio" name="surv" onclick="surveyClick()"> Necrophilia<br> <input type="radio" name="surv" onclick="surveyClick()"> Zombie Virus<br>',
	'<label>You are near your home and have to poop really bad. Do you:</label><br> <input type="radio" name="surv" onclick="surveyClick()"> Run really fast home<br> <input type="radio" name="surv" onclick="surveyClick()"> Walk home slow and careful<br> <input type="radio" name="surv" onclick="surveyClick()"> Find the nearest toilet outside<br> <input type="radio" name="surv" onclick="surveyClick()"> Find the nearest bush<br> <input type="radio" name="surv" onclick="surveyClick()"> Do your thing in the street<br>'
];
var opinions = [
	"What is your opinion?",
	"How are you feeling these days?",
	"In your own words, what was the significance of the Battle of Stalingrad?",
	"How do you like this film so far? Be honest.",
	"Critique of Modern Science",
	"Are we alone in the Universe? Please cite your sources.",
	"Thoughts on monogamy?"
];
//BUTTON MOVING
function moveBtn() {
	var phase = btnCounter++ * 0.07;
	var phase2 = btnCounter2++ * 0.02;
	var h = $(window).height() * 0.7;
	var w = $(window).width() * 0.8;
	var x = (Math.sin(phase+phase2) * 0.5 + 0.5) * w;
	var y = (1-(Math.sin(phase-0.25) * 0.5 + 0.5)) * h;
	$('#floatingBtn').css({top: y, left: x});
}
function btnClick() {
	$( '#player' ).css("pointer-events", "auto");
	$('#floatingBtn').css({display: "none"});
	clearInterval(btnTask);
}




// TEXT MESSAGES*************************
var messages = [
	"Warm, cuz it's cold outside. My fluffy purple sweater always does the job. It was a good suggestion from her.",
	"Whatever, tommorrow was another day.",
	"Words, do you say what I mean? Do I know what I mean? Do I know... anything? I know what I know, but, not even this. If I think one brick is the same as another I'm certainly a fool, am I?",
	"Trust my inner child.",
	"Lose all of my paths. Look before I fall. Watch the hills go by. Wonder if it all just won't hold on now. Only you can know what you always knew.",
	"Me hungry",
	"It's not even cold or bad weather. In fact, it's relatively nice!",
	"Waiting or not. I'm not sure which I am doing sometimes. JUST DON'T WAIT! Which I can wish for, or should wish for? Is there any progression really? Nonlinear or otherwise? Gyros are nice because of tzatziki. So if I don't wait for food then what am I doing?",
	"What do I like? Well that's hard to say especially when I really don't know what myself is.",
	"It's like so derivative man..",
	"What are we really hearing? What are we really seeing?",
	"That went nice, I think. But, no but, no but. No But but, do you have a but?",
	"I found some really amazing shots after my phone died. So amazing! Like this trash pile at the cemetary...",
	"So nice to have you back! Love you!",
	"She was just a child when the world was born",
	"The notion of Buddhist chants as a means of aggravation does not please Tibetans for whom the chanting is a religious ritual promoting harmony and peace.",
	"Funk, soul, glam, 50s rock & roll, rhythm & blues, hard rock, everything was up in the air and available to the groups that gingerly negotiated their way from the toilet dressing rooms to the boozer’s stage.",
	"Well holy shit, everybody! Talk about a way to wipe away the Monday blues.",
	"We were escorted up a deck to a deck that was set aside for the ceremony, and there, quite a large party had assembled and kept being added to as others arrived. Everybody was chatting there – seemed to be only admirals and generals – and the main theme of conversation was, this is the day we've been waiting for.",
	"In all honesty: how much useless and annoying “noise” goes rattling through your mind on a daily basis? Would you mute this noise if you could? You actually can! The world around us can be very loud and our minds can easily become polluted by this incessant background noise. We get caught up in the everyday stress and routines and we are influenced by the external ideas of how life should be lived. But did you ever consider surrendering to life and simply letting go? If you didn’t, now is the time! Your life might become much more pleasant.",
	"We pray that the contemporary rhythm and the newly-added bridge will help you experience afresh the timeless theme of this hymn.",
	"HOW DO YOU MEASURE THE SUCCESS OF A WORSHIP SERVICE? I walked to my car disappointed. I found myself wishing our church family was more engaged. More hands in the air. More passionate singing. More of an obvious, visible work of the Lord.",
	"How would one surrender to pain? Perhaps it’s changing the paradigm of thinking when it comes to the pain of labor.",
	"A radioactive substance activity carried out at a nuclear site.",
	"All things considered, the AirPods Pro are significantly better than the similarly priced Sennheiser Momentum True wireless earbuds, for instance.",
	"I'm lost in the labyrinthine souks of Marrakech and I've just had a revelation.",
	"We need to find God and he cannot be found in the noise and restlessness. ... The more we receive in silent prayer, the more we can give in our active life.",
	"To apply for surrender complete this form, which provides further detail on the process."
];



//
function rindex(range) {
	return Math.min( Math.floor(Math.random()*range), range-1 );
}
