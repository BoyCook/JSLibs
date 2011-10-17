/**
 * @name        >= jquery.collapsible
 * @version     >= 1.0
 * @description >= Makes a div collapsible, similar to an accordion
 * @vcs         >= git
 * @website     >= https://github.com/BoyCook/JSLibs
 * @since       >= 2010-07-01
 * @copyright   >= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author      >= Craig Cook
 * @requires    >= jQuery 1.4.2           http://jquery.com
 */

(function($) {
    var config = {
        containerCss: 'ui-accordion ui-widget ui-helper-reset ui-accordion-icons collapsible-div',
        headCssExpanded: 'ui-accordion-header ui-helper-reset collapsible-head ui-state-active ui-corner-top',
        headCssCollapsed: 'ui-accordion-header ui-helper-reset collapsible-head ui-state-default ui-corner-all',
        spanCssExpanded: 'ui-icon ui-icon-triangle-1-s',
        spanCssCollapsed: 'ui-icon ui-icon-triangle-1-e'
    };
    var methods = {
        toggle: function(element) {
            if ($(element).children('div:first').is(':visible')) {
                methods.collapse(element);
            } else {
                methods.open(element);
            }
        },
        open: function(element) {
            $(element).children('h3:first').attr('class', config.headCssExpanded);
            $(element).children('h3:first').children('span:first').attr('class', config.spanCssExpanded);
            $(element).children('div:first').show();
        },
        collapse: function(element) {
            $(element).children('h3:first').attr('class', config.headCssCollapsed);
            $(element).children('h3:first').children('span:first').attr('class', config.spanCssCollapsed);
            $(element).children('div:first').hide();
        },
        makeCollapsible: function(element, open) {
            var text = $(element).children('h3:first').text();
            var doOpen = $(element).hasClass('collapsible-open') || open;
            $(element).addClass(config.containerCss);
            $(element).children('h3:first').html("<span class=\"ui-icon ui-icon-triangle-1-e\"></span><a href=\"#\">" + text + "</a>");
            if (doOpen) {
                methods.open(element);
            } else {
                methods.collapse(element);
            }
            $(element).children('h3:first').click(function() {
                methods.toggle(element);
            });
        }
    };

    $.fn.collapsible = function(method) {
        if (methods[method]) {
            this.each(function() {
                methods[method].call(this, this);
            });
        } else if (typeof method === 'boolean' || !method) {
            //method may be undefined
            this.each(function() {
                methods.makeCollapsible(this, (!method ? false : true));
            });
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.validate');
        }
        return this;
    };
})(jQuery);
