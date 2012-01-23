/**
 * @name 		>= XSLT
 * @version   	>= 1.0
 * @description >= XSLT implementation for JavaScript using Sarissa
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 * @requires  	>= jQuery 1.4.2           http://jquery.com
 * @requires  	>= sarissa.js 0.9.9.4     http://sarissa.sourceforge.net
 * @requires  	>= jsMap.js 1.0           https://github.com/BoyCook/JSLibs
 * @requires  	>= jquery.hintbox.js 1.0  https://github.com/BoyCook/JSLibs
 */

function XSLT(params) {
	var context = this;
    this.xmls = new Map();
    this.xsls = new Map();
    this.beforeLoad = undefined;
    this.afterLoad = undefined;
    this.unique = function () {};
	this.http = function(url, callBack) {
	    if (url.indexOf('?') == -1) {
	        url = url + '?_random=' + context.unique();
	    } else {
	        url = url + '&_random=' + context.unique();
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

    if (params) {
        this.functions(params);
    }
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
        var filterCallBack = function(data) {
            if (callBack) {
                callBack(data);
            }

            var radioButtons = $(element + ' input:radio');
            if (radioButtons.length == 1) {
                radioButtons.attr('checked', true);
            }
        };
        this.transform(element, modelView.xsl, modelView.xml, filterCallBack, modelView.filterCallBackSelector, params);
    }
};
XSLT.prototype.paginate = function(element, pageStartKey, pageEndKey, startValue, endValue, callBack) {
    var modelView = $(element).data('modelView');
    if (modelView != undefined) {
        modelView.params.put(pageStartKey, startValue.toString());
        modelView.params.put(pageEndKey, endValue.toString());
        var paginateCallBack = function() {
            if (callBack) {
                callBack();
            }

            var radioButtons = $(element + ' input:radio');
            if (radioButtons.length == 1) {
                radioButtons.attr('checked', true);
            }
        }
        this.transform(element, modelView.xsl, modelView.xml, paginateCallBack, modelView.pageCallBackSelector, modelView.params.all());
    }
};
XSLT.prototype.filterable = function(containerId, inputContainerId, filterKey, onEnter, callBack) {
    var context = this;
    var childId = containerId + 'Child';
    var modelView = $(containerId).data('modelView');
    var filterId = childId.substring(1) + 'FilterTxt';
    var filterBoxId = childId.substring(1) + 'FilterBox';
    var childDiv = "<div id='" + childId.substring(1) + "' class='filterable-content'></div>";
    var filterInput = "<input type='text' id='" + filterId + "'/>";
    var filterDiv = "<div id='" + filterBoxId + "'><label>Filter: </label>" + filterInput + "</div>";
    var msg = modelView.filterBoxMessage != undefined ? modelView.filterBoxMessage : (onEnter ? 'Hit enter to filter...' : 'Type to filter...');
    var contents = $(containerId).children().remove();
    if(inputContainerId) {
        $('#' + filterId).remove();
        $(inputContainerId).append($(filterInput));
    } else {
        $(containerId).append($(filterDiv));
    }
    $(containerId).append($(childDiv));
    $(childId).append(contents);
    $(childId).data('modelView', modelView);

    var filterHandler = function() {
        var modelView = $(childId).data('modelView');
        var size = $(modelView.xml.childNodes[0]).children().length;
        var value = $('#' + filterId).val();

        if (size > 1000 && (value == undefined || value.length <3)) {
            $.noticeAdd({ text: 'The result set it too large, you must filter by at least 3 characters', stay: false, type: 'error-notice'});
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
XSLT.prototype.pagination = function(containerId, inputContainerId, pageStartKey, pageEndKey, pageRange, totalRecords, callBack) {
    var context = this;
    var childId = containerId + 'Child';
    var modelView = $(containerId).data('modelView');
    var paginationId = childId.substring(1) + 'Pagination';
    var startButtonId = childId.substring(1) + 'StartButton';
    var previousButtonId = childId.substring(1) + 'PreviousButton';
    var nextButtonId = childId.substring(1) + 'NextButton';
    var endButtonId = childId.substring(1) + 'EndButton';
    var pageInfoId = childId.substring(1) + 'PageInfo';

    var remainder = totalRecords % pageRange;
    var maxPages = Math.round(totalRecords / pageRange);
    if(remainder < 5) {
        maxPages++;
    }

    var childDiv = "<div id='" + childId.substring(1) + "' class='filterable-content'></div>";
    var startButton = "<button id='" + startButtonId + "' disabled='' class='paging-content'>Start</button>";
    var previousButton = "<button id='" + previousButtonId + "' disabled='' class='paging-content'>Previous</button>";
    var nextButton;
    var endButton;
    var paginationDiv = "<div id='" + paginationId + "'>" + startButton + previousButton;
    if(totalRecords <= pageRange) {
        maxPages = 1;
        nextButton = "<button id='" + nextButtonId + "' disabled='' class='paging-content'>Next</button>";
        endButton = "<button id='" + endButtonId + "' disabled='' class='paging-content'>End</button>";
    } else {
        nextButton = "<button id='" + nextButtonId + "' class='paging-content'>Next</button>";
        endButton = "<button id='" + endButtonId + "' class='paging-content'>End</button>";
    }
    paginationDiv += nextButton + endButton;
    var pageInfo = "<i class='paging-content' style='padding-left: 5px;' id='" + pageInfoId + "'>1 of " + (maxPages) + "</i>";
    paginationDiv += pageInfo + "</div>";

    if(inputContainerId) {
        $('.paging-content').remove();
        var pagingContent = startButton + previousButton + nextButton + endButton + pageInfo;
        $(inputContainerId).append($(pagingContent));
    } else {
        $(containerId).append($(paginationDiv));
    }
    $(containerId).append($(childDiv));
    $(childId).append($(containerId + ' table:first').remove());
    $(childId).data('modelView', modelView);

    var pageHandler = function(multiplier) {
        var modelView = $(childId).data('modelView');
        modelView.filterParams.clear();
        var startValue = multiplier * pageRange;
        var endValue = (multiplier * pageRange) + pageRange;
        context.paginate(childId, pageStartKey, pageEndKey, startValue, endValue, callBack);
        $('#' + pageInfoId).text((multiplier + 1) + ' of ' + (maxPages));
    };

    var clickCounter = 0;
    $('#' + startButtonId).click(function() {
        clickCounter = 0;
        pageHandler(clickCounter);
        $('#' + startButtonId).attr('disabled','disabled');
        $('#' + previousButtonId).attr('disabled','disabled');
        $('#' + nextButtonId).removeAttr('disabled');
        $('#' + endButtonId).removeAttr('disabled');
    });
    $('#' + previousButtonId).click(function() {
        clickCounter--;
        pageHandler(clickCounter);
        if(clickCounter == 0) {
            $('#' + previousButtonId).attr('disabled','disabled');
            $('#' + startButtonId).attr('disabled','disabled');
        }
        $('#' + nextButtonId).removeAttr('disabled');
        $('#' + endButtonId).removeAttr('disabled');
    });
    $('#' + nextButtonId).click(function() {
        clickCounter++;
        pageHandler(clickCounter);
        if(((clickCounter + 1) * pageRange) >= totalRecords) {
            $('#' + nextButtonId).attr('disabled','disabled');
            $('#' + endButtonId).attr('disabled','disabled');
        }
        $('#' + previousButtonId).removeAttr('disabled');
        $('#' + startButtonId).removeAttr('disabled');
    });
    $('#' + endButtonId).click(function() {
        clickCounter = maxPages - 1;
        pageHandler(clickCounter);
        $('#' + endButtonId).attr('disabled','disabled');
        $('#' + nextButtonId).attr('disabled','disabled');
        $('#' + previousButtonId).removeAttr('disabled');
        $('#' + startButtonId).removeAttr('disabled');
    });

};
XSLT.prototype.loadModelView = function(element, inputContainer, reloadXml, transform, paginate) {
    var modelView = $(element).data('modelView');
    var context = this;
    if (modelView != undefined) {
        context.loadXsl(modelView.xslUrl, false, function() {
            modelView.xsl = context.xsls.get(modelView.xslUrl);
            context.loadXml(modelView.xmlUrl, reloadXml, function() {
                modelView.xml = context.xmls.get(modelView.xmlUrl);

                if (transform && !paginate) {
                    context.transform(element, modelView.xsl, modelView.xml, modelView.callBack, modelView.callBackSelector, modelView.params.all());
                } else { // It's filterable/paginating
                    if (!modelView.filterOnEnter && modelView.filterOnEnterFunction != undefined && !paginate) {
                        modelView.filterOnEnter = modelView.filterOnEnterFunction(modelView.xml);
                    }
                    if (modelView.filterOnEnter && !paginate) {
                        if (modelView.callBack) {
                            modelView.callBack();
                        }
                        context.filterable(element, inputContainer, modelView.filterKey, true, modelView.filterCallBack);
                        $(element + 'Child').html("<h3>" + modelView.filterAreaMessage + "</h3>");
                    } else {
                        var newCallBack = function(data) {
                            if (modelView.callBack) {
                                modelView.callBack(data);
                            }
                            if(paginate) {
                                context.pagination(element, inputContainer, modelView.pageStartKey, modelView.pageEndKey, modelView.pageRange, modelView.pageMax, modelView.pageCallBack);
                            } else {
                                context.filterable(element, inputContainer, modelView.filterKey, false, modelView.filterCallBack);
                            }
                            if (modelView.filterCallBack) {
                                modelView.filterCallBack(data);
                            }
                        };

                        context.transform(element, modelView.xsl, modelView.xml, newCallBack, modelView.callBackSelector, modelView.params.all());
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
XSLT.prototype.getXml = function(url) {
    return this.xmls.get(url);
};
XSLT.prototype.functions = function(functions) {
    this.beforeLoad = functions.beforeLoad;
    this.afterLoad = functions.afterLoad;
	if (functions.unique) {
    	this.unique = functions.unique;		
	}
	if (functions.http) {
		this.http = functions.http;
	}
};
XSLT.prototype.loadUrl = function(url, callBack) {
    var context = this;
    if (context.beforeLoad) {
        context.beforeLoad();
    }
	context.http(url, callBack);
};
