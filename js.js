function init() {
  $("#slider").nivoSlider({manualAdvance:true,
                                    keyboardNav:true,
                                    animSpeed:100,
                                    effect:'fade',
									controlNav:false});
  $("#tier1").cake({level:1});
  $("#tier2").cake({level:2});
  $("#tiern").cake({level:3});
  //$("#tier1").click(openpics);
  $(".tiercontent").click(function(event) {event.stopPropagation();});
}
