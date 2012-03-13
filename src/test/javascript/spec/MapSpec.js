describe('Map', function(){
    var map;

    beforeEach(function(){
        map = new Map();
        map.put('Craig', 'Craig Cook');
        map.put('Tim', 'Tim Watson');
        map.put('Charles', 'Charles Care');
        map.put('Richard', 'Richard Sheath');
        map.put('Brian', 'Brian Francic');

        expect(map).toBeDefined();
        expect(map.array).toBeDefined();
        expect(map.size()).toEqual(5);
    });

    it('should know what size it is', function(){
        expect(map.size()).toEqual(5);
        expect(map.array.length).toEqual(map.size());
    });

    it('should construct correctly', function(){
        var newMap = new Map();
        expect(newMap).toBeDefined();
        expect(newMap.array).toBeDefined();
        expect(newMap.size()).toEqual(0);
    });

    it('should update item correctly', function(){
        map.put('Craig', 'Craig Stephen Cook');
        expect(map.size()).toEqual(5);
        var person = map.get('Craig');
        expect(person).toEqual('Craig Stephen Cook');
    });

    it('should add items correctly', function(){
        map.put('Santosh', 'Santosh Hegde');
        expect(map.size()).toEqual(6);
    });

    it('should get item by key correctly', function(){
        var person = map.get('Tim');
        expect(person).toEqual('Tim Watson');
    });

    it('should get item by index correctly', function(){
        var person = map.getAtIndex(0);
        expect(person).toEqual('Craig Cook');
    });

    it('should clear correctly', function(){
        map.clear();
        expect(map.size()).toEqual(0);
    });

    it('should remove item by index correctly', function(){
        map.removeByIndex(2);
        var person = map.get('Charles');
        expect(person).toBeUndefined();
        expect(map.size()).toEqual(4);
    });

    it('should not remove any item by index when it does not exist', function(){
        map.removeByIndex(99);
        var person = map.get('Charles');
        expect(person).not.toBeUndefined();
        expect(map.size()).toEqual(5);
    });

    it('should remove item by key correctly', function(){
        map.removeByKey('Charles');
        var person = map.get('Charles');
        expect(person).toBeUndefined();
        expect(map.size()).toEqual(4);
    });

    it('should not remove any item by key when key does not exist', function(){
        map.removeByKey('Ben');
        var person = map.get('Ben');
        expect(person).toBeUndefined();
        expect(map.size()).toEqual(5);
    });

    it('should remove item correctly', function(){
        map.remove('Charles Care');
        var person = map.get('Charles');
        expect(person).toBeUndefined();
        expect(map.size()).toEqual(4);
    });

    it('should not remove any item when item does not exist', function(){
        map.remove('Ben');
        var person = map.get('Ben');
        expect(person).toBeUndefined();
        expect(map.size()).toEqual(5);
    });

    it('should return all correctly', function(){
        var myMap = map.all();
        expect(myMap.length).toEqual(5);
    });

    it('should get index correctly', function(){
        var index = map.getIndex('Charles');
        expect(index).toEqual(2);
    });

    it('should give -1 for incorrect key', function(){
        var index = map.getIndex('This is made up');
        expect(index).toEqual(-1);
    });

    it('should get index of value correctly', function(){
        var index = map.getIndexOfValue('Charles Care');
        expect(index).toEqual(2);
    });

    it('should know what it contains', function(){
        expect(map.contains('Charles Care')).toBeTruthy();
        expect(map.contains('Charles Doesnt Care')).toBeFalsy();
    });

    it('should know what it contains by key', function(){
        expect(map.containsKey('Charles')).toBeTruthy();
        expect(map.containsKey('Charles Doesnt Care')).toBeFalsy();
    });

    it('should get key by value', function(){
        var key = map.getKeyOfValue('Charles Care');
        expect(key).toEqual('Charles');
    });

    it('should return undefined for unknown key', function(){
        var key = map.getKeyOfValue('This is made up');
        expect(key).toBeUndefined();
    });

    it('should get all values', function(){
        var values = map.getAllValues();
        expect(values).toEqual(['Craig Cook', 'Tim Watson', 'Charles Care', 'Richard Sheath', 'Brian Francic']);
    });
});
