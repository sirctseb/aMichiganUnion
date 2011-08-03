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
							$.getJSON("http://" + domain + "/load?jsoncallback=?", {
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
			// show the filled-in madlib
			resolve : function() {
				
				// show regular text
				this.find('.madlibtext').addClass('madlibtextfilled', 400);

				// fill reference fields with contents of referant inputs
				this.find(".ref").each(function filltext() {
					$(this).val($(this).siblings('[entryno="' + $(this).attr("refno") + '"]').val());
				});
				
				// modify css of entry fields
				this.find(".entry").addClass("entryfilled");
			},
			build : function(model) {

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
				
				// insert newlines
				model.contents = model.contents.replace(/~~/g, "<br />")

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
				
				//this.find('.ref').attr({tabindex: "-1"});
				this.find('.ref').attr('disabled', 'disabled');

				// so we can refer to this in event handlers
				var $this = this;

				// make wrapper for centering
				var $godiv = $('<p class="go-div"></p>').appendTo(this);
				
				// make button and bind to resolve method
				$('<input class="go-button" type="button" value="go" />')
					.bind('click.madlib',
						function() {
							
							// fill fields and show text
							$this.madlib('resolve');
							
							// show save options
							$this.find('.save-paragraph').slideDown(
								function() {
									// publish resize event
									$.publish('tier-resize', [$('.madlibtier')]);
								});
						})
					.appendTo($godiv);

				// make reset button
				$('<input class="reset-button" type="button" value="reset" />')
					.bind('click.madlib',
						function() {
							// remove filled style from entries
							$this.find('.entry').val("").removeClass('entryfilled');
							// make text invisible again
							$this.find('.madlibtext').queue(function(next) {$(this).removeClass('madlibtextfilled'); next();});
							//$this.find('.madlibtext').stop().removeClass('madlibtextfilled');
							//$this.find('.madlibtext').clearQueue().dequeue().removeClass('madlibtextfilled');
							// publish reset event
							$.publish('madlib.reset', [$this.closest('.madlib')]);
						})
					.appendTo($godiv);
				
				// TODO separation between sections
				
				//this.append($('<br />'));

				// make form to get enter from name field to submit
				var $submitform = $('<form class="submit-form" action="./"></form>').appendTo(this);

				// make name field that people can fill if they want
				var $saveparagraph = $('<p class="save-paragraph">Save it so other people can see:<br />' +
				'<span class="indent"">Your name (optional): <input class="username-input" type="text" name="username" placeholder="Anonymous" /></span>' +
				'<span class="ui-state-error hidden-fdbk madlib-error madlib-fdbk">Something went wrong, try again</span>' +
				'<span class="madlib-fdbk hidden-fdbk madlib-success">Your entry has been saved!</span>' +
				'</p>').appendTo($submitform);
				
				// make submit button and ind to submit method
				$('<input type="submit" value="submit" />').bind('click.madlib',
					function() {
						var timeoutID = setTimeout( function() {
							
							// remove loading style
							$saveparagraph.removeClass('loading');
							
							// show error
							$saveparagraph.find('.madlib-error').removeClass('hidden-fdbk');

						}, 2000);

						// call submit method
						$this.madlib('submit', {timeout:timeoutID});

						// put loading style on
						$saveparagraph.addClass('loading');
						
						// remove error message if it was there
						$saveparagraph.find('.madlib-error').addClass('hidden-fdbk');
						
						// don't actually submit form
						return false;

					}).appendTo($saveparagraph);
				
				// remove feedback messages on input text focus
				$saveparagraph.find('.username-input').focus(function() {
					// remove error
					$saveparagraph.find('.madlib-fdbk').addClass('hidden-fdbk');
				});
				
				// add plugin-based placeholders if not supported in browser
				/*if(!supports_placeholder()) {
					this.find('.pos').placeholder();
				}*/
				
			},
			submit : function(options) {
				// check that we know where to submit to
				if(this.data('madlib').name) {

					// get array of entries
					var entries = [];
					this.find(".pos").each(function() {
						entries.push($(this).val());
					});
					
					// timeout variable
					var timeoutID = options.timeout;
					
					var $this = this;
					
					// submit to database
					$.getJSON("http://" + domain + "/submit?jsoncallback=?", {
						name : this.data('madlib').name,
						entries : entries,
						username : this.find(':input[name="username"]').val()
					}, function(data) {
						if(data.status === "success") {
							// TODO notify success
							
							// take off loading style
							$this.find('.save-paragraph').removeClass('loading');
							
							// kill error timeout
							clearTimeout(timeoutID);
							
							// show success message
							$this.find('.save-paragraph .madlib-success').removeClass('hidden-fdbk');
							
						} else {
							// TODO notify fail
							
							// kill error timeout
							clearTimeout(timeoutID);
							
							// TODO show error message
							$this.find('.save-paragraph .madlib-error').removeClass('hidden-fdbk');
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
					$.getJSON("http://" + domain + "/like?jsoncallback=?",
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
				// fill entry fields with supplied entries
				this.find(".pos").each(function(index, element) {
					$(this).val(entries[parseInt($(this).attr("entryno")) - 1]);
				});
				
				// call resolve to fill refs and show text if it's not shown already
				this.madlib('resolve');
				
				// pulse text once for feedback
				this.find(".entry").css("background-color", "#dac1eb").animate({"background-color": "#FFFFFF"}, 300);
				
				// remove username from submission
				this.find(":input[name='username']").val("");
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
