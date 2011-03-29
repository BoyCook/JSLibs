//@tfamanaged
/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jquery.collapsible
 * @version   	>= 1.0
 *	
 * @name 		>= jquery.collapsible
 * @description >= Makes a div collapsible, similar to an accordion
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 * @requires  	>= jQuery 1.4.2           http://jquery.com
 */

(function($) {
    $.fn.collapsible = function(open) {
        if (open == undefined) {
            open = false;
        }

        return this.each(function(){
            var element = '#' + this.id;
            var divCss = 'ui-accordion ui-widget ui-helper-reset ui-accordion-icons collapsible-div';
            var collapsedCss = 'ui-accordion-header ui-helper-reset collapsible-head ui-state-default ui-corner-all';
            var expandedCss = 'ui-accordion-header ui-helper-reset collapsible-head ui-state-active ui-corner-top';
            var text = $(element + ' h3:first').text();
			var doOpen = $(element).hasClass('collapsible-open') || open;

            $(element).addClass(divCss);
            $(element + ' h3:first').html("<span class=\"ui-icon ui-icon-triangle-1-e\"></span><a href=\"#\">" + text + "</a>");

            if (doOpen) {
                $(element + ' h3:first').attr('class', expandedCss);
                $(element + ' span:first').attr('class', 'ui-icon ui-icon-triangle-1-s');
                $(element + ' div:first').show();
            } else {
                $(element + ' h3:first').attr('class', collapsedCss);
                $(element + ' div:first').hide();
            }

            $(element + ' h3:first').click(function() {
                if ($(element + ' div:first').is(':visible')) {
                    $(element + ' h3:first').attr('class', collapsedCss);
                    $(element + ' span:first').attr('class', 'ui-icon ui-icon-triangle-1-e');
                } else {
                    $(element + ' h3:first').attr('class', expandedCss);
                    $(element + ' span:first').attr('class', 'ui-icon ui-icon-triangle-1-s');
                }

                $(element + ' div:first').toggle();
                return false;
            });
        });
    };
})(jQuery);
