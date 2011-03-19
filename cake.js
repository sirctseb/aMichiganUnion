(function ($) {
  // build the tier
  $.fn.cake = function(method) {
    
    var methods = {
      init: function (options) {
        var returnval = this.each(function() {
          var settings = {
            level: 1,
            state: 'closed'
          }
          $.extend(settings, options);
          var $this = $(this),
              data = $this.data('cake');

          if(!data) {
            $this.bind('click.cake', methods.toggle);
            
			// add level and open/close state to body section of cake
            $this.data('cake', {level:settings.level, state:settings.state});
          }
          
        });
      },
      // $(this) because it is a response to a js event
      toggle: function() {
        // assuming only calling on one
        if($(this).data('cake').state == 'open') {
          $(this).cake('close');
        } else {
          $(this).cake('open');
        }
      },
      open: function () {
        // close all other tiers
        $(".tier").not(this).cake('close');
        // hide label
		this.children('.tierlabel').hide();
        // widen tier
        this.animate(
		{width:'1000px', height:'' + this.children(".tiercontent").height() + 'px'},
		{
			duration: 500,
			// show contents once open
			complete: function(){
				$(this).children(".tiercontent").fadeIn();
			}
		});
        // widen icing above
        this.prev().animate({width:'1000px'}, 500);
        // widen icing below
        this.next().animate({width:'1000px'}, 500);
        
        // set open data
        $.extend(this.data('cake'),{state:'open'});
        
      },
      close: function() {
	  	return this.each(
	  	function() {
			$this = $(this);
			if ($this.data('cake').state == 'closed') 
				return;
			var thiswidth = 160 + $this.data('cake').level * 40;
			var nextwidth = thiswidth + 40;
			$this.children(".tiercontent").fadeOut();
			$this.children(".tierlabel").show();
			// shrink tier
			$this.animate({
				width: "" + thiswidth + "px",
				height: "100px"
			});
			// shrink icing above
			$this.prev().animate({
				width: "" + thiswidth + "px"
			});
			// shrink icing below
			$this.next().animate({
				width: "" + nextwidth + "px"
			});
			
			// set close data
			$.extend($this.data('cake'), {
				state: 'closed'
			});
		});
        
      }
    };
    
    if(methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if(typeof method == 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.cake');
    }
    

    
    return this;
  };

}) (jQuery);
