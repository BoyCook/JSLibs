describe('Array', function(){
    var array;

    beforeEach(function(){
        array = new Array();
        array.push('Craig Cook');
        array.push('Tim Watson');
        array.push('Charles Care');
        array.push('Richard Sheath');
        array.push('Brian Francic');

        expect(array).toBeDefined();
        expect(array.length).toEqual(5);
    });

    it('should get index correctly', function(){
        expect(array.getIndex('Charles Care')).toEqual(2);
        expect(array.getIndex('Charles Doesnt Care')).toEqual(-1);
    });

    it('should know if key exists', function(){
        expect(array.containsKey(2)).toBeTruthy();
        expect(array.containsKey(13)).toBeFalsy();
    });

    it('should know if item exists', function(){
        expect(array.contains('Charles Care')).toBeTruthy();
        expect(array.contains('Charles doesnt Care')).toBeFalsy();
    });

    it('should be able to remove item', function(){
		array.remove('Charles Care');
		expect(array.length).toEqual(4);
		expect(array.contains('Charles Care')).toBeFalsy();
    });
});
