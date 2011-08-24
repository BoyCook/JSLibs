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
    $.fn.xsltBind = function(params) {
        var element = this.selector;
        var modelView = $(element).data('modelView');
        //Create new Model View binding
        if (modelView == undefined) {
            modelView = {
                xslUrl: params.xslUrl,
                xsl: undefined,
                xmlUrl: params.xmlUrl,
                xml: undefined,
                transformed: undefined,
                filterKey: undefined,
                filterOnEnter: undefined,
                filterParams: new Map(),
                params: params.params ? params.params : new Map(),
                callBack: params.callBack,
                filterCallBack: undefined,
                filterCallBackSelector: undefined,
                filterOnEnterFunction: undefined
            };
            var xsl = xsltEngine.xsls.get(params.xslUrl);
            var xml = xsltEngine.xmls.get(params.xmlUrl);
            if (xsl != undefined) {
                modelView.xsl = xsl;
            }
            if (xml != undefined) {
                modelView.xml = xml;
            }
            $(element).data('modelView', modelView);
        } else { //Update the existing Model View binding
            if (modelView.xslUrl != params.xslUrl) {
                modelView.xslUrl = params.xslUrl;
                modelView.xsl = null;
            }
            if (modelView.xmlUrl != params.xmlUrl) {
                modelView.xmlUrl = params.xmlUrl;
                modelView.xml = null;
            }
        }

        var reloadXml = params.reloadXml != undefined ? params.reloadXml : true;
        var filterable =  params.filterable != undefined ? params.filterable : false;

        if (filterable) {
            modelView.filterKey = (params.filterKey == undefined ? 'filter' : params.filterKey);
            modelView.filterOnEnter = (params.onEnter == undefined ? false : params.onEnter);
            modelView.filterCallBack = params.callBack;
            modelView.filterCallBackSelector = params.callBackSelector;
            modelView.filterOnEnterFunction = params.onEnterFunction;
        }

        xsltEngine.loadModelView(this.selector, reloadXml, !filterable);
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
})(jQuery);
