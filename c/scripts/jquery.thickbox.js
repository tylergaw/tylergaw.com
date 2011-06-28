/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/


/**
 * 		!!!!!! READ ME !!!!!!!!
 *
 *       This Thickbox script has been modifed for use on www.tylergaw.com
 *
 */

		  
var tb_pathToImage = "/c/images/thickbox_loading_clock.gif";


/**
 * on page load call tb_init
 *
 */
$(document).ready(
	function()
	{   
		/** 
		 * Kinda lame browser sniffing, 
		 * but I don't even want IE 6 to have this at all
		 */
		if (document.all && !window.opera && !window.XMLHttpRequest){}
		else
		{
			tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox
			imgLoader = new Image();// preload image
			imgLoader.src = tb_pathToImage;
		}
	}
);


/**
 * add thickbox to href & area elements that have a class of .thickbox
 *
 */
function tb_init(domChunk)
{
	$(domChunk).live('click',
		function()
		{
			var t = this.title || this.name || null;
			var a = this.href || this.alt;
			var g = this.rel || false;
			tb_show(t, a, g);
			this.blur();
			return false;
		}
	);
}

/**
 * function called when the user clicks on a thickbox link
 *
 * @param string caption
 * @param string url
 * @param string imageGroup
 * @param bool isGallery - A flag to determine if we are opening the next/prev item in a group
 *
 */
function tb_show(caption, url, imageGroup, isGallery) 
{
	try 
	{
		//if IE 6
		if (typeof document.body.style.maxHeight === "undefined") 
		{
			$("body","html").css({height: "100%", width: "100%"});
			$("html").css("overflow","hidden");
			
			//iframe to hide select elements in ie6
			if (document.getElementById("TB_HideSelect") === null) 
			{ 
				$("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}
		else
		{
			if(document.getElementById("TB_overlay") === null)
			{
				$("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
				$("#TB_overlay").click(tb_remove);
			}
		}
		
		if(tb_detectMacXFF())
		{
			//use png overlay so hide flash
			$("#TB_overlay").addClass("TB_overlayMacFFBGHack"); 
		}
		else
		{
			//use background and opacity
			$("#TB_overlay").addClass("TB_overlayBG"); 
		}
		
		if(caption === null)
		{
			caption="";
		}
		
		//add loader to the page and show it
		$("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>"); 
		$('#TB_load').show();
		
		
		//if there is a query string involved
		var baseURL;
	   	if(url.indexOf("?")!==-1)
		{ 
			baseURL = url.substr(0, url.indexOf("?"));
	   	}
		else
		{ 
	   		baseURL = url;
	   	}
	   
	   	var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	   	var urlType = baseURL.toLowerCase().match(urlString);
	
		//code to show images
		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp')
		{
				
			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;
			
			if(imageGroup)
			{
				TB_TempArray = $("a[rel="+imageGroup+"]").get();
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) 
				{
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
					
					if (!(TB_TempArray[TB_Counter].href == url)) 
					{						
						if (TB_FoundURL) 
						{
							TB_NextCaption = TB_TempArray[TB_Counter].title;
							TB_NextURL 	   = TB_TempArray[TB_Counter].href;
							TB_NextHTML    = "<a href='#next' class='TB_shuttleButton' id='TB_next'><span>Next</span></a>";
						} 
						else 
						{
							TB_PrevCaption = TB_TempArray[TB_Counter].title;
							TB_PrevURL     = TB_TempArray[TB_Counter].href;
							TB_PrevHTML    = "<a href='#prev' class='TB_shuttleButton' id='TB_prev'><span>Prev</span></a>";
						}
					} 
					else 
					{
						TB_FoundURL = true;
						TB_imageCount = (TB_Counter + 1) +" of "+ (TB_TempArray.length);										
					}
				}
			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){		
			imgPreloader.onload = null;
				
			// Resizing large images - orginal by Christian Montoya edited by me.
			var pagesize = tb_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth); 
				imageWidth = x; 
				if (imageHeight > y) { 
					imageWidth = imageWidth * (y / imageHeight); 
					imageHeight = y; 
				}
			} else if (imageHeight > y) { 
				imageWidth = imageWidth * (y / imageHeight); 
				imageHeight = y; 
				if (imageWidth > x) { 
					imageHeight = imageHeight * (x / imageWidth); 
					imageWidth = x;
				}
			}
			// End Resizing
			
			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			
			/**
			 * The html that builds the window:
			 *		<div id='TB_innerHolder'>
			 *			<a id='TB_closeWindow' href='#'>Close</a>
			 *			<div id='TB_header'></div>
			 *			<div id='TB_ImageHolder'>
			 * 				<a href=''>
			 *					<img id='TB_ImageOff' src='image.jpg' />
			 *				</a>
			 *				<a class='TB_shuttleButton' id='TB_prev' href='#'><span>Prev</span></a>
			 *				<a class='TB_shuttleButton' id='TB_next' href='#'><span>Next</span></a>
			 *      	</div>
			 *			<div id='TB_metadata'>
			 * 				<p id='TB_caption'>Caption Text</p>
			 *				<p id='TB_count'>1 of 5</p>
			 *			</div>
			 *      </div>
			 *		<div id='TB_footer'></div>
			 *
			 */
			var TB_windowHtml = "";
			TB_windowHtml += "<div id='TB_header'></div>";
			TB_windowHtml += "<div id='TB_innerHolder'>";
			TB_windowHtml += "<a id='TB_closeWindow' href='#close'>Close</a>";
			TB_windowHtml += "<div id='TB_ImageHolder'><a id='TB_ImageOff' href='#' title='Close'>";
			TB_windowHtml += "<img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>";
			TB_windowHtml += TB_PrevHTML + TB_NextHTML;
			TB_windowHtml += "</div>";
			TB_windowHtml += "<div id='TB_metadata'>";
			TB_windowHtml += "<p id='TB_caption'>" + caption + "</p>";
			TB_windowHtml += "<p id='TB_count'>" + TB_imageCount + "</p>";
			TB_windowHtml += "</div>";
			TB_windowHtml += "</div>";
			TB_windowHtml += "<div id='TB_footer'></div>";
			
			$("#TB_window").append(TB_windowHtml);
			$("#TB_closeWindow").click(tb_remove);
			
			
			if (!(TB_PrevHTML === "")) 
			{
				function goPrev(){
					if($(document).unbind("click", goPrev))
					{
						$(document).unbind("click",goPrev);
					}
					
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_PrevCaption, TB_PrevURL, imageGroup, true);
					return false;	
				}
				$("#TB_prev").click(goPrev);
			}
			
			if (!(TB_NextHTML === "")) {		
				function goNext()
				{
					$("#TB_window").remove();
					$("body").append("<div id='TB_window'></div>");
					tb_show(TB_NextCaption, TB_NextURL, imageGroup, true);				
					return false;	
				}
				$("#TB_next").click(goNext);
				
			}

			document.onkeydown = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				} else if(keycode == 190){ // display previous image
					if(!(TB_NextHTML == "")){
						document.onkeydown = "";
						goNext();
					}
				} else if(keycode == 188){ // display next image
					if(!(TB_PrevHTML == "")){
						document.onkeydown = "";
						goPrev();
					}
				}	
			};
			
			tb_position(isGallery);
			$("#TB_load").remove();
			$("#TB_ImageOff").click(tb_remove);
			$("#TB_window").css({display:"block"}); //for safari using css instead of show
			};
			
			imgPreloader.src = url;
		}else{//code to show html
			
			var queryString = url.replace(/^[^\?]+\??/,'');
			var params = tb_parseQuery( queryString );

			TB_WIDTH = (params['width']*1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
			TB_HEIGHT = (params['height']*1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;
			
			if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window		
					urlNoQuery = url.split('TB_');
					$("#TB_iframeContent").remove();
					if(params['modal'] != "true"){//iframe no modal
						$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindow' title='Close'>close</a> or Esc Key</div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
					}else{//iframe modal
					$("#TB_overlay").unbind();
						$("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
					}
			}else{// not an iframe, ajax
					if($("#TB_window").css("display") != "block"){
						if(params['modal'] != "true"){//ajax no modal
						$("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindow'>close</a> or Esc Key</div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
						}else{//ajax modal
						$("#TB_overlay").unbind();
						$("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");	
						}
					}else{//this means the window is already up, we are just loading new content via ajax
						$("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
						$("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
						$("#TB_ajaxContent")[0].scrollTop = 0;
						$("#TB_ajaxWindowTitle").html(caption);
					}
			}
					
			$("#TB_closeWindow").click(tb_remove);
			
				if(url.indexOf('TB_inline') != -1){	
					$("#TB_ajaxContent").append($('#' + params['inlineId']).children());
					$("#TB_window").unload(function () {
						$('#' + params['inlineId']).append( $("#TB_ajaxContent").children() ); // move elements back when you're finished
					});
					tb_position();
					$("#TB_load").remove();
					$("#TB_window").css({display:"block"}); 
				}else if(url.indexOf('TB_iframe') != -1){
					tb_position();
					if($.browser.safari){//safari needs help because it will not fire iframe onload
						$("#TB_load").remove();
						$("#TB_window").css({display:"block"});
					}
				}else{
					$("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
						tb_position();
						$("#TB_load").remove();
						tb_init("#TB_ajaxContent a.thickbox");
						$("#TB_window").css({display:"block"});
					});
				}
			
		}

		if(!params['modal']){
			document.onkeyup = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				}	
			};
		}
		
	} catch(e) {
		//nothing here
	}
}


