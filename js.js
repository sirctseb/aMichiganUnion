function init() {
  $("#slider").nivoSlider({manualAdvance:true,
                                    keyboardNav:true,
                                    animSpeed:100,
                                    effect:'fade',
									controlNav:false});
  $("#tier1").cake({level:1});
  $("#tier2").cake({level:2});
  $("#tier3").cake({level:3});
  $("#tier4").cake({level:4});
  //$("#tier1").click(openpics);
  $(".tiercontent").click(function(event) {event.stopPropagation();});
}
