(function($) {

	$.fn.madlib = function(method) {

		var methods = {
			init : function(options) {

				var returnval = this.each(function() {

					var $this = $(this), data = $this.data('madlib');

					if(!data) {

						// mark initialized
						$this.data('madlib', {
							init : true
						});

						// if contents exists on options, it is a full model
						if(options.contents) {
							$this.madlib("build", options);
							
						// otherwise, it's just the name and we have to load it
						} else if(options.name) {
							$.getJSON("http://localhost:8085/load?jsoncallback=?", {
								name : options.name
							}, function(data) {
								if(data.status == "success") {
									$this.madlib("build", data.model);
									// TODO i don't think jquery 1.5 likes empty each
									//$.publish("madlibLoaded", [data.name]);
								} else {
									// TODO i don't think jquery 1.5 likes empty each
									//$.publish("loadFailedNotFound");
								}
							});
						}
					}

				});
			},
			// $(this) because it is a response to a js event
			resolve : function() {
				// call $this the madlib
				//$this = $(this).parent();

				// TODO animate
				// show regular text
				this.css({
					color : "#000000"
				});

				// fill reference fields with contents of referant inputs
				this.find(".ref").each(function filltext() {
					$(this).val($(this).siblings('[entryno="' + $(this).attr("refno") + '"]').val());
				});
				// modify css of entry fields
				this.find(".entry").addClass("entryfilled");
			},
			build : function(model) {
				//$this = this;

				// store name and likes / dislikes
				$.extend(this.data('madlib'), {
					name : model.name,
					likes : model.likes,
					dislikes : model.dislikes
				});

				// TODO likes / dislikes

				// add madlib class in case it doesn't have it yet
				this.addClass("madlib");

				// regex for identifying references
				var refexp = /\(ref\|\d+\|\)/g;
				// regex for identifying input fields
				//var posexp = /\(pos\|\d+\|[A-z]+\|\)/g;
				var posexp = /\(pos\|\d+\|[^|]+\|\)/g;

				// split string on tilde character
				var components = model.contents.split("~");

				// check each section for references or input field markers
				for(var component in components) {

					if(posexp.test(components[component])) {
						// add input field
						this.append($('<input class="entry pos" type="text" entryno="' + components[component].split("|")[1] + '" placeholder="' + components[component].split("|")[2] + '" />)'));
					} else if(refexp.test(components[component])) {
						// add reference field
						this.append($('<input class="entry ref" type="text" refno="' + components[component].split("|")[1] + '" />)'));
					} else {
						// append normal text
						this.append(components[component]);
					}
				}

				// separate button - will probably change when we make this prettier
				this.append($('<br />'));

				// so we can refer to this in event handlers
				var $this = this;

				// make button and bind to resolve method
				$('<input type="button" value="go" />').bind('click.madlib', function() {$this.madlib('resolve');}).appendTo(this);

				// make name field that people can fill if they want
				$('<input type="text" name="username" placeholder="Anonymous" />').appendTo(this);
				
				// make submit button and bind to submit method
				$('<input type="button" value="submit" />').bind('click.madlib', function() {$this.madlib('submit');}).appendTo(this);
			},
			submit : function() {
				// check that we know where to submit to
				if(this.data('madlib').name) {

					// get array of entries
					var entries = [];
					this.children(".pos").each(function() {
						entries.push($(this).val());
					});
					//alert(this.children(':input[name="username"]').val());
					// submit to database
					$.getJSON("http://localhost:8085/submit?jsoncallback=?", {
						name : this.data('madlib').name,
						entries : entries,
						username : this.children(':input[name="username"]').val()
					}, function(data) {
						if(data.success) {
							// TODO notify success
						} else {
							// TODO notify fail
						}
					});
				} else {
					// $.publish("error: no name on madlib");
				}
			},
			like : function(options) {
				var name = this.data("madlib").name;
				var $madlib = this;
				if(name) {
					$.getJSON("http://localhost:8085/like?jsoncallback=?",
						{name:name, like:options.like},
						function(data) {
							// TODO disable like button or something
							if(options.like) {
								$madlib.data('madlib').likes += 1;
							} else {
								$madlib.data('madlib').dislikes += 1;
							}
							$.publish('likeschanged', []);
						}
					)
				}
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
