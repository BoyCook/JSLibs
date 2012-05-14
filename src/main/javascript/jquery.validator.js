/**
 * @name            >= jquery.validator
 * @description     >= An HTML input validator
 * @vcs             >= git
 * @website         >= https://github.com/BoyCook/JSLibs
 * @since           >= 2010-07-01
 * @copyright       >= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author          >= Craig Cook
 * @requires        >= jQuery 1.4.2           http://jquery.com
 */

(function($) {
    var methods = {
        validateAsync: function(elements, validCallBack) {
            $(elements).each(function() {
                methods.clearValidation('#' + this.id);

                var cnt = 0;
                var toValidate = $('#' + this.id + ' .required, #' + this.id + ' [class*=validate]');
                var validateEach = function(isValid, index) {
                    var element = toValidate[index];
                    methods.checkElementAsync(isValid, element, function(isValid, elemValid, element) {
                        if (!elemValid) {
                            var rule = methods.getRuleForElement(element);
                            methods.invalidate(element, rule);
                        }

                        //Do next
                        if (cnt < (toValidate.length - 1)) {
                            cnt++;
                            validateEach(isValid, cnt);
                        } else {
                            //At the end do the passed in callback
                            if (isValid && validCallBack) {
                                validCallBack();
                            }
                        }
                    });
                };
                validateEach(true, 0);
            });
        },
        checkElementAsync: function(isValid, element, callBack) {
            var rule = methods.getRuleForElement(element);
            //If there's no value and it's not required then there's no need to check
            if ($(element).hasClass('required') || (element.value != undefined && element.value.length > 0)) {
                methods.checkAsync(isValid, element, rule, callBack);
            } else {
                callBack(isValid, true, element);
            }
        },
        checkAsync: function(isValid, element, rule, callBack) {
            if (rule.pattern) {
                var elementValid = methods.checkValue(element.value, rule.pattern);
                if (!elementValid) {
                    isValid = false;
                }
                if (callBack) {
                    callBack(isValid, elementValid, element);
                }
            } else if (rule.func) {
                //Function must call callBack(isValid, elementValid, element);
                rule.func(isValid, element, callBack);
            }
        },
        validate: function(elements) {
            var isValid = true;
            elements.each(function() {
                methods.clearValidation('#' + this.id);
                $('#' + this.id + ' .required, #' + this.id + ' [class*=validate]').each(function() {
                    if (!methods.checkElement(this)) { //One false is invalid
                        isValid = false;
                    }
                });
            });
            return isValid;
        },
        checkElement: function(element) {
            var rule = methods.getRuleForElement(element);
            var isValid = true;
            //If there's no value and it's not required then there's no need to check
            if ($(element).hasClass('required') || (element.value != undefined && element.value.length > 0)) {
                if (!methods.check(element.value, rule)) {
                    isValid = false;
                    methods.invalidate(element, rule);
                }
            }
            return isValid;
        },
        check: function(value, rule) {
            if (rule.pattern) {
                return methods.checkValue(value, rule.pattern);
            } else if (rule.func) {
                return rule.func(value);
            } else {
                return true;
            }
        },
        checkValue: function(value, pattern) {
            //Will fail on no match || no value
            return !(value == undefined || value.length == 0 || value.match(pattern) == undefined);
        },
        getRule: function(name) {
            var rule = undefined;
            $(rules).each(function() {
                if (this.checkClass == name) {
                    rule = this;
                }
            });
            return rule;
        },
        getRules: function() {
            return rules;
        },
        getRuleForElement: function(elem) {
            var cssClass = 'required';
            var classes = [];
            var splitNewLine = elem.className.split('\n');

            $(splitNewLine).each(function() {
                var line = this.split(' ');
                $(line).each(function() {
                    if (this.trim() != '') {
                        classes.push(this);
                    }
                });
            });

            for (var i = 0; i < classes.length; i++) {
                if (classes[i].indexOf('validate-') > -1) {
                    cssClass = classes[i];
                }
            }

            return methods.getRule(cssClass);
        },
        invalidate: function(element, rule) {
            var label = $("<label for=\"" + element.id + "\" generated=\"true\" class=\"" + rule.errorClass + "\">" + rule.errorMessage + "</label>");
            $(element).addClass(rule.inputErrorClass);
            var divParents = $(element).parents('div');
            if (divParents.length > 0) {
                var tabId = $(element).parents('div')[0].id;
                $(divParents[1]).find('a[href="#' + tabId + '"] span').addClass('error');
            }
            label.insertAfter(element);
        },
        clearValidation: function(id) {
            $(id + ' label.error').remove();
            $(id + ' span.error').removeClass('error');
            $(id + ' input.error').removeClass('error');
            $(id + ' textarea.error').removeClass('error');
        },
        addRules: function(optional) {
            rules = Array.prototype.concat.call(rules, optional);
            return rules;
        }
    };
    var rules = [
        {
            checkClass: 'required',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: 'This field is required',
            pattern: '.'
        },
        {
            checkClass: 'validate-name',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: 'Name must contain letter, numbers, and hyphens only. Leading/trailing spaces and non-displayable characters not allowed.',
            pattern: "^[a-zA-Z0-9äöüÄÖÜ\-]*$"
        },
        {
            checkClass: 'validate-displayname',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: "Display name must not contain special characters",
            pattern: "^[\\d\\w\\s\\(\\)\\[\\]\\*\\.\\!\\:\\;\\-\\~\\+\\=\\@\\?\\#',äöüÄÖÜ\-]*$"
        },
        {
            checkClass: 'validate-dd',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: 'You must select a value',
            pattern: '^((?!-1).)*$'
        },
        {
            checkClass: 'validate-version',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: 'Version must be in the correct format e.g. v1.0.0.0',
            pattern: "^([v]{1,})([0-9]+)(\\.{1,}[\\d]+)(\\.{1,}[\\d]+)(\\.{1,}[\\d]+)$"
        },
        {
            checkClass: 'validate-ein',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: 'EIN must be nine numbers',
            pattern: "^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$"
        },
        {
            checkClass: 'validate-email',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: 'You must enter a real email',
            pattern: "^((([a-zA-Z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-zA-Z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?$"
        },
        {
            checkClass: 'validate-url',
            errorClass: 'error',
            inputErrorClass: 'error',
            errorMessage: 'You must enter a real URL',
            pattern: "^(https?|ftp):\\/\\/(((([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$"
        }
    ];

    $.fn.validate = function(method) {
        if (methods[method]) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (this.length > 0) {
                this.each(function() {
                    var args1 = ['#' + this.id];
                    var funcArgs = Array.prototype.concat.call(args1, args);
                    return methods[method].apply(this, funcArgs);
                });
            } else {
                return methods[method].apply(this, args);
            }
        } else if (typeof method === 'object' || ! method) {
            return methods.validate(this);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.validate');
        }
    };
})(jQuery);
