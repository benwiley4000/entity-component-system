"use strict";

var present = require("present");

function EntityComponentSystem() {
	this.systems = [];
}
EntityComponentSystem.prototype.add = function(code) {
	this.systems.push(code);
};
EntityComponentSystem.prototype.addEach = function(code, requirements) {
	this.systems.push(function(entities) {
		var args = arguments;
		var keys = Object.keys(entities);
		for (var i = 0; i < keys.length; i++) {
			var entity = entities[keys[i]];
			if (requirements && !entityHasComponents(requirements, entity)) {
				continue;
			}
			args[0] = entity;
			code.apply(undefined, args);
		}
	});
};
EntityComponentSystem.prototype.run = function() {
	var args = arguments;
	var times = [];
	for (var i = 0; i < this.systems.length; i++) {
		var start = present();
		this.systems[i].apply(undefined, args);
		times.push(present() - start);
	}
	return times;
};

function entityHasComponents(components, entity) {
	for (var i = 0; i < components.length; i++) {
		if (!entity.hasOwnProperty(components[i])) {
			return false;
		}
	}
	return true;
}

module.exports = EntityComponentSystem;
