function init() {
  $("#slider").nivoSlider({manualAdvance:true,
                                    keyboardNav:true,
                                    animSpeed:100,
                                    effect:'fade',
									controlNav:false});
  $(".tier").cake();
 
  $(".tiercontent").click(function(event) {event.stopPropagation();});
}
