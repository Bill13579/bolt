var root_dir = data.plugin_root;
var context_menu = document.getElementById("bolt-context-menu");

function fireEventOnElement(event_name, element) {
	if (document.createEvent) {
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent(event_name, false, true);
		element.dispatchEvent(evt);
	} else {
		element.fireEvent("on" + event_name);
	}
}

function isTouch(event) {
	if (event.type == "click") {
		return false;
	} else if (event.type == "touchend") {
		event.preventDefault();
		event.stopPropagation();
		return true;
	}
}

function addEventListeners(element, event, listener) {
	events = event.split(" ");
	for (var i = 0; i < events.length; i++) {
		element.addEventListener(events[i], listener);
	}
}

var divideWithRemainders = function (x, y){
	var result = { quotient:Math.floor(x/y), remainder:x%y };
	return result;
};
var sToHms = function (sec){
	var tmp = divideWithRemainders(sec, 3600);
	var hours = tmp.quotient;
	var tmp = divideWithRemainders(tmp.remainder, 60);
	var minutes = tmp.quotient;
	var seconds = tmp.remainder;
	return { h:hours, m:minutes, s:seconds };
};
var make2Digits = function (num){
	str = num.toString();
	if (str.length <= 1) {
		var digits_to_add = 2 - str.length;
		var to_add = "";
		for (var i = 0; i < digits_to_add; i++) {
			to_add += "0";
		}
		return (to_add + str);
	}
	return str;
};

var vc_container = document.getElementById("bolt-video-container");
var video = document.getElementById("bolt-video");
video.controls = false;
var controls = document.getElementById("bolt-player-controls-container");
var playBtn = document.getElementById("bolt-player-controls-playpause");
var muteBtn = document.getElementById("bolt-player-controls-mute");
var fullscreenBtn = document.getElementById("bolt-player-controls-fullscreen");
var progressBar = document.getElementById("bolt-player-controls-progress");
var volumeBar = document.getElementById("bolt-player-controls-volume");
var currentTimeTxt = document.getElementById("bolt-player-controls-current-time");
var videoLoader = document.getElementById("bolt-video-loader");

