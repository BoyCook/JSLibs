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

function setXMLValue(xml, nodeName, value) {
    var node = getChildNode(xml, nodeName);
    $(node).text(value);
}

function getDOMDoc(xml) {
    var xmlStr = (new XMLSerializer()).serializeToString(xml);
    return (new DOMParser()).parseFromString(xmlStr, "text/xml");
}
