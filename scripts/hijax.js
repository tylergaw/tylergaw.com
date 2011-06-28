function Hijax() {
	var container, url, canvas, data, loading, callback, request;
	
	this.setContainer = function(value) {
		container = value;
	}
	this.setUrl = function(value) {
		url = value;
	}
	this.setCanvas = function(value) {
		canvas = value;
	}
	this.setLoading = function(value) {
		loading = value;
	}
	this.setCallback = function(value) {
		callback = value;
	}
////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	//captureData method
	//
	//
	//
	this.captureData = function() {
		if(container.nodeName.toLowerCase() == 'form') {
			container.onsubmit = function() {
				var query = "";
				for(var i=0; i<this.elements.length; i++) {
					query+= this.elements[i].name;
					query+= "=";
					query+= escape(this.elements[i].value);
					query+= "&";
				}
				data = query;
				return !start();
			}
		}else{
			var links = container.getElementsByTagName('a');
			for(var i=0; i<links.length; i++) {
				links[i].onclick = function() {
					url = this.href.split('=')[1];
					url +='.php';
					return !start();
				}
			}
			links = null;
		}
	}
////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	//function start()
	//
	//
	//
	var start = function() {
		request = getHTTPObject();
		if(!request || !url) {
			return false;
		}else{
			initiateRequest();
			return true;
		}
	}
////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	//function getHTTPObject()
	//
	//
	//
	function getHTTPObject() {
		var xhr = false;
		if(window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		}else if(window.ActiveXObject) {
			try{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e) {
				try {
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e) {
					xhr = false;
				}
			}
		}
		return xhr;
	}
////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	//function initiateRequest()
	//
	//
	//
	var initiateRequest = function() {
		if(loading) {
			loading();
		}
		request.onreadystatechange = completeRequest;
		if(data) {
			request.open("POST", url, true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(data);
		}else{
			request.open("GET", url, true);
			request.send(null);
		}
	}
////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	//function completeRequest()
	//
	//
	//
	var completeRequest = function() {
		if(request.readyState == 4) {
			if(request.status == 200 || request.status == 304) {
				if(canvas) {
					canvas.innerHTML = request.responseText;
				}
				if(callback) {
					callback();
				}
			}
		}
	}
}