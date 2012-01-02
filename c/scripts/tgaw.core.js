/**
 * Core Javascript behavior for tylergaw.com
 * author: Tyler Gaw <me@tylergaw.com>
 *
 *
 * jQuery plugins used:
			scrollTo: http://plugins.jquery.com/project/ScrollTo
			easing:   http://gsgd.co.uk/sandbox/jquery/easing
 *
 */
(function ($) {
		
	var TGAW = {
		
		init: function ()
		{			
			this.utils.externalLinks();
			this.globals.funBag();
			this.globals.pageScroll();
			this.contact.initForm();
			this.contact.incrementEmailCount();
			this.globals.getTwitterStatus();
			this.globals.getLastFmTracks();
			this.globals.getFlickrPhotos();
		},
		
		
		// For IE6 we turn off all added JS functionality and display a warning banner
		//
		initIE6: function ()
		{
			$('body').append("<div id='ie6message'>Sorry. You aren't seeing this site in all it's glory. Internet Explorer 6 is not supported, 'cause it's older than dirt.</div>");
		},
		
		
		// Application Global Methods and properties
		//
		globals: {
			
			getTwitterStatus: function ()
			{
				$('#content-twitter blockquote').bind('loaded', function () {
					$('#content-twitter p.loading').remove();
				});
				
				$('#content-twitter blockquote').tweet({username: 'thegaw', count: 1});
			},
			
			getLastFmTracks: function ()
			{
				$('#content-lastfm ul').lastFM({
					username: 'tylergaw',
					apikey: '942a9b7c6915830090efcfbd91664332',
					number: 3,
					artSize: 'small',
					noart: '/c/images/lastfm_defaultCover.jpg',
					onComplete: function(){}
				});
			},h
			
			getFlickrPhotos: function ()
			{
				$('#content-flickr ul').jflickrfeed({
					limit: 6,
					qstrings: {
						id: '22786735@N04'
					},
					itemTemplate: '<li><a class="thickbox" rel="gallery-flickr" href="{{image_b}}"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
				}, function () {
					$('#content-flickr p.loading').remove();
				});
				
				/*
				<li>
					<a class='thickbox' rel='gallery-flickr' href='http://farm6.static.flickr.com/5177/5534988683_0cfa1cd19d_b.jpg' title='&lt;a href="http://www.flickr.com/photos/tylergaw/5534988683/sizes/l/"&gt;http://www.flickr.com/photos/tylergaw/5534988683/sizes/l/&lt;/a&gt;'>
						<img src='http://farm6.static.flickr.com/5177/5534988683_0cfa1cd19d_s.jpg' alt='' />
					</a>
				</li>
				*/
			},
			
			// The 'to top' button at the bottom of each page
			//
			pageScroll: function ()
			{
				$('#to-summit-link').click(
					function ()
					{
						$.scrollTo('#navigation-main', 1000, {easing: 'easeOutElastic'});
						return false;
					}
				);
			},
			
			
			// I'm adding a few extra elements to the DOM here, just for funzees
			//
			funBag: function ()
			{
				$('body').append("<span id='funbag-monitor'></span>");
				$('#layout-header h1').append("<span id='funbag-birds'></span>");
				$('#layout-header').append("<span id='funbag-boat'></span><span id='funbag-fish'></span>");
			}	
		},
		
		
		// Contact page specific methods and properties
		//
		contact: {
			
			initForm: function ()
			{
				var alreadyFocused = false;
				$('#fieldset-contact input[type=text], #fieldset-contact textarea').focus(function () {
					if (!alreadyFocused) {
						alreadyFocused = true;
						alert("I decided to disable this form. If you want to get in touch please use my email address above. Thanks!");
						$(this).blur();
					}
				});
				
				$('#form-contact').submit(function (e) {
					e.preventDefault();
					alert("This form is disabled. Please use my email address above.");
				});
				
				//TGAW.utils.ajaxForm('#form-contact', 'contact/index', '#submit');
			},
			
			incrementEmailCount: function ()
			{
				setInterval(
					function () {
						var curVal = parseInt($("#contact-i-check-my-email-a-lot").html(), 10);
						curVal = curVal + 1;
						$("#contact-i-check-my-email-a-lot").html(curVal);
					}, 5000);
			}
		},
		
		
		// Utility methods that can be used any number of times
		//
		utils: {
			
			// For links with a rel attr of 'external' open in a new window
			//
			externalLinks: function ()
			{
				$("a[rel='external']").live('click',
					function ()
					{
						window.open($(this).attr('href'));
						return false;
					}
				);
			},
			
			
			// Ajaxify a basic form
			// - @param selector - a valid jquery selector $('selector')
			// - @param requestUrl - the url of the request
			//
			ajaxForm: function (selector, requestUrl, sendingIndicator)
			{
				var $this = this, 
				formParent = $(selector).parent();

				$(selector).submit(
					function ()
					{
						var form = $(this).get(0), 
						query = "", i;
						
						for (i = 0; i < form.elements.length; i += 1) {
							query += form.elements[i].name;
							query += "=";
							query += escape(form.elements[i].value);
							query += "&";
						}

						jQuery.ajax({
							type: "POST",
							url: requestUrl,
							data: query,
							success: function (msg)
							{
								formParent.html(msg);
								$this.ajaxForm(selector, requestUrl, sendingIndicator);
							}
						});

						return false;
					}
				);
			}
		}
	};
	
	// Initializing Function
	//
	$(function () {
		if (document.all && !window.opera && !window.XMLHttpRequest)
		{
			TGAW.initIE6();
		}
		else
		{
			TGAW.init();
		}
	});
}(jQuery));