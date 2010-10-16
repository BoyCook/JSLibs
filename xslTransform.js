/**
 * xslTransform
 * JavaScript wrapper for Sarissa <http://sarissa.sourceforge.net/>
 *
 * @version   1.0
 * @since     2010-06-24
 * @copyright Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    Craig Cook
 * @requires  >= jQuery 1.4.2           http://jquery.com
 * @requires  >= sarissa.js 0.9.9.4     http://sarissa.sourceforge.net
 * @requires  >= jsMap.js 1.0           http://craigcook.co.uk
 */

var xslt = {
    xsls: new Map(),
    init: function() {
        try {
            //TODO: is this not just checking for > 1 ???
            parseFloat(jQuery.fn.jquery) >= 1;
        } catch(e) {
            alert('xslTransform requires jQuery 1.4.2 or higher. Please load it prior to xslTransform');
        }
        try {
            Sarissa;
        } catch(e) {
            alert('Sarissa is missing. Please load it prior to xslTransform');
        }
    },
    transform: function(element, xsl, xml, callback) {
        var processor = new XSLTProcessor();
        var assetXml = Sarissa.getDomDocument();

        processor.importStylesheet(xsl);
        assetXml = xml;
        var newDocument = processor.transformToDocument(assetXml);
        var serialized = new XMLSerializer();

        if (element != undefined) {
            jQuery(element).html(jQuery(serialized.serializeToString(newDocument)).children());
        } else {
            return newDocument;
        }

        if (callback) {
            callback();
        }
    },
    loadTransform: function(xslUrl) {
        var xsl = xslt.xsls.get(xslUrl);
        if (xsl == undefined) {
			http(xslUrl, 'GET', null, function(xslXml) {
                xslt.xsls.put(xslUrl, xslXml);
            });
        }
    },
    //TODO: cache the processor objects
    transformXml: function(element, xslUrl, xml, callback) {
        var xsl = xslt.xsls.get(xslUrl);
        if (xsl != undefined) {
            xslt.transform(element, xsl, xml, callback);
        } else {
			http(xslUrl, 'GET', null, function(xslXml) {
                xslt.xsls.put(xslUrl, xslXml);
                xslt.transform(element, xslXml, xml, callback);
            });
        }
    },
    transformUrl: function(element, xslUrl, xmlUrl, callback, getCallBack) {
        if ((typeof xslUrl) == 'string') { //If it's a URL
            var xsl = xslt.xsls.get(xslUrl);
            if (xsl != undefined) {
				http(xmlUrl, 'GET', null, function(xml) {
					if (getCallBack) {
						getCallBack();
					}					
                    xslt.transform(element, xsl, xml, callback);
                });
            } else {
				http(xslUrl, 'GET', null, function(xslXml) {
                    xslt.xsls.put(xslUrl, xslXml);
					http(xmlUrl, 'GET', null, function(xml) {
						if (getCallBack) {
							getCallBack();
						}
                        xslt.transform(element, xslXml, xml, callback);
                    });
                });
            }
        } else {
			http(xmlUrl, 'GET', null, function(xml) {
				if (getCallBack) {
					getCallBack();
				}				
                xslt.transform(element, xslUrl, xml, callback);
            });
        }
    },
    transformElements: function(items, xmlUrl, callback) {
        if ((typeof xmlUrl) == 'string') { //If it's a URL
			http(xmlUrl, 'GET', null, function(xml) {
                for (var i = 0; i < items.length; i++) {
                    //Only do callback after last transform
                    xslt.transformXml(
	                    items[i].element,
	                    items[i].xslUrl,
	                    xml,
	                    (i == (items.length - 1) ? callback : null)
                    );
                }
            });
        } else {
            for (var i = 0; i < items.length; i++) {
                //Only do callback after last transform
                xslt.transformXml(
	                 items[i].element,
	                 items[i].xslUrl,
	                 xmlUrl,
	                 (i == (items.length - 1) ? callback : null)
                 );
            }
        }
    }
};

xslt.init();

function http(url, method, data, callback, error) {
	//TODO: this is ugly
	if (error) {
	    jQuery.ajax({
	        url: url,
	        type: method ? method : 'GET',
	        data: data,
	        dataType: 'xml',
	        success: function(xml) {
	            if (callback) {
	                callback(xml);
	            }
	        },
			error: error
	    });		
	} else {
	    jQuery.ajax({
	        url: url,
	        type: method ? method : 'GET',
	        data: data,
	        dataType: 'xml',
	        success: function(xml) {
	            if (callback) {
	                callback(xml);
	            }
	        }
	    });		
	}
}
