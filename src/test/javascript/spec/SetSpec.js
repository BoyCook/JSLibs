describe('Set', function(){
    var set;

    beforeEach(function(){
        set = new Set();
        set.add('Craig Cook');
        set.add('Tim Watson');
        set.add('Charles Care');
        set.add('Richard Sheath');
        set.add('Brian Francic');

        expect(set).toBeDefined();
        expect(set.size()).toEqual(5);
    });

    it('should give the correct length', function(){
		expect(set.size()).toEqual(5);
    });

    it('should get index correctly', function(){
        expect(set.getIndex('Charles Care')).toEqual(2);
        expect(set.getIndex('Charles Doesnt Care')).toEqual(-1);
    });

    it('should know if key exists', function(){
        expect(set.containsKey(2)).toBeTruthy();
        expect(set.containsKey(13)).toBeFalsy();
    });

    it('should know if item exists', function(){
        expect(set.contains('Charles Care')).toBeTruthy();
        expect(set.contains('Charles doesnt Care')).toBeFalsy();
    });

    it('should be able to remove item', function(){
		set.remove('Charles Care');
		expect(set.size()).toEqual(4);
		expect(set.contains('Charles Care')).toBeFalsy();
    });

    it('should not add item twice', function(){
		set.add('Charles Care');
		expect(set.size()).toEqual(5);
		expect(set.contains('Charles Care')).toBeTruthy();
    });

    it('should add all correctly', function(){
		set.addAll(['Foo bar', 'John Smith', 'Davy Jones']);
		expect(set.size()).toEqual(8);
		expect(set.contains('Foo bar')).toBeTruthy();
        expect(set.contains('John Smith')).toBeTruthy();
        expect(set.contains('Davy Jones')).toBeTruthy();
    });

    it('should clear properly', function(){
		set.clear();
		expect(set.size()).toEqual(0);
    });
});
