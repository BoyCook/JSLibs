/**
 * XSLT
 * XSLT implementation for JavaScript
 *
 * @version   1.0
 * @since     2010-07-01
 * @copyright Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    Craig Cook
 * @requires  >= jQuery 1.4.2           http://jquery.com
 * @requires  >= sarissa.js 0.9.9.4     http://sarissa.sourceforge.net
 * @requires  >= jsMap.js 1.0           https://github.com/BoyCook/JSLibs/tree/master/map
 * @requires  >= jquery.hintbox.js 1.0  https://github.com/BoyCook/JSLibs/tree/master/jquery.hintbox
 */

function XSLT() {
    this.xmls = new Map();
    this.xsls = new Map();
    this.beforeLoad = undefined;
    this.afterLoad = undefined;
    this.unique = function () {}
}
XSLT.prototype.transform = function (element, processor, xml, callBack, callBackSelector, parameters) {
    var assetXml = Sarissa.getDomDocument();
    var modelView = $(element).data('modelView');
    assetXml = xml;
    var data = undefined;

    if (callBackSelector != undefined) {
        data = $(callBackSelector);
    }

    processor.clearParameters();
    $(parameters).each(function(){
        processor.setParameter(null, this.key, this.value);
    });

    var newDocument = processor.transformToDocument(assetXml);
    var serialized = new XMLSerializer();

    if (element != undefined) {
        modelView.transformed = newDocument;
        $(element).html($(serialized.serializeToString(modelView.transformed)).children());
    } else {
        return newDocument;
    }

    if (callBack) {
        if (callBackSelector != undefined) {
            callBack(data);
        } else {
            callBack(xml);
        }
    }
};
XSLT.prototype.filter = function(element, filterKey, filterValue, callBack) {
    var modelView = $(element).data('modelView');
    if (modelView != undefined) {
        modelView.filterParams.put(filterKey, filterValue);
        var params = modelView.filterParams.all().concat(modelView.params.all());
        this.transform(element, modelView.xsl, modelView.xml, callBack, modelView.filterCallBackSelector, params);
    }
};
XSLT.prototype.filterable = function(containerId, filterKey, onEnter, callBack) {
    var context = this;
    var childId = containerId + 'Child';
    var modelView = $(containerId).data('modelView');
    var filterId = childId.substring(1) + 'FilterTxt';
    var filterBoxId = childId.substring(1) + 'FilterBox';
    var childDiv = "<div id='" + childId.substring(1) + "' class='filterable-content'></div>";
    var filterDiv = "<div id='" + filterBoxId + "'><label>Filter: </label><input type='text' id='" + filterId + "'/></div>";
    var msg = onEnter ? 'Hit enter to filter...' : 'Type to filter...';

    $(containerId).append($(filterDiv));
    $(containerId).append($(childDiv));
    $(childId).append($(containerId + ' table').remove());
    $(childId).data('modelView', modelView);

    var filterHandler = function() {
        var modelView = $(childId).data('modelView');
        var size = $(modelView.xml.childNodes[0]).children().length;
        var value = $('#' + filterId).val();

        if (size > 1000 && (value == undefined || value.length <3)) {
            $.noticeAdd({ text: 'The result set it too large, you must filter by at least 3 characters', stay: true, type: 'error-notice'});
            return;
        }

        if (filterKey instanceof Array) {
            modelView.filterParams.clear();
            var values = value.split(' ');
            for (var i=0; i<values.length; i++) {
                context.filter(childId, filterKey[i], values[i], callBack);
            }
        } else {
            context.filter(childId, filterKey, value, callBack);
        }
    };

    if (onEnter) {
        $('#' + filterId).keyup(function(e) {
            if (e.keyCode == 13) {
                filterHandler();
            }
        });
    } else {
        $('#' + filterId).keyup(function(e) {
            if (!(e.keyCode >= 37 && e.keyCode <= 40)) {
                filterHandler();
            }
        });
    }

    if ($.fn.hintBox()) {
        $('#' + filterId).hintBox(msg);
        $('#' + filterBoxId + ' label').remove();
    }
};
XSLT.prototype.loadModelView = function(element, reloadXml, transform) {
    var modelView = $(element).data('modelView');
    var context = this;
    if (modelView != undefined) {
        context.loadXsl(modelView.xslUrl, false, function() {
            modelView.xsl = context.xsls.get(modelView.xslUrl);
            context.loadXml(modelView.xmlUrl, reloadXml, function() {
                modelView.xml = context.xmls.get(modelView.xmlUrl);

                if (transform) {
                    context.transform(element, modelView.xsl, modelView.xml, modelView.callBack, undefined, modelView.params.all());
                } else { // It's filterable
                    var size = $(modelView.xml.childNodes[0]).children().length;

                    if (size > 1000) {
                        if (modelView.callBack) {
                            modelView.callBack();
                        }
                        context.filterable(element, modelView.filterKey, true, modelView.filterCallBack);
                        $(element + 'Child').html("<h3>Type some filter parameters and hit enter to start</h3>");
                     } else {
                        var newCallBack = function() {
                            if (modelView.callBack) {
                                modelView.callBack();
                            }

                            context.filterable(element, modelView.filterKey, false, modelView.filterCallBack);

                            if (modelView.filterCallBack) {
                                modelView.filterCallBack();
                            }
                        };

                        context.transform(element, modelView.xsl, modelView.xml, newCallBack, undefined, modelView.params.all());
                    }
                }
            });
        });
    }
};
XSLT.prototype.loadXsl = function(xslUrl, reload, callBack) {
    var context = this;
    if (reload) {
        context.loadUrl(xslUrl, function(xml){
            var processor = new XSLTProcessor();
            processor.importStylesheet(xml);
            context.xsls.put(xslUrl, processor);
            if (callBack) {
                callBack();
            }
        });
    } else if (context.xsls.get(xslUrl) == undefined) {
        context.loadUrl(xslUrl, function(xml){
            var processor = new XSLTProcessor();
            processor.importStylesheet(xml);
            context.xsls.put(xslUrl, processor);
            if (callBack) {
                callBack();
            }
        });
    } else if (callBack){
        callBack();
    }
};
XSLT.prototype.loadXml = function(xmlUrl, reload, callBack) {
    var context = this;
    if (reload) {
        context.loadUrl(xmlUrl, function(xml){
            context.xmls.put(xmlUrl, xml);
            if (callBack) {
                callBack();
            }
        });
    } else if (context.xmls.get(xmlUrl) == undefined) {
        context.loadUrl(xmlUrl, function(xml){
            context.xmls.put(xmlUrl, xml);
            if (callBack) {
                callBack();
            }
        });
    } else if (callBack){
        callBack();
    }
};
XSLT.prototype.addXml = function(url, xml) {
    this.xmls.put(url, xml);
};
XSLT.prototype.functions = function(functions) {
    this.beforeLoad = functions.beforeLoad;
    this.afterLoad = functions.afterLoad;
	if (functions.unique) {
    	this.unique = functions.unique;		
	}
};
XSLT.prototype.loadUrl = function(url, callBack) {
    var context = this;
    if (context.beforeLoad) {
        context.beforeLoad();
    }

    if (url.indexOf('?') == -1) {
        url = url + '?_random=' + this.unique();
    } else {
        url = url + '&_random=' + this.unique();
    }

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'xml',
        success: function(xml) {
            if (context.afterLoad) {
                context.afterLoad();
            }
            callBack(xml);
        }
    });
};
