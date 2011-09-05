/**
 * @name         >= jquery.xslTransform
 * @version       >= 1.0
 * @description >= jQuery wrapper for jsXslt and Sarissa
 * @vcs            >= git
 * @website        >= https://github.com/BoyCook/JSLibs
 * @since         >= 2010-07-01
 * @copyright     >= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author        >= Craig Cook
 * @requires    >= jQuery 1.4.2           http://jquery.com
 * @requires    >= jsXslt.js 1.0          http://craigcook.co.uk
 */

(function($) {
    var engine = new XSLT();
    var methods = {
        bind: function(params) {
            var id = this.selector;
            var modelView = $(id).data('modelView');
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
                var xsl = engine.xsls.get(params.xslUrl);
                var xml = engine.xmls.get(params.xmlUrl);
                if (xsl != undefined) {
                    modelView.xsl = xsl;
                }
                if (xml != undefined) {
                    modelView.xml = xml;
                }
                $(id).data('modelView', modelView);
            } else { //Update the existing Model View binding
                //TODO: consider this further
                if (modelView.xslUrl != params.xslUrl) {
                    modelView.xslUrl = params.xslUrl;
                    modelView.xsl = null;
                }
                if (modelView.xmlUrl != params.xmlUrl) {
                    modelView.xmlUrl = params.xmlUrl;
                    modelView.xml = null;
                }
            }

            //TODO: consider making filterable implicit based upon filterKey
            var reloadXml = params.reloadXml != undefined ? params.reloadXml : true;
            var filterable = params.filterable != undefined ? params.filterable : false;

            if (filterable) {
                modelView.filterKey = (params.filterKey == undefined ? 'filter' : params.filterKey);
                modelView.filterOnEnter = (params.onEnter == undefined ? false : params.onEnter);
                modelView.filterCallBack = params.filterCallBack;
                modelView.filterCallBackSelector = params.callBackSelector;
                modelView.filterOnEnterFunction = params.onEnterFunction;
            }

            engine.loadModelView(id, reloadXml, !filterable);
            return modelView;
        },
        transform: function(reloadXml) {
            if (reloadXml == undefined) {
                reloadXml = true;
            }
            engine.loadModelView(this.selector, reloadXml, true);
        },
        clear: function() {
            $(this.selector).data('modelView', null);
            $(this.selector).html('');
        },
        filter: function(params) {
            engine.filter(this.selector, params.filterKey, params.filterValue, params.callBack);
        },
        loadXsl: function(xslUrl) {
            engine.loadXsl(xslUrl);
        },
        functions: function(functions) {
            engine.functions(functions);
        },
        addXml: function(url, xml) {
            engine.addXml(url, xml);
        }
    };
    $.fn.xslt = function(params) {
        if (methods[params]) {
            return methods[params].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof params === 'object' || ! params) {
            return methods.bind.apply(this, arguments);
        } else {
            $.error('Method ' + params + ' does not exist on jQuery.validate');
        }
    };
})(jQuery);
