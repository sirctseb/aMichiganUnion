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
				/*this.css({
					color : "#000000"
				});*/
				this.find('.madlibtext').css({color : "#000"});

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
				
				// add paragraph for text
				this.append($("<p class='madlibcontents'></p>"));
				// get reference to paragraph
				var text = this.children('p');

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
						text.append($('<input class="entry pos" type="text" entryno="' + components[component].split("|")[1] + '" placeholder="' + components[component].split("|")[2] + '" />)'));
					} else if(refexp.test(components[component])) {
						// add reference field
						text.append($('<input class="entry ref" type="text" refno="' + components[component].split("|")[1] + '" />)'));
					} else {
						// append normal text
						text.append($("<span class='madlibtext'>" + components[component] + "</span>"));
					}
				}

				// separate button - will probably change when we make this prettier
				//this.append($('<br />'));

				// so we can refer to this in event handlers
				var $this = this;

				// make button and bind to resolve method
				$('<div class="go-div"><input class="go-button" type="button" value="go" /></div>').bind('click.madlib', function() {$this.madlib('resolve');}).appendTo(this);
				
				// TODO separation between sections
				
				this.append($('<br />'));

				// make name field that people can fill if they want
				$('<p class="save-paragraph">Save it so other people can see:<br />' +
				'<span class="indent"">Your name (optional): <input class="username-input" type="text" name="username" placeholder="Anonymous" /></span>' +
				'</p>').appendTo(this);
				
				$('<input type="button" value="submit" />').bind('click.madlib', function() {$this.madlib('submit');}).appendTo(this.find('.save-paragraph'));
				// make submit button and bind to submit method
			},
			submit : function() {
				// check that we know where to submit to
				if(this.data('madlib').name) {

					// get array of entries
					var entries = [];
					this.find(".pos").each(function() {
						entries.push($(this).val());
					});
					//alert(this.children(':input[name="username"]').val());
					// submit to database
					$.getJSON("http://localhost:8085/submit?jsoncallback=?", {
						name : this.data('madlib').name,
						entries : entries,
						username : this.find(':input[name="username"]').val()
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
			},
			fill : function(entries) {
				// fill entry fields with supplied entries and then
				// call resolve to fill refs and show text if it's not shown already
				$(".pos").each(function(index, element) {
					$(this).val(entries[parseInt($(this).attr("entryno")) - 1]);
				});
				this.madlib('resolve');
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
