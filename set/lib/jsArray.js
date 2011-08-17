/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jsArray
 * @version   	>= 1.0
 *	
 * @name 		>= Array
 * @description >= Array extenstions for JavaScript
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 */

Array.prototype.put = function(item) {
    var index = this.getIndex(item);
    if (index == -1) {
        this.push(item);
    } else {
        this[index] = item;
    }
    return this.length;
};
Array.prototype.remove = function(item) {
    this.removeByIndex(this.getIndex(item));
};
Array.prototype.removeByIndex = function(index) {
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.containsKey = function(key) {
    var item = this[key];
    return item != undefined;
};
Array.prototype.contains = function(item) {
    var index = this.getIndex(item)
    return index > -1;
};
Array.prototype.getIndex = function(item) {
    var index = -1;
    for (var i=0; i<this.length; i++) {
        if (this[i] == item) {
            index = i;
        }
    }
    return index;
};
