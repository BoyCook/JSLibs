/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jquery.xslTransform
 * @version   	>= 1.0
 *	
 * @name 		>= jquery.xslTransform
 * @description >= jQuery wrapper for jsXslt and Sarissa
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 * @requires    >= jQuery 1.4.2           http://jquery.com
 * @requires    >= jsXslt.js 1.0          http://craigcook.co.uk
 */

var xsltEngine = new XSLT();

(function($) {
    $.fn.xsltBind = function(xslUrl, xmlUrl, callBack, params) {
        var element = this.selector;
        var modelView = $(element).data('modelView');
        if (modelView == undefined) {
            modelView = {
                xslUrl: xslUrl,
                xsl: undefined,
                xmlUrl: xmlUrl,
                xml: undefined,
                transformed: undefined,
                filterKey: undefined,
                filterParams: new Map(),
                params: params ? params : new Map(),
                callBack: callBack,
                filterCallBack: undefined,
                filterCallBackSelector: undefined
            };
            var xsl = xsltEngine.xsls.get(xslUrl);
            var xml = xsltEngine.xmls.get(xmlUrl);

            if (xsl != undefined) {
                modelView.xsl = xsl.value;
            }
            if (xml != undefined) {
                modelView.xml = xml.value;
            }
            $(element).data('modelView', modelView);
        } else {
            if (modelView.xslUrl != xslUrl) {
                modelView.xslUrl = xslUrl;
                modelView.xsl = null;
            }
            if (modelView.xmlUrl != xmlUrl) {
                modelView.xmlUrl = xmlUrl;
                modelView.xml = null;
            }
        }
        return modelView;
    };
    $.fn.transform = function(reloadXml) {
        if (reloadXml == undefined) {
            reloadXml = true;
        }
        xsltEngine.loadModelView(this.selector, reloadXml, true);
    };
    $.fn.xsltClear = function() {
        $(this.selector).data('modelView', null);
        $(this.selector).html('');
    };
    $.fn.xsltFilter = function(filterKey, filterValue, callBack) {
        xsltEngine.filter(this.selector, filterKey, filterValue, callBack);
    };
    $.fn.filterable = function(filterKey, callBack, callBackSelector) {
        if (filterKey == undefined) {
            filterKey = 'filter';
        }
        var element = this.selector;
        var modelView = $(element).data('modelView');
        modelView.filterKey = filterKey;
        modelView.filterCallBack = callBack;
        modelView.filterCallBackSelector = callBackSelector;
        xsltEngine.loadModelView(element, true, false);
    };
})(jQuery);
