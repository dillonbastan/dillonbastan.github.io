/*
Dillon Bastan, 2020.
*/


//
var youtubeKeys = [
	"AIzaSyCpB10UbLFofyzhUQ5QSFQ8AIHN_rMp6zM",
	"AIzaSyDk8Wk-LcnV5vjoV2VPJwlvxIsQPhqjQhM",
	"AIzaSyAChiWW-MQaBpUKLEiBgA20x-jRGvVAwC8",
	"AIzaSyALG__rzDT7G86RuGJVIW6UIRoWYOVbI0A"
];
var youtubeKey = youtubeKeys[0];
var youtubeKeyIndex = 0;
//
var googleKeys = [
	"AIzaSyAMY1UFb47kcV4pHINLkOobAfKSQEmPS9w",
	"AIzaSyA1ibQUTXDFpIBIFI65XMtN2-F2gDj9NMc",
	"AIzaSyCfrZ2CykZM5VHsoZXF3l5oM0_3H0BON7U",
	"AIzaSyDtGXDj71gdmDEU4O6ZKjkA3jpBRV7me74",
	"AIzaSyA-b51Jpa-FJKk6cBXRRZherKBDxYzObgU",
	"AIzaSyC0hGac9MMuc9LVk7RiS0v25wGXjC_6WhI",
	"AIzaSyDYqjtYkQCgvKd4_l2SaWxNniMc4Fvgg0M",
	"AIzaSyAu37acQ7kgPxdpY1qa8pyl-2qhEfPF68s",
	"AIzaSyBi-DOXv_FR25hxX_aSiVJ2wq_68Lns4Gw",
	"AIzaSyD_wIIf7tPDgxKmg9xsw-Afz_8DTCMWUXc",
	"AIzaSyByrfZcRMQVvZI-sBJXpKO-YQlkxHcSPFM",
	"AIzaSyCMZub5tDglrt9iARZoNmE_vTG_w7Ixbgg"
];
var googleKey = googleKeys[0];
var googleKeyIndex = 0;
//
var googleSearchID = "008133755681676510243:6h0xi4ntsgi";
var imageSearchID = "000119394994078803806:wyryaw2b7wt";
//
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//
var delay;
var nwords;
var keyword;
var searchResults;
var choice;
var delayTime;
var nchoices;
var mediaType;
var functions;
var delayTimeMin = 2000;
var delayTimeMax = 60000;
var alphabet = [
	'a','b','c','d','e','f','g','h',
	'i','j','k','l','m','n','o','p',
	'q','r','s','t','u','v','w','x','y','z'
];
//


//
function init() {
	functions = [getVideo, getImage, getAudio, getWebPage, getNothing, getText, getColor];
	nchoices = functions.length;
	//
    gapi.client.setApiKey(youtubeKey);
    gapi.client.load("youtube", "v3", function() {
        newContent();
    });
}

//
$(document).ready( function() {
	alert("Welcome to No-Continuity Browsing! Enable audio for the full experience. \n\nIf the webpage stops changing for more than 2 minutes, you may have to refresh the page. \n\nWill improve this site over time, adding more languages, search engines and smoother transitions.");
});


//
function newContent() {
	delayTime = delayTimeMin + Math.round( Math.pow(Math.random(),3)*delayTimeMax);
	choice = Math.min( Math.floor( Math.random()*nchoices ), nchoices-1 );
	console.log("Choice Index:", choice);
	//
	mediatype = "";
	switch(choice) {
		case 0:
			mediaType = "video";
			break;
		case 1:
			mediaType = "image";
			break;
		case 2:
			mediaType = "audio";
			break;
		case 3:
			mediaType = "webpage";
			break;
	}
	//
	getKeyword();
}

//
function updateContent(newElement) {
	$("#content").remove();
	$(".mainContent").append(newElement);
	delay = setTimeout( function() {newContent();}, delayTime);
}

//
function getKeyword() {
	keyword = "";
	nwords = Math.floor( Math.random()*3 ) + 1;
	getNextWord();
}

//
function getNextWord() {
	if (nwords > 0) {
		nwords--;
		getRandomWord();
	} else {
		getSearchResult(keyword, mediaType);
	}
}

//
function getRandomWord() {
	//
	!async function(){
		//
		var letter = alphabet[ Math.round( Math.random()*25 ) ];
		//
		await fetch("https://api.datamuse.com/words?sp="+letter+'*')
		  .then((response) => {
		    return response.json();
		  })
		  .then((data) => {
		  	var nresults = data.length;
		  	var selection = Math.round( Math.random() * (nresults-1) );
		  	keyword += data[selection].word + " ";
		  	getNextWord();
		  });
	}();
}

//
function getSearchResult(search, type) {
	// Youtube search
	if (type === "video") {
		// prepare the request
		var request = gapi.client.youtube.search.list({
		    part: "snippet",
		    type: "video",
		    q: search,
		    order: "relevance"
		}); 
		// execute the request
		request.execute(function(response) {
			//
			if (response.error && response.error.code === 403) {
				nextKey("youtube");
				console.log("youtube api key index", youtubeKeyIndex);
				return;
			}
			//
			if (!response.result) {
				getKeyword();
				return;
			}
			//
		  	getItemFromSearchResults(response.result.items);
		});
	} 
	// Archive sound search
	else if (type === "audio") {
		search = "https://archive.org/advancedsearch.php?q="+search+"&fl[]=identifier,mediatype&mediatype=audio&output=json";
		!async function(){
			await fetch(proxyUrl + search)
			  .then((response) => {
			    return response.json();
			  })
			  .then((data) => {
			  	getItemFromSearchResults(data.response.docs);
			  });
		}();
	}
	// Google search
	else if (type === "image" || type === "webpage") {
		var searchID;
		if (type === "image") {
			search += "&searchType=image";
			searchID = imageSearchID;
		} else {
			searchID = googleSearchID;
		}
		search = "https://www.googleapis.com/customsearch/v1?key="+googleKey+"&cx="+searchID+"&q="+search;
		!async function(){
			await fetch(proxyUrl + search)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					if (data.error) {
						console.log("google api key index", googleKeyIndex);
						nextKey("google");
						return;
					}
					getItemFromSearchResults(data.items);
				})
		}();
	}
	//
	else {
		functions[choice]();
	}
}

