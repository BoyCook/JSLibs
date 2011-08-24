/**
 * XML util functions
 */

function getChildNodeValue(xml, name) {
    var node = getChildNode(xml, name);
    return $(node).text();
}

function getChildNodeAttribute(xml, name) {
    var node = getChildNode(xml, name);
    return node.getAttribute(name);
}

function getChildNode(xml, name) {
    var node = undefined;
    //Not using find as just want to check immediate children
    $(xml).children().each(function() {
        if (this.nodeName == name) {
            node = this;
        }
    });
    return node;
}

function getCDATAValue(cdata) {
    var start = "<!--[CDATA[";
    var end = "]]-->";
    var value = cdata.substring(cdata.indexOf(start) + start.length);
    value = value.substring(0, value.indexOf(end));
    return value;
}

function getAsset(xml) {
    return {
        name: xml.getAttribute('displayName'),
        id: xml.getAttribute('identity'),
        version: xml.getAttribute('version')
    };
}

function readFormToXML(id, xml) {
    var root = $(xml.childNodes[0]).children()[0];
    $('#' + id + ' .attribute-box, #' + id + ' .attribute-disabled').each(function() {
        if ($(this).hasClass('attribute-ein')) {
            var node = getChildNode(root, this.id);
            var einNode = $(node).find('ein:first');
            einNode.text(this.value);
        } else if ($(this).hasClass('attribute-boolean')) {
        	var val = $('#' + this.id).is(':checked');
        	// FIX: IE8 seems to convert false and true to 0 & -1 - so passing it as 1 & 0 instead
            setXMLValue(root, this.id, val?'1':'0');
        } else {
            setXMLValue(root, this.id, this.value);
        }
    });
}

function setXMLValue(xml, nodeName, value) {
    var node = getChildNode(xml, nodeName);
    $(node).text(value);
}

function getDOMDoc(xml) {
    var xmlStr = (new XMLSerializer()).serializeToString(xml);
    return (new DOMParser()).parseFromString(xmlStr, "text/xml");
}
