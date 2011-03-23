/**
 * jsMap
 * Map implementation for JavaScript
 *
 * @version   1.0
 * @since     2010-07-01
 * @copyright Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    Craig Cook
 */

function Map() {
    this.map = [];
}
Map.prototype.put = function(key, value) {
    var index = this.getIndex(value.key);
    if (index > 0) {
        this.map[index] = {key: key, value: value};
    } else {
        this.map.push({key: key, value: value});        
    }
};
Map.prototype.get = function(key) {
    var index = this.getIndex(key);
    if (index > 0) {
        return this.map[index].value;
    } else {
        return undefined;
    }
};
Map.prototype.remove = function(value) {
    //TODO: check this is right
    var index = this.getIndex(value.key);
    var removed = [];
    removed.push(this.map.slice(0, index -1));
    removed.push(this.map.slice(index + 1));
    this.map = removed;
};
Map.prototype.clear = function() {
    //TODO: check this is right
    this.map = new Array(0);
};
Map.prototype.getIndex = function(key) {
    var index = -1;
    for (var i=0; i<this.map.length; i++) {
        var item = this.map[i];
        if (item.key == key) index = i;        
    }
    return index;
};
