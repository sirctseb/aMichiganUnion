(function ($) {
  // build the tier
  $.fn.madlib = function(method) {
    
    var methods = {
      init: function (options) {
      	
        var returnval = this.each(function() {
        	
          // default settings
          /*var settings = {
            level: level,
            state: 'closed'
          }*/
          // supplement with supplied settings
          //$.extend(settings, options);
          
          var $this = $(this),
              data = $this.data('madlib');

          if(!data) {
            //$this.bind('click.cake', methods.toggle);
            
			// add level and open/close state to body section of cake
            //$this.data('cake', {level:settings.level, state:settings.state});
            $this.data('madlib', {init:true});
            
            var refexp = /\(ref\|\d+\|\)/g;
            var posexp = /\(pos\|\d+\|[A-z]+\|\)/g;
            var components = options.description.split("~");
            for(var component in components) {
            	if (posexp.test(components[component])) {
            		$this.append($('<input class="entry" type="text" entryno="' + 
            						components[component].split("|")[1] +
            						'" placeholder="' +
            						components[component].split("|")[2] +
            						'" />)'));
            	} else if (refexp.test(components[component])) {
            		$this.append($('<input class="entry ref" type="text" refno="' + 
            						components[component].split("|")[1] +
            						'" />)'));
            	} else {
            		$this.append(components[component]);
            	}
             } 
             $this.append($('<br />'));
             $('<input type="button" value="go" />').bind('click.madlib', methods.resolve).appendTo($this);
          }
          
        });
      },
      // $(this) because it is a response to a js event
      resolve: function() {
      		// call $this the madlib
      		$this = $(this).parent();
        	// TODO animate
			$this.css({color: "#000000"});
			$this.find(".entry").addClass("entryfilled");
			$this.find(".ref").each(
				function filltext() {
					$(this).val(
						$(this).siblings('[entryno="' + $(this).attr("refno") + '"]').val()
					);
				}
			)
		},
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
