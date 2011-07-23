(function($) {
	// build the tier
	$.fn.madlib = function(method) {

		var methods = {
			init : function(options) {

				var returnval = this.each(function() {

					// default settings
					/*var settings = {
					level: level,
					state: 'closed'
					}*/
					// supplement with supplied settings
					//$.extend(settings, options);

					var $this = $(this), data = $this.data('madlib');

					if(!data) {
						//$this.bind('click.cake', methods.toggle);

						// add level and open/close state to body section of cake
						//$this.data('cake', {level:settings.level, state:settings.state});
						$this.data('madlib', {
							init : true
						});

						if(options.name) {
							$.getJSON("http://localhost:8085/load?jsoncallback=?", {
								name : options.name
							}, function(data) {
								if(data.status == "success") {
									$this.madlib("build", data.model.contents);
									//$.publish("madlibLoaded", [data.name]);
								} else {
									// TODO i don't think jquery 1.5 likes empty each
									//$.publish("loadFailedNotFound");
								}
							});
						} else if(options.description) {
							$this.madlib("build", options.description);
						}
					}

				});
			},
			// $(this) because it is a response to a js event
			resolve : function() {
				// call $this the madlib
				$this = $(this).parent();
				
				// TODO animate
				// show regular text
				$this.css({
					color : "#000000"
				});
				
				// fill reference fields with contents of referant inputs
				$this.find(".ref").each(function filltext() {
					$(this).val($(this).siblings('[entryno="' + $(this).attr("refno") + '"]').val());
				});
				
				// modify css of entry fields
				$this.find(".entry").addClass("entryfilled");
			},
			build : function(description) {
				
				$this = this;
				
				// add madlib class in case it doesn't have it yet
				$this.addClass("madlib");
				
				// regex for identifying references
				var refexp = /\(ref\|\d+\|\)/g;
				// regex for identifying input fields
				var posexp = /\(pos\|\d+\|[A-z]+\|\)/g;
				
				// split string on tilde character
				var components = description.split("~");
				
				// check each section for references or input field markers
				for(var component in components) {
					
					if(posexp.test(components[component])) {
						// add input field
						$this.append($('<input class="entry" type="text" entryno="' + components[component].split("|")[1] + '" placeholder="' + components[component].split("|")[2] + '" />)'));
					} else if(refexp.test(components[component])) {
						// add reference field
						$this.append($('<input class="entry ref" type="text" refno="' + components[component].split("|")[1] + '" />)'));
					} else {
						// append normal text
						$this.append(components[component]);
					}
				}
				
				// separate button - will probably change when we make this prettier
				$this.append($('<br />'));
				
				// make button and bind to resolve method
				$('<input type="button" value="go" />').bind('click.madlib', methods.resolve).appendTo($this);
			}
		};

		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if( typeof method == 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.cake');
		}

		return this;
	};
})(jQuery);
