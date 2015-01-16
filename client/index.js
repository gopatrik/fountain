// Session.setDefault("background", "78972B");
// Session.setDefault("position", {x:100, y:100});

Meteor.startup(function () {
	setBg(100, 100);
});

var windowHeight = function(){
	return $(document).height();
}

var inputHeight = function(){
	return $('.hex-input-container').height();
}

var navWidth = function () {
	return $('.side-nav').width()
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

    if(curY < windowHeight() - inputHeight()){

    	if(Session.get("showNav")){
    		if(curX < navWidth()){
				return true;
    		}else{
    			Session.set("showNav",false);
    		}
    	}
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

Session.setDefault("menuItems", {
	polygon:{checked:false, text:"Polygons", itemClass:"polygons-option"}
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

Template.menu.helpers({
	menuItems: function () {
		var menu = [];
		var m = Session.get("menuItems");
		// hash to array
		_.each(m, function (a,b) {
			menu.push(a);
		});
		console.log(menu)
		return menu;
	}
});

Template.menu.events({
	'click .polygons-option':function (e) {
		var m = Session.get("menuItems");

		m.polygon.checked = !m.polygon.checked;

		Session.set("menuItems", m);

	}
});






Template.menu.rendered = function () {
	this.firstNode.parentNode._uihooks = {
		removeElement: function(node) {
			console.log("remove", node);

			$(node).addClass('slide-out');

			setTimeout(function () {
		    	$(node).remove();
			},200);
		}
	};

};




Template.bg.events({
	'mousemove .background': function (e,t) {

		var x = e.offsetX;
		var y = e.offsetY;

		setBg(x, y);
	}
});