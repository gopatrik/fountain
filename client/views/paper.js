Meteor.Paper = {};

Meteor.startup(function () {
	Meteor.Paper.paper = Snap('.paper');
	Meteor.ToolBox = {
		currentTool: undefined,
		setTool: function  (tool) {
			if(Meteor.ToolBox.currentTool){
				Meteor.ToolBox.currentTool.deactivate();
			};

			Meteor.ToolBox.currentTool = tool;
			tool.activate();
		},
		unsetTool: function () {
			if(Meteor.ToolBox.currentTool){
				Meteor.ToolBox.currentTool.deactivate();
				Meteor.ToolBox.currentTool = undefined;
			};
		},
		tools: {
			pentool: Meteor.Tool.PenTool(Meteor.Paper.paper),
			colorSelector: Meteor.Tool.ColorSelect(Meteor.Paper.paper)
		}
	}
});

Meteor.Paper.setBg = function(x, y){
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

Template.paper.helpers({
	hex: function () {
		return Session.get("background");
	}
});

Template.paper.rendered = function () {
	Meteor.ToolBox.setTool(Meteor.ToolBox.tools.pentool);
};



Meteor.startup(function () {
	Meteor.Paper.setBg(400, 400);
});

var polygon = function (paper){

	var nodes = [];
	var lines = [];
	var lastNode;
	var draggingLine;
	var draggingNode;
	var lineStyle = {
		stroke: 'white',
		strokeWidth: 4
	};

	var nodeStyle = {
		fill: 'white',
		r: 14
	};

	// private
	var windowHeight = function(){
		return $(document).height();
	};

	var inputHeight = function(){
		return $('.hex-input-container').height();
	};

	var navWidth = function () {
		return $('.side-nav').width();
	};
	var pushNode = function (node) {
		if(lastNode){
			lastNode.attr('stroke','none');
		}
		lastNode = node;
		nodes.push(node);
		lastNode.attr('stroke','red');
		lastNode.attr('stroke-width','4');
	};

	var drawLine = function (x1,y1,x2,y2) {
		var l = paper.line(x1,y1,x2,y2);
		l.attr(lineStyle);

		return l;
	};

	// public
	var addNode = function(x,y){
		if(lastNode){
			var l = drawLine(lastNode.attr('cx'), lastNode.attr('cy'), x, y);
		}
		var newNode = paper.circle(x,y,5);
		newNode.attr(nodeStyle);
		pushNode(newNode);
	};

	var dragLine = function (x,y) {
		if(!lastNode){
			return;
		};

		if(!draggingLine){
			draggingLine = paper.line(
				lastNode.attr('cx'), lastNode.attr('cy'),
				x, y
			);
			draggingLine.attr(lineStyle);

			draggingNode = paper.circle(x,y,5);
			draggingNode.attr(nodeStyle);

		}else{
			draggingLine.attr('x2',x);
			draggingLine.attr('y2',y);

			draggingNode.attr('cx',x);
			draggingNode.attr('cy',y);
		};
	};

	var releaseDrag = function (x,y) {
		if(!draggingLine && !draggingNode){
			addNode(x, y);
			return;
		};

		lines.push(draggingLine);

		pushNode(draggingNode);

		draggingLine = undefined;
		draggingNode = undefined;
	};

	var clear = function () {
		paper.clear();
		nodes = [];
		lines = [];
		draggingLine = undefined;
		draggingNode = undefined;
		lastNode = undefined;
	};

	Meteor.figure;
	var lastDraggedPosition;
	function polygonDragTouchHandler(event) {
	    event.preventDefault();
	    var curX = event.targetTouches[0].pageX;
	    var curY = event.targetTouches[0].pageY;

	    var vh = windowHeight();

	    if(curY < windowHeight() - inputHeight()){

	    	if(Session.get("showNav")){
	    		if(curX < navWidth()){
					return true; // regular click when in nav
	    		}else{
	    			Session.set("showNav",false);
	    		}
	    	};

	    	lastDraggedPosition = {x:curX, y:curY};

	    	if(!Meteor.figure){
	    		Meteor.figure = polygon(Snap('.background'));
	    	};

	    	Meteor.figure.dragLine(curX, curY);
	    };
	};

	function polygonReleaseDragHandler(event) {
		if(lastDraggedPosition){
			Meteor.figure.releaseDrag(lastDraggedPosition.x, lastDraggedPosition.y);
		}
	};

	var activate = function () {
		document.addEventListener("touchstart", polygonDragTouchHandler, false);
		document.addEventListener("touchmove", polygonDragTouchHandler, false);
		document.addEventListener("touchend", polygonReleaseDragHandler, false);
		document.addEventListener("touchcancel", undefined, false);	
	};

	return Object.freeze({
		activate:activate,
		addNode:addNode,
		dragLine:dragLine,
		releaseDrag:releaseDrag,
		clear:clear
	});
};