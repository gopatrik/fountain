// Session.setDefault("background", "78972B");
// Session.setDefault("position", {x:100, y:100});

Meteor.startup(function () {
	setBg(100, 100);
});

var windowHeight = function(){
	return $(document).height();
}

var setBg = function(x, y){
	Session.set("position", {x:x, y:y});

	x /=  $(document).width();
	y /= $(document).height();

	var rgb = [
		Math.round((1-x)*255).toString(16),
		Math.round(y*255).toString(16),
		Math.round(x*255).toString(16),
	];

	rgb = _.map(rgb, function (x) {
		return (x.length == 1) ? "0"+x : x;
	});

	rgb = rgb.join('');

	Session.set("background", rgb);
};

function touchMove(event) {
    event.preventDefault();
    var curX = event.targetTouches[0].pageX;
    var curY = event.targetTouches[0].pageY;

    var vh = windowHeight();

    if(curY < windowHeight() * 0.9){
    	setBg(curX, curY);
    }

};

Template.lupe.helpers({
	pos: function () {
		return Session.get("position");
	}
});

Template.bg.rendered = function () {
// 	$('.background').draggable();

	document.addEventListener("touchstart", touchMove, false);
	document.addEventListener("touchmove", touchMove, false);
	// document.addEventListener("touchend", touchEnd, false);
	// document.addEventListener("touchcancel", touchCancel, false);
};

var validHex = function (hex) {
	var i;
	var str = "\u6f22\u5b57"; // "\u6f22\u5b57" === "漢字"
	var result = "";
	for (i=0; i<str.length; i++) {
	  hex = str.charCodeAt(i).toString(16);
	  result += ("000"+hex).slice(-4);
	}
	console.log(result);
	return true;
}

Template.hexField.helpers({
	val: function () {
		return Session.get("background");
	}
});

Template.hexField.events({
	'keyup input[name=hex-field]': function (e,t) {
		var value = $(e.target).val();


		console.log(value.length);
		if(value.length != 6 && value.length != 3){
			return;
		}

		if(!validHex(value)){
			return;
		}

		Session.set("background", value);	
	}
});

Template.bg.helpers({
	hex: function () {
		return Session.get("background");
	}
});

Template.sideNav.events({
	'click .menu-toggle': function () {
		Session.set("showNav", !Session.get("showNav"));
	}
});

Template.sideNav.helpers({
	nav: function () {
		return Session.get("showNav");
	}
});

Template.bg.events({
	'mousemove .background': function (e,t) {

		var x = e.offsetX;
		var y = e.offsetY;

		setBg(x, y);
	}
});