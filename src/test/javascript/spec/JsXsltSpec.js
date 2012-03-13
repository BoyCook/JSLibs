describe('XSLT Engine', function() {

    var engine;
    var testUrl = 'http://localhost:8080/xml';
    var testXml = $('<xml><test>dummy</test></xml>');

    beforeEach(function() {
        engine = new XSLT();
    });

    it('should add XML to the cache correctly', function() {
        engine.addXml(testUrl, testXml);
        expect(engine.xmls.size()).toEqual(1);
    });

    it('should not add the same XML to the cache more than once', function() {
        engine.addXml(testUrl, testXml);
        expect(engine.xmls.size()).toEqual(1);
        engine.addXml(testUrl, testXml);
        expect(engine.xmls.size()).toEqual(1);
    });

    it('should remove XML from the cache correctly', function() {
        engine.addXml(testUrl, testXml);
        expect(engine.xmls.size()).toEqual(1);
        engine.removeXml(testUrl);
        expect(engine.xmls.size()).toEqual(0);
    });

    it('should remove not remove any XML from the cache when the URL is incorrect', function() {
        engine.addXml(testUrl, testXml);
        expect(engine.xmls.size()).toEqual(1);
        engine.removeXml('http://localhost:8080/invalid');
        expect(engine.xmls.size()).toEqual(1);
    });

});
