function init() {
  $("#slider").nivoSlider({manualAdvance:true,
                                    keyboardNav:true,
                                    animSpeed:100,
                                    effect:'fade'});
  $("#tier1").cake({level:1});
  $("#tier2").cake({level:2});
  $("#tiern").cake({level:3});
  //$("#tier1").click(openpics);
  $(".tiercontent").click(function(event) {event.stopPropagation();});
}

/*function openpics(tier1) {
  if($("#tier1").hasClass("bigtier")) {
    $("#slider").hide();
    $(".tier1").animate({
      width:"200px"
    }, 500);
    $("#tier1").animate({
      height:"100px"
    }, {duration:500, queue:false});
    $("#tier1 + .icing").animate({
      width:"240px"
    }, 500);
    $("#tier1").removeClass("bigtier");
  } else {
    // currently no style attached to .bigtier
    $("#tier1").addClass("bigtier");
    
    // show the pic slider
    $("#slider").show();
    
    // widen all tier1 stuff: icing and main tier
    $(".tier1").animate({
      width:"1000px"
    }, 500);
    // grow main tier tall
    $("#tier1").animate({
      height:'700px'
    }, {duration:500, queue:false});
    // widen next icing
    $("#tier1 + .icing").animate(
      {
        width:"1000px"
      }, 500);
  }
}*/