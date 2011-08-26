/**
 * @groupId     >= org.cccs.jsLibs
 * @artefactId  >= jsSet
 * @version     >= 1.0
 *
 * @name        >= Set
 * @description >= Set extenstions for JavaScript
 * @vcs         >= git
 * @website     >= https://github.com/BoyCook/JSLibs
 * @since       >= 2010-07-01
 * @copyright   >= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author      >= Craig Cook
 */

function Set() {
    this.data = [];
}

Set.prototype.add = function(item) {
    var index = this.getIndex(item);
    if (index == -1) {
        this.data.push(item);
    } else {
        this.data[index] = item;
    }
    return this.length;
};
Set.prototype.addAll = function(items) {
    for (var i=0; i<items.length; i++) {
        this.add(items[i]);
    }
};
Set.prototype.remove = function(item) {
    this.removeByIndex(this.getIndex(item));
};
Set.prototype.removeAll = function(items) {
    //TODO: implement
};
Set.prototype.contains = function(item) {
    var index = this.getIndex(item);
    return index > -1;
};
Set.prototype.clear = function() {
    this.data.length = 0;
};
Set.prototype.size = function() {
    return this.data.length;
};
Set.prototype.toArray = function() {
    return this.data;
};

//Private
Set.prototype.removeByIndex = function(index) {
    if (index > -1) {
        this.data.splice(index, 1);
    }
};
Set.prototype.containsKey = function(key) {
    var item = this.data[key];
    return item != undefined;
};
Set.prototype.getIndex = function(item) {
    var index = -1;
    for (var i = 0; i < this.size(); i++) {
        if (this.data[i] == item) {
            index = i;
        }
    }
    return index;
};
