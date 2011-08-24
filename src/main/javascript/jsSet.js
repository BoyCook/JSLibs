/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jsSet
 * @version   	>= 1.0
 *	
 * @name 		>= Set
 * @description >= Set extenstions for JavaScript
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 */

function Set() {}

Set.prototype = new Array();
Set.prototype.constructor = Set;
Set.prototype.put = function(item) {
    var index = this.getIndex(item);
    if (index == -1) {
        this.push(item);
    } else {
        this[index] = item;
    }
    return this.length;
};
Set.prototype.remove = function(item) {
    this.removeByIndex(this.getIndex(item));
};
Set.prototype.clear = function() {
    this.length = 0;
};
Set.prototype.size = function() {
    return this.length;
};
Set.prototype.removeByIndex = function(index) {
    if (index > -1) {
        this.splice(index, 1);
    }
};
Set.prototype.containsKey = function(key) {
    var item = this[key];
    return item != undefined;
};
Set.prototype.contains = function(item) {
    var index = this.getIndex(item)
    return index > -1;
};
Set.prototype.getIndex = function(item) {
    var index = -1;
    for (var i=0; i<this.length; i++) {
        if (this[i] == item) {
            index = i;
        }
    }
    return index;
};
