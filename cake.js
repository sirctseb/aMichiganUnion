(function ($) {
  // build the tier
  $.fn.cake = function(method) {
    
    var methods = {
      init: function (options) {
      	
      	// tiers in the same call get sequential levels
      	var level = 1;
      	
        var returnval = this.each(function() {
          // default settings
          var settings = {
            level: level,
            state: 'closed'
          }
          // supplement with supplied settings
          $.extend(settings, options);
          
          var $this = $(this),
              data = $this.data('cake');

          if(!data) {
            $this.bind('click.cake', methods.toggle);
            
			// add level and open/close state to body section of cake
            $this.data('cake', {level:settings.level, state:settings.state});
          }
          
          // increment level
          level = level + 1;
          
          // subscribe to tier-resizing events
          $.subscribe('tier-resize', function(tier) {
          	// if the tier is open, call open again so it resizes correctly
          	if(tier.data('cake').state == 'open') {
          		tier.cake('open');
          	}
          });
          
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
      	$(".tier").clearQueue();
        // close all other tiers
        $(".tier").not(this).cake('close');
        // hide label
		this.find('.tierlabel').hide();
        // widen tier
        this.animate(
		{width:'1000px', height:'' + this.find(".tiercontent").height() + 'px'},
		{
			duration: 500,
			// show contents once open
			complete: function(){
				$(this).find(".tiercontent").fadeIn();
			},
			queue:true
		});
        // widen icing above
        this.prev().animate({width:'1000px'}, {
			duration: 500,
			queue: true
		});
        // widen icing below
        this.next().animate({width:'1000px'}, {
			duration: 500,
			queue: true
		});
        
        // set open data
        $.extend(this.data('cake'),{state:'open'});
        
      },
      close: function() {
	  	return this.each(
	  	function() {
			$this = $(this);
			$this.clearQueue();
			if ($this.data('cake').state == 'closed') 
				return;
			var thiswidth = 160 + $this.data('cake').level * 40;
			var nextwidth = thiswidth + 40;
			$this.find(".tiercontent").fadeOut();
			$this.find(".tierlabel").show();
			// shrink tier
			$this.animate({
				width: "" + thiswidth + "px",
				height: "100px"
			},{duration:500, queue:true});
			// shrink icing above
			$this.prev().animate({
				width: "" + thiswidth + "px"
			}, {duration:500, queue:true});
			// shrink icing below
			$this.next().animate({
				width: "" + nextwidth + "px"
			}, {duration:500, queue:true});
			
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