vc_container.addEventListener('contextmenu', function(e){
	e = e || window.event;
	e.preventDefault();
	var e_posx = 0, e_posy = 0, obj = this;
	if (obj.offsetParent) {
		do {
			e_posx += obj.offsetLeft;
			e_posy += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	context_menu_top = e.pageY - e_posy;
	context_menu_left = e.pageX - e_posx;
	context_menu.style.display = "inline";
	context_menu.style.top = context_menu_top + "px";
	context_menu.style.left = context_menu_left + "px";
});

vc_container.addEventListener('mousedown', function(e){
	e = e || window.event;
	if (e.target.parentNode != context_menu) {
		context_menu.style.display = "none";
	}
});

function toggleMute() {
	if (video.muted == true) {
		video.muted = false;
		muteBtn.style.backgroundImage = "url(\"" + root_dir + "res/volume-white.png\")";
		document.getElementById("bolt-context-menu-item-mute-check").getElementsByTagName("img")[0].setAttribute("src", "");
	} else {
		video.muted = true;
		muteBtn.style.backgroundImage = "url(\"" + root_dir + "res/mute-white.png\")";
		document.getElementById("bolt-context-menu-item-mute-check").getElementsByTagName("img")[0].setAttribute("src", root_dir + "res/check-mark-white.png");
	}
}

function toggleLoop() {
	if (video.hasAttribute("loop")) {
		video.removeAttribute("loop");
		document.getElementById("bolt-context-menu-item-loop-check").getElementsByTagName("img")[0].setAttribute("src", "");
	} else {
		video.setAttribute("loop", "");
		document.getElementById("bolt-context-menu-item-loop-check").getElementsByTagName("img")[0].setAttribute("src", root_dir + "res/check-mark-white.png");
	}
}

var contextMenuItemClicked = function (e){
	e = e || window.event;
	switch (e.target.getAttribute("data-action")) {
		case "loop":
			toggleLoop();
			break;
		case "mute":
			toggleMute();
			break;
	}
	context_menu.style.display = "none";
};

var toggleFullscreen = function (e){
	e = e || window.event;
	var inFullScreen = (document.fullscreenElement && document.fullscreenElement != null) ||
    (document.webkitFullscreenElement && document.webkitFullscreenElement != null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement != null) ||
    (document.msFullscreenElement && document.msFullscreenElement != null);
    var doc = document.documentElement;
    if (!inFullScreen) {
    	var requestMethod = vc_container.requestFullScreen || vc_container.webkitRequestFullScreen || vc_container.mozRequestFullScreen || vc_container.msRequestFullScreen;
		if (requestMethod) {
			requestMethod.call(vc_container);
			origWidth = vc_container.style.width;
			origHeight = vc_container.style.height;
			vc_container.style.width = "100%";
			vc_container.style.height = "100%";
			fullscreenBtn.style.backgroundImage = "url(\"" + root_dir + "res/fullscreen-exit-white.png\")";
		}
    } else {
    	success = function (){
    		vc_container.style.width = origWidth;
        	vc_container.style.height = origHeight;
        	origWidth = 0;
        	origHeight = 0;
        	fullscreenBtn.style.backgroundImage = "url(\"" + root_dir + "res/fullscreen-white.png\")";
    	};
    	if (document.exitFullscreen) {
    		document.exitFullscreen();
    		success();
    	} else if (document.webkitExitFullscreen) {
    		document.webkitExitFullscreen();
    		success();
    	} else if (document.mozCancelFullScreen) {
    		document.mozCancelFullScreen();
    		success();
    	} else if (document.msExitFullscreen) {
    		document.msExitFullscreen();
    		success();
    	}
    }
}

var context_menu_items = document.getElementsByClassName("bolt-context-menu-item");
for (var i = 0; i < context_menu_items.length; i++) {
	context_menu_items[i].addEventListener('click', contextMenuItemClicked);
}

function togglePlay() {
	if (video.paused == true) {
		video.play();
		playBtn.style.backgroundImage = "url(\"" + root_dir + "res/pause-white.png\")";
	} else {
		video.pause();
		playBtn.style.backgroundImage = "url(\"" + root_dir + "res/play-white.png\")";
	}
}

function showControls() {
	controls.style.opacity = "1";
}

function hideControls() {
	controls.style.opacity = "0";
}

var total_hms_str = "Loading...";
function loadDuration() {
	var total_seconds = video.duration;
	var total_hms = sToHms(Math.round(total_seconds));
	total_hms_str = make2Digits(total_hms.h) + ":" + make2Digits(total_hms.m) + ":" + make2Digits(total_hms.s);
}
video.addEventListener("loadedmetadata", loadDuration);
if (video.readyState >= 2) {
	loadDuration();
}

playBtn.addEventListener("click", function(){ togglePlay(); });
var videoClicked = function(e){
	e = e || window.event;
	if (isTouch(e)) {
		if (controls.style.opacity == "1") {
			hideControls();
		} else {
			showControls();
		}
	} else {
		togglePlay();
	}
};
addEventListeners(video, "click touchend", videoClicked);
controls.addEventListener("mouseover", function(){ showControls(); });
controls.addEventListener("mouseout", function(){ hideControls(); });
muteBtn.addEventListener("click", function(){
	toggleMute();
});
origWidth = "";
origHeight = "";
fullscreenBtn.addEventListener("click", function(){
	toggleFullscreen();
});
var progressBarChanged = function (){
	var time = video.duration * (progressBar.value / 100);
	video.currentTime = time;
};
progressBar.addEventListener("change", function(){ progressBarChanged(); });
progressBar.addEventListener("input", function(){ progressBarChanged(); });
var lastPaused = true;
progressBar.addEventListener("mousedown", function(){
	lastPaused = video.paused;
	video.pause();
});
progressBar.addEventListener("mouseup", function(){
	if (lastPaused == false) {
		video.play();
	}
});
video.addEventListener("timeupdate", function(){
	var value = (video.currentTime / video.duration) * 100;
	progressBar.value = value;
	var seconds = video.currentTime;
	var current_hms = sToHms(Math.round(seconds));
	currentTimeTxt.setAttribute("data-text", make2Digits(current_hms.h) + ":" + make2Digits(current_hms.m) + ":" + make2Digits(current_hms.s) + "/" + total_hms_str);
});
video.addEventListener("canplay", function(){
	videoLoader.style.display = "none";
});
addEventListeners(video, "loadstart waiting", function(){
	videoLoader.style.display = "block";
});

var volumeBarChanged = function (){
	video.volume = volumeBar.value;
};
volumeBarChanged();
volumeBar.addEventListener("change", function(){ volumeBarChanged(); });
volumeBar.addEventListener("input", function(){ volumeBarChanged(); });