//helper functions below
function tb_showIframe()
{
	$("#TB_load").remove();
	$("#TB_window").css({display:"block"});
}


function tb_remove() 
{
 	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindow").unbind("click");
	
	var endYPos = tb_getPageSize()[1];
	$("#TB_window").animate(
		{ 
			marginTop: endYPos + 'px'
		}, 
		{
			duration: 300,
			easing: 'easeInQuad',
			complete: function()
			{
				$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();
			}
		}
	);
	
	
	$("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		$("body","html").css({height: "auto", width: "auto"});
		$("html").css("overflow","");
	}
	document.onkeydown = "";
	document.onkeyup = "";
	return false;
}


function tb_position(isGallery) 
{
	var initYPos = '-' + parseInt((TB_HEIGHT * 2), 10);
	var endYPos  = '-' + parseInt((TB_HEIGHT / 2), 10);
	
	$("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
	if ( !(jQuery.browser.msie && jQuery.browser.version < 7)) 
	{ // take away IE6
		
		/**
		 * Start by positioning the window out of view if it is the first item opened
		 */
		if(!isGallery)
		{
			$("#TB_window").css({marginTop: initYPos + 'px'});
		
			/**
			 * Drop the window into the viewport
			 */
			$("#TB_window").animate(
				{ marginTop: endYPos + 'px'}, 
				{
					duration: 150,
					easing: 'easeOutQuad'
					//easing: 'easeOutElastic'
				});
		}
		else
		{
			$("#TB_window").css({marginTop: endYPos + 'px'});
			$("#TB_window").fadeIn('fast');
		}
		
	}
}

function tb_parseQuery ( query ) 
{
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}


function tb_getPageSize()
{
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}


function tb_detectMacXFF() 
{
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}