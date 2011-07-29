// TODO put somewhere better
$.replace = function(string, obj) {
	$.each(obj,
		function(index, item) {
		 string = string.replace(index,item);
		}
	);
	return string;
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

	// TODO this should probably go into a plugin of its own or something
	// get madlib data
	$.getJSON("http://localhost:8085/loadAll?jsoncallback=?", function(data) {
		if(data.status == "success") {
			
			//for(var model in data.models) {
			$.each(data.models, function(index, model) {
				// build accordion semantics
				// put in header
				var headerString =
				"<h3><a href='#'>modelname" +
				"<span class='madliblikeslabel'>Likes:<span class='madliblikes'>modellikes</span></span>" +
				"<span class='madliblikeslabel'>Dislikes:<span class='madlibdislikes'>modeldislikes</span></span>" +  
				 "</a>" + 
				 "</h3>";
				// replace with values
				var filledString = $.replace(headerString, {"modelname": model.name, "modellikes": model.likes, "modeldislikes": model.dislikes});
				// add to accordion
				$(filledString).appendTo($("#madlibaccordion"));
				
				// put in body
				// TODO replace values like above
				$("<div id='madlibwrapper" + index + "'>" + 
					"<div class='madlib' id='madlib" + index + "'></div>" +
					"</div>").appendTo($("#madlibaccordion"));
				/*$("<span class='madliblikes'>" + model.likes + "</span>" +
					"<span class='madlibdislikes'>" + model.dislikes + "</span>").appendTo($("#madlibwrapper" + index));*/
				
				// build madlib in new body
				$("#madlib" + index).madlib(model);
				
				var buildSubList = function(subdata, modelkey) {
					// put headers in
					$("<div><div class='subproperty subdate clearleft'>Date</div>" +
							"<div class='subproperty sublikes'>Likes</div>" +
							"<div class='subproperty subdislikes'>Dislikes</div>" + 
							"<div class='subproperty subname'>Name</div></div>")
							.appendTo("#madlibwrapper" + modelkey);
					
					$.each(subdata.submissions, function(subindex, submission) {
						// build submission list
						$("<div><span class='subproperty subdate clearleft'>" + submission.date +"</span>"+
								"<span class='subproperty sublikes'>" + submission.likes + "</span>" +
								"<span class='subproperty subdislikes'>" + submission.dislikes + "</span>" +
								"<span class='subproperty subname'>" + submission.username + "</span></div>")
								.appendTo($("#madlibwrapper" + modelkey));
					});
				}

				// load top submissions
				/*$.getJSON("http://localhost:8085/topSubmissions?jsoncallback=?",
							{name: data.models[index].name},
							function(subdata) {
								//buildSubList(subdata, index);
							});*/
							
				//var localModel = index;
				// load new submissions
				$.getJSON("http://localhost:8085/newSubmissions?jsoncallback=?",
							{name: model.name},
							function(subdata) {
								buildSubList(subdata, index);
							});
				});
			
			// initialize accordion
			$("#madlibaccordion").accordion({autoHeight:false,
											header: "h3",
											change: function(event, ui) {
															//$(".madlibtier").css({height:$("#madlibaccordion").outerHeight()});
															$(".madlibtier").cake("open"); 
														}
											});
			
		} else {
			// $.publish("fail: could not load madlibs");
		}
		
		// TODO i would rather have done this with live, but it wouldn't work
		// set up handlers for like buttons
		$('.madliblikes').bind('click', function() {
			$(this).closest('h3')			// go up to the h3 header
					.next()					// go to madlibwrapper next to title
					.children('.madlib')	// get actual madlib
					//.siblings('.madlib')
					.first().madlib('like', {like: true});	// call like method
		});
		// set up handlers for dislike buttons
		$('.madlibdislikes').bind('click', function() {
			$(this).closest('h3')			// go up to the h3 header
					.next()					// go to madlibwrapper next to title
					.children('.madlib')	// get actual madlib
					//.siblings('.madlib')
					.madlib('like',{like: false});	// call like method
		});
	});
}

function resolve() {
	// TODO animate
	$(".madlib").css({
		color : "#000000"
	});
	$(".entry").addClass("entryfilled");
	$(".ref").each(function filltext() {
		$(this).val($('[entryno="' + $(this).attr("refno") + '"]').val());
	})
}