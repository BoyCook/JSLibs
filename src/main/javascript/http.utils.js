/**
 * HTTP utility functions
 */

function HTTPService() {
	this.requests = [];
	this.params = undefined;
	this.beforeLoad = undefined;
    this.afterLoad = undefined;	
    this.unique = undefined;
    this.error = undefined;
	this.baseContext = window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1];

	this.mappings = new Map();
	this.mappings.put('200', 'Ok');
	this.mappings.put('201', 'Created');
	this.mappings.put('205', 'Updated');
	this.mappings.put('401', 'You are not authorized - check your team memberships');
	this.mappings.put('404', 'Resource not found - try another search');
	this.mappings.put('409', 'Resource conflict - try another name');
	this.mappings.put('422', 'Validation failed'); 
}

HTTPService.prototype.setup = function(config) {
	this.beforeLoad = config.beforeLoad;
    this.afterLoad = config.afterLoad;
    this.unique = config.unique;


    if (config.mappings) {
        this.mappings = context.mappings;
    }

	if (config.xhr && config.error) {
        this.error = config.error;
		jQuery.ajaxSetup({
		    contentType: 'application/xml',
		    xhr: config.xhr,
		    error: config.error
		});		
	}
};
HTTPService.prototype.getParams = function() {
    if (this.params == undefined) {
        var url = document.location.toString();
        url = url.substring(url.indexOf('?') + 1);
        var hashs = url.split('&');
		this.params = [];

        for (var i = 0; i < hashs.length; i++) {
            var item = hashs[i].split('=');
            this.params[item[0]] = item[1];
        }
    }
    return this.params;	
};
HTTPService.prototype.getParam = function(name) {
    return this.getParams()[name];	
};
HTTPService.prototype.get = function(url, type, callBack, errorCallBack, sync) {
    var request = new HTTPRequest(url, 'GET', type, undefined, callBack, errorCallBack);
    this.requests.push(request);
    this.submit(request, sync);
};
HTTPService.prototype.put = function(url, type, data, callBack, errorCallBack, sync) {
    var request = new HTTPRequest(url, 'PUT', type, data, callBack, errorCallBack);
    this.requests.push(request);
    this.submit(request, sync);
};
HTTPService.prototype.post = function(url, type, data, callBack, errorCallBack, sync) {
    var request = new HTTPRequest(url, 'POST', type, data, callBack, errorCallBack);
    this.requests.push(request);
    this.submit(request, sync);
};
HTTPService.prototype.del = function(url, callBack, errorCallBack, sync) {
    var request = new HTTPRequest(url, 'DELETE', 'xml', undefined, callBack, errorCallBack);
    this.requests.push(request);
    this.submit(request, sync);
};
HTTPService.prototype.submit = function(request, sync) {
	this.doSubmit(request.url, request.method, request.type, request.data, request.callBack, request.error, sync);
};
HTTPService.prototype.doSubmit = function(url, method, type, data, callBack, error, sync) {
	if(sync == null ||  sync == undefined) {
		sync = false;
	}

	var context = this;
	if (this.beforeLoad) {
		this.beforeLoad();
	}

	if (this.unique) {
	    if (url.indexOf('?') == -1) {
	        url = url + '?_random=' + this.unique();
	    } else {
	        url = url + '&_random=' + this.unique();
	    }		
	}

    jQuery.ajax({
        url: url,
        type: method,
        data: data,
        dataType: type,
	      async: !sync,
        success: function(xml) {
			if (context.afterLoad) {
				context.afterLoad();
			}	
            if (callBack) {
                callBack(xml);
            }
        },
        error: (error) ? error : context.error
    });
};

function HTTPRequest(url, method, type, data, callBack, error) {
    this.url = url;
    this.method = method;
    this.type = type;
    this.data = data;
    this.callBack = callBack;
    this.error = error;
}
function HTTPSynchronizer(service, requests, callBack) {
    this.service = service;
    this.cnt = 0;
    this.requests = requests;
    this.callBack = callBack;
}
HTTPSynchronizer.prototype.submit = function(index){
    if (index == undefined) {
        index = this.cnt;
    }
    if (index == this.requests.length) {
        return;
    }

    var context = this;
    var request = this.requests[index];
    var orgCallBack = request.callBack;
    request.callBack = function(){
        orgCallBack();
        context.cnt++;

        if (context.cnt == context.requests.length) {
            if (context.callBack) {
                context.callBack();
            }
        } else {
            context.submit(context.cnt);
        }
    };
    this.service.submit(request);
};
