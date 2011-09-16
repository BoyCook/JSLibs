describe('String', function() {
    var string;

    beforeEach(function() {
        string = 'Ben Paddock';
    });

    it('should return true when the string starts with the given substring', function() {
        expect(string.startsWith('Ben')).toEqual(true);
    });

	it('should return false when the string does not start with the given substring', function() {
        expect(string.startsWith('Craig')).toEqual(false);
    });

	it('should return false when the substring is contained within the string but not at the start', function() {
        expect(string.startsWith('Paddock')).toEqual(false);
    });

});
