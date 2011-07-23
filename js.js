function init() {
  $("#slider").nivoSlider({manualAdvance:true,
                                    keyboardNav:true,
                                    animSpeed:100,
                                    effect:'fade',
									controlNav:false});
  $(".tier").cake();
 
  $(".tiercontent").click(function(event) {event.stopPropagation();});	
  var test="This is a test ~(pos|1|verb|)~ and a second test ~(pos|2|adjective|)~ and now we test the last thing ~(ref|2|)~";
  //$(".madlib").madlib({description:test});
  $(".madlib").madlib({name:"test"});
}

function resolve() {
	// TODO animate
	$(".madlib").css({color: "#000000"});
	$(".entry").addClass("entryfilled");
	$(".ref").each(
		function filltext() {
			$(this).val(
				$('[entryno="' + $(this).attr("refno") + '"]').val()
			);
		}
	)	
}