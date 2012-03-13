describe('Validator', function() {

    it('should validate required correctly', function() {
        checkValidation('some value', 'required', true);
        checkValidation('', 'required', false);
    });

    it('should validate name correctly', function() {
        checkValidation('SomeName', 'validate-name', true);
        checkValidation('somename', 'validate-name', true);
        checkValidation('some-name', 'validate-name', true);
        checkValidation('some&name', 'validate-name', false);
        checkValidation('some%name', 'validate-name', false);
        checkValidation('some*name', 'validate-name', false);
        checkValidation('some name', 'validate-name', false);
    });

    it('should validate display name correctly', function() {
        checkValidation('SomeName', 'validate-displayname', true);
        checkValidation('somename', 'validate-displayname', true);
        checkValidation('some-name', 'validate-displayname', true);
        checkValidation('some_name', 'validate-displayname', true);
        checkValidation('some~name', 'validate-displayname', true);
        checkValidation('some*name', 'validate-displayname', true);
        checkValidation('some name', 'validate-displayname', true);
        checkValidation('some(name)', 'validate-displayname', true);
        checkValidation('some,name', 'validate-displayname', true);
        checkValidation('some.name', 'validate-displayname', true);
        checkValidation('some+name', 'validate-displayname', true);
        checkValidation('some=name', 'validate-displayname', true);
        checkValidation('some@name', 'validate-displayname', true);
        checkValidation('some?name', 'validate-displayname', true);
        checkValidation('some#name', 'validate-displayname', true);
        checkValidation('some:name', 'validate-displayname', true);
        checkValidation('some;name', 'validate-displayname', true);
        checkValidation('some!name', 'validate-displayname', true);
        checkValidation('Some! name -_~*(),.+=@?#:;', 'validate-displayname', true);

        checkValidation('some{}name', 'validate-displayname', false);
        checkValidation('some|name', 'validate-displayname', false);
        checkValidation('some&name', 'validate-displayname', false);
        checkValidation('some%name', 'validate-displayname', false);
        checkValidation('some<>name', 'validate-displayname', false);
        checkValidation('some[]name', 'validate-displayname', false);
        checkValidation('some¬name', 'validate-displayname', false);
        checkValidation('some`name', 'validate-displayname', false);
        checkValidation('some/name', 'validate-displayname', false);
        checkValidation('some\\name', 'validate-displayname', false);
        checkValidation('some"name', 'validate-displayname', false);
        checkValidation('some£name', 'validate-displayname', false);
        checkValidation('some$name', 'validate-displayname', false);
        checkValidation('some^name', 'validate-displayname', false);
        checkValidation("Some{} name|&%¬`/\\\"£$^<>", 'validate-displayname', false);

    });

    it('should validate-dd correctly', function() {
        checkValidation('some value', 'validate-dd', true);
        checkValidation(undefined, 'validate-dd', false);
        checkValidation('', 'validate-dd', false);
        checkValidation('-1', 'validate-dd', false);
    });

    it('should validate-version correctly', function() {
        checkValidation('v1.0.0.0', 'validate-version', true);
        checkValidation('v12.10.11.09', 'validate-version', true);
        checkValidation('v1.0.0', 'validate-version', false);
    });

    it('should validate-ein correctly', function() {
        checkValidation('702242036', 'validate-ein', true);
        checkValidation('7022420366', 'validate-ein', false);
        checkValidation('70224203', 'validate-ein', false);
        checkValidation('', 'validate-ein', false);
    });

    it('should validate-email correctly', function() {
        checkValidation('craig.cook@cook.com', 'validate-email', true);
        checkValidation('craig@cook.com', 'validate-email', true);
        checkValidation('@cook.com', 'validate-email', false);
        checkValidation('craig@', 'validate-email', false);
        checkValidation('', 'validate-email', false);
    });

    it('should validate-url correctly', function() {
        checkValidation('http://www.craigcook.co.uk', 'validate-url', true);
        checkValidation('http://craigcook.co.uk', 'validate-url', true);
        checkValidation('www.craigcook.co.uk', 'validate-url', false);
        checkValidation('craigcook.co.uk', 'validate-url', false);
        checkValidation('', 'validate-url', false);
    });

    it('should get rule correctly', function() {
        var rule = $().validate('getRule', 'validate-dd');
        expect(rule).toBeDefined();
        expect(rule.errorMessage).toEqual('You must select a value');
    });

    it('should get all rules correctly', function() {
        var rules = $().validate('getRules');
        expect(rules).toBeDefined();
        expect(rules.length).toEqual(8);
    });

    it('should add rules correctly', function() {
        var originalRules = $().validate('getRules');
        expect(originalRules.length).toEqual(8);

        var newRules = [
            {
                checkClass: 'bob',
                errorClass: 'error',
                inputErrorClass: 'error',
                errorMessage: 'You must enter bob',
                pattern: '^bob$'
            },
            {
                checkClass: 'dave',
                errorClass: 'error',
                inputErrorClass: 'error',
                errorMessage: 'You must enter dave',
                pattern: '^dave$'
            }
        ];

        var addedRules = $().validate('addRules', newRules);
        var rules = $().validate('getRules');
        expect(addedRules.length).toEqual(10);
        expect(rules.length).toEqual(10);

        checkValidation('craigcook.co.uk', 'bob', false);
        checkValidation('bob', 'bob', true);

        checkValidation('craigcook.co.uk', 'dave', false);
        checkValidation('dave', 'dave', true);
    });

    it('should validate via functions correctly', function() {
        var newRules = [
            {
                checkClass: 'foobar',
                errorClass: 'error',
                inputErrorClass: 'error',
                errorMessage: 'You must enter foobar',
                func: function(val) {
                    return val == 'foobar';
                }
            }
        ];
        var addedRules = $().validate('addRules', newRules);
        var rules = $().validate('getRules');
        expect(addedRules.length).toEqual(11);
        expect(rules.length).toEqual(11);

        checkValidation('craigcook.co.uk', 'foobar', false);
        checkValidation('foobar', 'foobar', true);
    });

    function checkValidation(value, ruleName, expected) {
        var rule = $().validate('getRule', ruleName);
        if (expected) {
            expect($().validate('check', value, rule)).toBeTruthy();
        } else {
            expect($().validate('check', value, rule)).toBeFalsy();
        }
    }
});