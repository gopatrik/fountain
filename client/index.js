Template.lupe.helpers({
	pos: function () {
		return Session.get("position");
	}
});

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


Session.setDefault("menuItems", {
	polygon:{checked:false, text:"Polygons", itemClass:"polygons-option"},
	clear:{checked:false, text:"Clear", itemClass:"clear-option"}
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

	},
	'click .clear-option':function (e) {
		var m = Session.get("menuItems");

		m.clear.checked = !m.clear.checked;

		Meteor.figure.clear();

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

Template.svgTest.events({
	'click button': function (e,t) {
		var svg = t.find('svg');
		var img = t.find('#fromcanvas');

		svg.toDataURL("image/png", {
			callback: function(data) {
				img.setAttribute("src", data)
				// var a = document.querySelector("#data")
				// a.href = data
				// a.style.display = "inline"
			}
		})
	}
});


