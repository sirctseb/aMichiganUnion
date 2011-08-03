// TODO put somewhere better
$.replace = function(string, obj) {
	$.each(obj,
		function(index, item) {
		 string = string.replace(index,item);
		}
	);
	return string;
}

// TODO put somewhere better
// TODO actually, use modernizr
supports_placeholder = function() {
	return 'placeholder' in document.createElement('input');
}

// global domain variable because I don't know how to do it better
debug = false;
if(debug) {
	domain = "localhost:8085";
} else {
	domain = "amichiganunion.appspot.com";
}

function init() {
	$("#slider").nivoSlider({
		manualAdvance : true,
		keyboardNav : true,
		animSpeed : 100,
		effect : 'fade',
		controlNav : false
	});
	$(".tier").cake();

	$(".tiercontent").click(function(event) {event.stopPropagation();
	});
	var test = "This is a test ~(pos|1|verb|)~ and a second test ~(pos|2|adjective|)~ and now we test the last thing ~(ref|2|)~";
	//$(".madlib").madlib({description:test});
	/*$(".madlib").madlib({
		name : "Save The Date"
	});*/

	// TODO testing live
	// NOTE works
	//$('.madlib').live('mouseover', function() { alert('omg');});

	// when the number of likes changes, push number of likes into ui
	$.subscribe('likeschanged', function(data) {
		// push likes from data to title of each madlib
		$('.madlib').each(function(index, element) {
			var $madlib = $(element);
			// get title h3
			//var $title = $madlib.closest("h3");
			var $title = $madlib.parent().prev();
			// set likes in title
			$title.find('.madliblikes').text($madlib.data('madlib').likes);
			// set dislikes in title
			$title.find('.madlibdislikes').text($madlib.data('madlib').dislikes);
		});
	});

	// do work when a madlib is reset
	$.subscribe('madlib.reset', function(madlib) {
		madlib.parent() // go to madlibwrapper
			.find('.active-submission') // find any active submission
			.removeClass('active-submission'); // remove active class
	});

	// TODO this should probably go into a plugin of its own or something
	// TODO just put this in madlib plugin
	// get madlib data
	$.getJSON("http://" + domain + "/loadAll?jsoncallback=?", function(data) {
		if(data.status == "success") {
			
			//for(var model in data.models) {
			$.each(data.models, function(index, model) {
				// build accordion semantics
				// put in header
				var headerString =
				"<h3><a href='#'>modelname" +
				//"<span class='madliblikessection'><span title='Click to like' class='madliblikeslabel'>Like</span> (<span class='madliblikes'>modellikes</span>)</span>" +
				//"<span class='madliblikeslabel'>Dislikes:<span class='madlibdislikes'>modeldislikes</span></span>" +  
				 "</a>" + 
				 "</h3>";
				// replace with values
				var filledString = $.replace(headerString, {"modelname": model.name, "modellikes": model.likes, "modeldislikes": model.dislikes});
				// add to accordion
				$(filledString).appendTo($("#madlibaccordion"));
				
				// put in body
				// TODO replace values like above
				$("<div class='madlibwrapper' id='madlibwrapper" + index + "'>" + 
					"<div class='madlib' id='madlib" + index + "'></div>" +
					"</div>").appendTo($("#madlibaccordion"));
				/*$("<span class='madliblikes'>" + model.likes + "</span>" +
					"<span class='madlibdislikes'>" + model.dislikes + "</span>").appendTo($("#madlibwrapper" + index));*/
				
				// build madlib in new body
				$("#madlib" + index).madlib(model);
				
				// TODO jqueryui tabs for top vs. newest submissions
				
				// put in submissions div
				var $sublist = $("<div class='submissionslist' id='submissions" + index + "'>" +
								"</div>")
								.appendTo($("#madlibwrapper" + index))
								.before($("<div>See other people's entries (spoiler alert!):</div>"));
								//.appendTo('body');
								
				// build tabs semantics
				var tabtitletemplate = "<li><a href='#tabhref'>tabtitle</a></li>";
				var tabcontenttemplate = "<div id='tabhref'><p class='tab-content'>tabcontent</p></div>";
				
				// add ul and titles
				var $subtabul = $("<ul></ul>").appendTo($sublist);
				$($.replace(tabtitletemplate, {'tabhref': 'newsubs' + index, 'tabtitle': 'New'})).appendTo($subtabul);
				$($.replace(tabtitletemplate, {'tabhref': 'topsubs' + index, 'tabtitle': 'Top'})).appendTo($subtabul);
				
				// add content elements
				$($.replace(tabcontenttemplate, {'tabhref': 'newsubs' + index, 'tabcontent': ''})).insertAfter($subtabul)
					.after($($.replace(tabcontenttemplate, {'tabhref': 'topsubs' + index, 'tabcontent': ''})));
				
				var buildSubList = function(subdata, modelkey) {
					// put headers in
					$("<div>" + 
							"<div class='subproptitle subproperty subname clearleft'>Name</div>" +
							"<div class='subproptitle subproperty sublikes'>Likes</div>" +
							//"<div class='subproptitle subproperty subdislikes'>Dislikes</div>" +
							"<div class='subproptitle subproperty subdate'>Date</div>" +
							"</div>")
							//.appendTo($sublist);
							.appendTo($('#' + subdata.href + modelkey + ' p'));
							//;
					
					// wrapper for everything but headers
					var $entrylist =  $("<div class='entry-list'></div>").appendTo($('#' + subdata.href + modelkey + ' p'));
					
					$.each(subdata.submissions, function(subindex, submission) {
						// build submission list
						$("<div class='submission clearleft'>" + // id='submission-" + modelkey + "-" + subindex + "'>" +
								"<span class='subproperty subname'>" + submission.username + "</span>" +
								"<span title='Click to like' class='subproperty sublikes'>" + submission.likes + "</span>" +
								//"<span class='subproperty subdislikes'>" + submission.dislikes + "</span>" +
								"<span class='subproperty subdate'>" + submission.date + "</span>"+
								"<span title='Click to like' class='sublikelink'>Like</span>" +
								"<span class='subkey'>" + submission.key + "</span>" +
								"</div>")
								//.appendTo($sublist);
								//.appendTo($('#' + subdata.href + modelkey + ' p'));
								.appendTo($entrylist)
								
								.data('madlib', submission.entries)
								.click( function(event) {
									
									// call fill() on the madlib
									$(this).closest('.madlibwrapper').children('.madlib').madlib('fill', $(this).data('madlib'));
									
									// remove active class from other submissions
									$(this).siblings('.active-submission').removeClass('active-submission');
									
									// add active class to submission
									$(this).addClass('active-submission');

									// publish submit event
									//$.publish('madlib.fillsubmit', [$('#madlib' + index)]);
								});
					});
				}

				// load new and top submissions
				$.getJSON("http://" + domain + "/newTopSubmissions?jsoncallback=?",
							{name: model.name},
							// put data into lists and build tab widget
							function(subdata) {
								buildSubList($.extend({}, subdata.newSubmissions, {'href': 'newsubs'}), index);
								buildSubList($.extend({}, subdata.topSubmissions, {'href': 'topsubs'}), index);
								
								// build tabs
								// TODO this could actually go before the data load
								$('#submissions' + index).tabs();
								
								// add like handlers to submission likes
								//$('#submissions' + index + ' .sublikes:not(.subproptitle)').click(function(event) {
								$('#submissions' + index + ' .sublikelink').click(function(event) {
									
									// submission count field for the handler to refer to
									var $submission_count = $(this).siblings('.sublikes');
									
									// load submission
									$.getJSON('http://' + domain + '/likeSub?jsoncallback=?',
												{key:$(this).siblings('.subkey').text()},
												function(data) {
													//  handle
													if(data.status === "success") {
														$submission_count.text(data.count);
													}
												});
									return false;
								});
							});
				});
			
			// initialize accordion
			$("#madlibaccordion").accordion({autoHeight:false,
											header: "h3",
											collapsible: true,
											change: function(event, ui) {
															$.publish("tier-resize", [$('.madlibtier')]);
														}
											});
			// add plugin-based placeholders if not supported in browser
			if(!supports_placeholder()) {
				$('.pos').placeholderEnhanced();
			}
		} else {
			// $.publish("fail: could not load madlibs");
		}
		
		// TODO i would rather have done this with live, but it wouldn't work
		// set up handlers for like buttons
		$('.madliblikessection').bind('click', function() {
			$(this).closest('h3')			// go up to the h3 header
					.next()					// go to madlibwrapper next to title
					.children('.madlib')	// get actual madlib
					.first().madlib('like', {like: true});	// call like method
		});
	});
}