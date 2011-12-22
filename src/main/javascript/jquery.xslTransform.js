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
            //TODO: use $.extend here instead
            if (modelView == undefined) {
                modelView = {
                    xslUrl: params.xslUrl,
                    xsl: undefined,
                    xmlUrl: params.xmlUrl,
                    xml: undefined,
                    transformed: undefined,
                    filterKey: undefined,
                    pageStartKey: params.pageStartKey ? params.pageStartKey : 'pageStart',
                    pageEndKey: params.pageEndKey ? params.pageEndKey : 'pageFinish',
                    filterOnEnter: undefined,
                    filterParams: new Map(),
                    filterBoxMessage: params.filterBoxMessage,
                    filterAreaMessage: params.filterAreaMessage ? params.filterAreaMessage : 'Type some filter parameters and hit enter to start',
                    params: params.params ? params.params : new Map(),
                    callBack: params.callBack,
                    filterCallBack: undefined,
                    filterCallBackSelector: undefined,
                    filterOnEnterFunction: undefined,
                    pageCallBack: undefined,
                    pageCallBackSelector: undefined,
                    pageRange: params.pageRange ? params.pageRange : 10,
                    pageMax: params.pageMax
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
                if (modelView.xslUrl != params.xslUrl && params.xslUrl != undefined) {
                    modelView.xslUrl = params.xslUrl;
                    modelView.xsl = null;
                }
                if (modelView.xmlUrl != params.xmlUrl && params.xmlUrl != undefined) {
                    modelView.xmlUrl = params.xmlUrl;
                    modelView.xml = null;
                }
                if (params.params != undefined) {
                    modelView.params = params.params;
                }
            }

            //TODO: consider making filterable implicit based upon filterKey
            var reloadXml = params.reloadXml != undefined ? params.reloadXml : true;
            var filterable = params.filterable != undefined ? params.filterable : false;
            var paginate = params.paginate  != undefined ? params.paginate : false;

            if (filterable) {
                modelView.filterKey = (params.filterKey == undefined ? 'filter' : params.filterKey);
                modelView.filterOnEnter = (params.onEnter == undefined ? false : params.onEnter);
                modelView.filterCallBack = params.filterCallBack;
                modelView.filterCallBackSelector = params.filterCallBackSelector;
                modelView.filterOnEnterFunction = params.onEnterFunction;
            }

            if (paginate) {
                modelView.pageStartKey = (params.pageStartKey == undefined ? 'pageStart' : params.pageStartKey);
                modelView.pageEndKey = (params.pageEndKey == undefined ? 'pageFinish' : params.pageEndKey);
                modelView.pageCallBack = params.pageCallBack;
                modelView.pageCallBackSelector = params.pageCallBackSelector;
                modelView.pageRange = (params.pageRange == undefined ? 10 : params.pageRange);
                modelView.pageMax = params.pageMax;
            }

            engine.loadModelView(id, reloadXml, !filterable, paginate);
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
        loadXml: function(url) {
            engine.loadXml(url);
        },
        addXml: function(url, xml) {
            engine.addXml(url, xml);
        },
        getXml: function(url) {
            return engine.getXml(url);
        }
    };
    $.fn.xslt = function(params) {
        if (methods[params]) {
            return methods[params].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof params === 'object' || ! params) {
            return methods.bind.apply(this, arguments);
        } else {
            $.error('Method ' + params + ' does not exist on jQuery.xslt');
        }
    };
})(jQuery);