//
function getItemFromSearchResults(results) {
	if (!results) {
  		getKeyword();
  		return;
  	}
  	//
  	var nresults = results.length;
  	var selection = Math.round( Math.random() * (nresults-1) );
  	searchResults = results[selection];
  	//
  	if (!searchResults) {
  		getKeyword();
  		return;
  	}
  	//
  	functions[choice]();
}


//
function getNothing() {
	updateContent("");
}


//
function getImage() {
	if (!searchResults.link) {
		getKeyword();
		return;
	}
	var element = "<img id=\"content\" src=\""+searchResults.link+"\"</img>";
	updateContent(element);
}

//
function getText() {
	var element = "<p id=\"content\">" + keyword + "</p>";
	updateContent(element);
}


//
function getWebPage() {
	if (!searchResults.link) {
		getKeyword();
		return;
	}
	var url = searchResults.link;
	url = url.replace("watch?v=", "embed/");
	url = url.replace("http:", "https:");
	//
	var element = "<iframe id=\"content\" onload=\"chkFrame(this)\" src=\"" + url + "\"style=\"border:none;\"><div id=\"fake\"></div></iframe>";
	updateContent(element);
}


//
function getColor() {
	var r = Math.round( Math.random()*255 );
	var g = Math.round( Math.random()*255 );
	var b = Math.round( Math.random()*255 );
	//
	var element = "<div id=\"content\" class=\"solidColor\" style=\"background-color:rgb(" + r + ',' + g + ',' + b + ")\"></div>";
	updateContent(element);
}


//
function getVideo() {
	if (!searchResults.id || !searchResults.id.videoId) {
		getKeyword();
		return;
	}
	var videoUrl = searchResults.id.videoId;
	//
	var element = "<iframe id=\"content\" src=\"https://www.youtube.com/embed/"+videoUrl+"?autoplay=1&showinfo=0&controls=0\" allow=\"autoplay\" modestbranding=1></iframe>";
	updateContent(element);
}


//
function getAudio() {
	if (!searchResults.mediatype || searchResults.mediatype !== "audio") {
		getKeyword();
		return;
	}
	//
	var search = "https://archive.org/metadata/"+searchResults.identifier+"/files";
	// Query the list of files and choose one
	!async function(){
		await fetch(proxyUrl + search)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (!data.result) {
					getKeyword();
				return;
				}
				//
				var url = "";
				var found = false;
				for (var i = 0; i < data.result.length; i++) {
					if (data.result[i].format === "VBR MP3") {
						url = "https://archive.org/download/"+searchResults.identifier+"/"+data.result[i].name;
						found = true;
						break;
					}
				}
				if (!found) {
					getKeyword();
				return;
				}
				//
				var element = "<audio allow=\"autoplay\"  id=\"content\"  onerror=\"loadError(this);\" controls autoplay> <source onerror=\"loadError(this);\" src=\""+url+"\" type=\"audio/mpeg\"> </audio>";
				//style=\"position:fixed; top:-100px;\"
				updateContent(element);
			})
			.catch((error) => {
				loadError(error);
			});
	}();
}


//
function chkFrame(fr) {
	//
	//console.log("CHECK:", fr, $(fr).html());
	if (false) {
		console.log("FAILEDLOAD!!!!!!***********");
		clearTimeout(delay);
		getKeyword();
	}
}


//
function loadError(e) {
	clearTimeout(delay);
	getKeyword();
}


//
function nextKey(keytype) {
	switch(keytype) {
		case "google":
			googleKeyIndex++;
			if (googleKeyIndex >= googleKeys.length) {
				newContent();
				return;
			}
			//
			googleKey = googleKeys[googleKeyIndex];
			break;
		case "youtube":
			youtubeKeyIndex++;
			if (youtubeKeyIndex >= youtubeKeys.length) {
				newContent();
				return;
			}
			//
			youtubeKey = youtubeKeys[youtubeKeyIndex];
			gapi.client.setApiKey(youtubeKey);
			break;
	}
	getKeyword();
}







//Specify speed of scroll. Larger=faster (ie: 5)
var scrollspeed=cache=1

//Specify intial delay before scroller starts scrolling (in miliseconds):
var initialdelay=3000

function initializeScroller(){
	dataobj=document.all? document.all.datacontainer : document.getElementById("content")
	dataobj.style.top="5px"
	setTimeout("getdataheight()", initialdelay)
}

function getdataheight(){
	thelength=dataobj.offsetHeight
	if (thelength==0)
	setTimeout("getdataheight()",10)
	else
	scrollDiv()
}

function scrollDiv(){
	dataobj.style.top=parseInt(dataobj.style.top)-scrollspeed+"px"
	if (parseInt(dataobj.style.top)<thelength*(-1))
	dataobj.style.top="5px"
	setTimeout("scrollDiv()",40)
}
