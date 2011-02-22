(function ($) {
  // build the tier
  $.fn.cake = function(method) {
    
    var methods = {
      init: function (options) {
        var returnval = this.each(function(options) {
          var settings = {
            level: 1,
            state: 'closed'
          }
          $.extend(settings, options);
          var $this = $(this),
              data = $this.data('cake');

          if(!data) {
            $this.bind('click.cake', methods.toggle);
            
            $this.data('cake', {level:settings.level, state:settings.state});
            alert('set level to ' + $this.data('cake').level);
          }
          
        });
        alert('after init, state is: ' + this.data('cake').state);
        alert('after init, level is: ' + this.data('cake').level);
      },
      // $(this) because it is a response to a js event
      toggle: function() {
        // assuming only calling on one
        alert('before toggle, id is: ' + $(this).attr('id'));
        alert('before toggle, state is: ' + $(this).data('cake').state);
        alert('before toggle, level is: ' + $(this).data('cake').level);
        if($(this).data('cake').state == 'open') {
          $(this).cake('close');
        } else {
          $(this).cake('open');
        }
      },
      open: function () {
        alert('start open');
        // close all other tiers
        $(".tier").not(this).cake('close');
        
        // widen tier
        this.animate({width:'1000px'}, 500);
        // widen icing above
        this.prev().animate({width:'1000px'}, 500);
        // widen icing below
        this.next().animate({width:'1000px'}, 500);
        
        // set open data
        this.data('cake', {state:'open'});
        alert('after open, state is: ' + this.data('cake').state);
        alert('after open, level is: ' + this.data('cake').level);
        this.data('cake', {level:100});
        alert('after setting level, state is: ' + this.data('cake').state);
        alert('after setting level, level is: ' + this.data('cake').level);
        alert(this);
        
      },
      close: function() {
        // TODO bail if no cake data because i'm just testing on one right now
        if(!this.data('cake')) return;
        
        alert(this.data('cake'));
        var thiswidth = 160 + this.data('cake').level*40;
        var nextwidth = thiswidth + 40;
        // shrink tier
        this.animate({width:"" + thiswidth + "px"});
        // shrink icing above
        this.animate({width:"" + thiswidth + "px"});
        
        // set close data
        this.data('cake', {state:'closed'});
        
      }
    }
    
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
