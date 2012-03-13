/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jsMap
 * @version   	>= 1.0
 *	
 * @name 		>= Map
 * @description >= Map implementation for JavaScript
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 */

function Map() {
    this.array = [];
}
Map.prototype.put = function(key, value) {
    var index = this.getIndex(key);
    if (index > -1) {
        this.array[index] = {key: key, value: value};
    } else {
        this.array.push({key: key, value: value});
    }
};
Map.prototype.get = function(key) {
    var index = this.getIndex(key);
    if (index > -1) {
        return this.array[index].value;
    } else {
        return undefined;
    }
};
Map.prototype.getAtIndex = function(index) {
    return this.array[index].value;
};
Map.prototype.remove = function(value) {
    var index = this.getIndexOfValue(value);
    this.removeByIndex(index);
};
Map.prototype.removeByKey = function(key) {
    var index = this.getIndex(key);
    this.removeByIndex(index);
};
Map.prototype.removeByIndex = function(index) {
    if(index != -1) {
        this.array.splice(index, 1);
    }
};
Map.prototype.clear = function() {
    this.array = new Array(0);
};
Map.prototype.all = function() {
    return this.array;
};
Map.prototype.getAllValues = function() {
	var valuesArray = [];
	for (var i=0; i<this.array.length; i++) {
        valuesArray.push(this.array[i].value);
	}
	return valuesArray;
};
Map.prototype.getIndex = function(key) {
    var index = -1;
    for (var i=0; i<this.array.length; i++) {
        var item = this.array[i];
        if (item.key == key) index = i;
    }
    return index;
};
Map.prototype.getIndexOfValue = function(value) {
    var index = -1;
    for (var i=0; i<this.array.length; i++) {
        var item = this.array[i];
        if (item.value == value) index = i;
    }
    return index;
};
Map.prototype.getKeyOfValue = function(value) {
    var key = undefined;
    for (var i=0; i<this.array.length; i++) {
        var item = this.array[i];
        if (item.value == value) key = item.key;
    }
    return key;
};
Map.prototype.contains = function(value) {
    var index = this.getIndexOfValue(value);
    return index > -1;
};
Map.prototype.containsKey = function(key) {
    var index = this.getIndex(key);
    return index > -1;
};
Map.prototype.size = function() {
    return this.array.length;
};
