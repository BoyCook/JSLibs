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

    function checkValidation(value, ruleName, expected) {
        var rule = $.validator.rules[ruleName];
        if (expected) {
            expect($.validator.checkValue(value, rule.pattern)).toBeTruthy();
        } else {
            expect($.validator.checkValue(value, rule.pattern)).toBeFalsy();
        }
    }
});