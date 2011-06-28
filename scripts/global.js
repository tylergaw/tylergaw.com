////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	// prepareLinks()
	//
	//
	//
function prepareLinks() {
	var links = document.getElementsByTagName("a");
	for(var i=0; i<links.length; i++) {
		var rel = links[i].getAttribute("rel");
		if(rel == "external") {
			links[i].setAttribute("target", "_blank");
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	//displayLoading()
	//
	//
	//
function displayLoading(element, value) {
	var button = document.getElementById(element);
	button.setAttribute("value", value);
}

////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	// removeConfirmations();
	//
	//
	//
function removeConfirmations() {
	var paras = document.getElementsByTagName("p");
	for(var i=0; i<paras.length; i++){
		if(paras[i].className == "confirm" || paras[i].className == "removed"){
			var feedback = paras[i];
			setTimeout(function() {new Effect.Fade(feedback);}, 6000);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	// ajaxifyForm(form_id, url, loadingElem)
	//
	//
	//
function ajaxifyForm(form_id, url, loadingElem, loadingMsg) {
	if(document.getElementById(form_id)) {
		var theForm = document.getElementById(form_id);
		var xhr = new Hijax();
		xhr.setContainer(theForm);
		
		if(!base_path) {
			var base_path = "";
		}
		
		xhr.setUrl(base_path + url);
		xhr.setCanvas(theForm.parentNode);
		if(loadingElem != '') {
			xhr.setLoading(function() {
				displayLoading(loadingElem, loadingMsg);
			});
		}
		xhr.setCallback(function() {
			ajaxifyForm(form_id, url, loadingElem, loadingMsg);
			removeConfirmations();
		});
		xhr.captureData();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	// initPageScroll( htmlelem [container], classname [top_class]);
	// Grabs all links in [container], sets their onclick to scroll to an internal anchor
	// 
	// Grabs all a tags with [top_class], sets their onclick to scroll to an internal anchor
	//
	//
	//
function initPageScroll(container, top_class) {
	var container = $(container);
	if(!container) return false;
	
	
	// Prepare main links
	//
	var links = container.getElementsByTagName('a');
	bindScrollLinks(links);
	
	
	// Prepare links to scroll back to top, or wherever
	//
	var top_links = $$('a.' + top_class);
	bindScrollLinks(top_links);
}

function bindScrollLinks(collection) {
	for(var i=0; i < collection.length; i++) {
		collection[i].destination = collection[i].getAttribute('href').split('#')[1];
		collection[i].onclick = function() {
			new Effect.ScrollTo(this.destination);
			return false;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//
	//
	//addLoadEvent()
	//
	//
	//
function addLoadEvent(func) {
	var oldonload = window.onload;
	if(typeof window.onload != 'function') {
		window.onload = func;
	}else{
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//call functions on page load with addLoadEvent
	//
addLoadEvent(function(){
	prepareLinks();
	initPageScroll('mainNav', 'to_top');
	ajaxifyForm('contactForm', 'contactForm.php', 'submitBtn', 'Sending...');
});