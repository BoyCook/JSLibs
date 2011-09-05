describe('Validator', function() {

    it('should validate required correctly', function() {
        checkValidation('some value', 'required', true);
        checkValidation('', 'required', false);
    });

    it('should validate-dd correctly', function() {
        checkValidation('some value', 'validate-dd', true);
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
        expect(rules.length).toEqual(6);
    });

    it('should add rules correctly', function() {
        var originalRules = $().validate('getRules');
        expect(originalRules.length).toEqual(6);

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
        expect(addedRules.length).toEqual(8);
        expect(rules.length).toEqual(8);
    });

    function checkValidation(value, ruleName, expected) {
        var rule = $().validate('getRule', ruleName);
        if (expected) {
            expect($().validate('checkValue', value, rule.pattern)).toBeTruthy();
        } else {
            expect($().validate('checkValue', value, rule.pattern)).toBeFalsy();
        }
    }
});