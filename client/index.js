Session.setDefault("background", "78972B");

var setBg = function(x, y){
	x /=  $(document).width();
	y /= $(document).height();

	var rgb = [
		Math.round((1-x)*255).toString(16),
		Math.round(y*255).toString(16),
		Math.round(x*255).toString(16),
	].join('');

	Session.set("background", rgb);
};

function touchMove(event) {
    event.preventDefault();
    var curX = event.targetTouches[0].pageX;
    var curY = event.targetTouches[0].pageY;
    setBg(curX, curY);
};

Template.bg.rendered = function () {
// 	$('.background').draggable();

	// document.addEventListener("touchstart", touchStart, false);
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




Template.bg.events({
	'mousemove .background': function (e,t) {

		var x = e.offsetX;
		var y = e.offsetY;

		setBg(x, y);
	}
});