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

	// get madlib data
	$.getJSON("http://localhost:8085/loadAll?jsoncallback=?", function(data) {
		if(data.status == "success") {
			
			//for(var model in data.models) {
			$.each(data.models, function(index, model) {
				// build accordion semantics
				// put in header
				$("<h3><a href='#'>" + model.name + "</a></h3>").appendTo($("#madlibaccordion"));
				// put in body
				$("<div id='madlibwrapper" + index + "'><div class='madlib' id='madlib" + index + "'></div></div>").appendTo($("#madlibaccordion"));
				
				// build madlib in new body
				$("#madlib" + index).madlib(model);
				
				var buildSubList = function(subdata, modelkey) {
					// put headers in
					$("<div><div class='subproperty subdate clearleft'>Date</div>" +
							"<div class='subproperty sublikes'>Likes</div>" +
							"<div class='subproperty subdislikes'>Dislikes</div>" + 
							"<div class='subproperty subname'>Name</div></div>")
							.appendTo("#madlibwrapper" + modelkey);
					
					for(var submission in subdata.submissions) {
						// build submission list
						$("<div><span class='subproperty subdate clearleft'>" + subdata.submissions[submission].date +"</span>"+
								"<span class='subproperty sublikes'>" + subdata.submissions[submission].likes + "</span>" +
								"<span class='subproperty subdislikes'>" + subdata.submissions[submission].dislikes + "</span>" +
								"<span class='subproperty subname'>" + subdata.submissions[submission].username + "</span></div>")
								.appendTo($("#madlibwrapper" + modelkey));
					}
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
								//$("#madlibwrapper" + index).append("shutup");
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