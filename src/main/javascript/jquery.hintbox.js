/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jquery.hintbox
 * @version   	>= 1.0
 *	
 * @name 		>= jquery.hintbox
 * @description >= Adds hint text to a textbox
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 * @requires  	>= jQuery 1.4.2           http://jquery.com
 */

(function($) {
    var methods = {
        hint: function(id, text) {
            $(id).focus(function(){
                methods.toggle(id, false, text);
            });
            $(id).blur(function(){
                if ($(id).val().length == 0) {
                    methods.toggle(id, true, text);
                }
            });
            methods.toggle(id, true, text);
        },
        toggle: function(id, on, text) {
            if (on) {
                $(id).addClass('hint');
                $(id).val(text);
            } else {
                if ($(id).hasClass('hint')) {
                    $(id).val('');
                }
                $(id).removeClass('hint');
            }
        }
    };

    $.fn.hintBox = function(text) {
        if (text == undefined) {
            text = 'Type...';
        }	
	    return this.each(function() {
            var id = '#' + this.id;
            methods.hint(id, text);
        });
    };
})(jQuery);
