(function( $ ) {
	fluentBoot = function(selector) {
		return new fluentBoot.fn.init(selector);
	}
	
	fluentBoot.fn = fluentBoot.prototype = {
		constructor: fluentBoot,
		init: function(selector) {
			console.log('init');
			
			this.context = { 
				selector: selector,
				content: [],
				fluentElement: null
			}
			
			return this;
		},
		
		on: function(events, handler) {
			if (this.context.fluentElement) {
				this.context.fluentElement.content.on(events, handler);
			}
			
			return this;
		},
		
		add: function(selector) {
			var container;
			
			if (!selector) {
				selector = this.context.selector;
			} 
			
			if (!selector) {
				throw new Error('Selector is not specified');
			}
		
			if (selector instanceof jQuery) {
				container = selector;
			} else {
				container = $(selector);
			}

			var len = this.context.content.length;
			
			for (var i = 0; i < len; i++) {
				container.append(this.context.content[i]);
			}
			
			return this;
		},
		
		getContent: function() {
			if (context.content.length == 0) {
				return null;
			}
			if (context.content.length == 1) {
				context.content[0];
			}
			return context.content;
		},
		
		toolbar: function() {
			var content = $('<div class="btn-toolbar"></div>');
			var excludeTypes = ['button', 'btnGroup', 'toolbar'];
			
			updateContext(this.context, function(current) {
				if (canBeParent(current, excludeTypes)) {
					return new FluentElement('toolbar', content, current);
				}
			
				return false;
			});
			 
			console.log('toolbar');
			return this;
		},

		btnGroup: function(options) {
			var content = $('<div class="btn-group"></div>');
			var excludeTypes = ['button', 'btnGroup'];
			
			if (options && options.vertical) {
				content.addClass('btn-group-verical');
			}
			
			updateContext(this.context, function(current) {
				if (canBeParent(current, excludeTypes)) {
					return new FluentElement('btnGroup', content, current);
				}
			
				return false;
			});
			
			return this;
		},
		
		
		// todo: iconUrl, href
		button: function(options) {
			var content = $('<button class="btn"></button>');
			var excludeTypes = ['button'];
			
			if (options) {
				var html = '';
				
				if (options.icon) {
					html += '<i class="icon-' + options.icon;

					if (options.iconColor) {
						html += ' icon-' + options.iconColor;
					}
					
					html += '"></i>';
				}

				if (options.caption) {
					if (html != '') {
						html += ' ';
					}
					
					html += options.caption;
				}

				if (html != '') {
					content.html(html);
				}
				
				if (options.kind) {
					content.addClass('btn-' + options.kind);
				}
			}
			
			updateContext(this.context, function(current) {
				if (canBeParent(current, excludeTypes)) {
					return new FluentElement('button', content, current);
				}
			
				return false;
			});

			return this;
		},
	}
	
	fluentBoot.fn.init.prototype = fluentBoot.fn;

	function canBeParent(element, types) {
		return !element || types.indexOf(element.type) == -1;
	}
	
	function updateContext(context, fluentCallback) {
		var newElement;
		
		while (context.fluentElement) {
			newElement = fluentCallback(context.fluentElement);
			
			if (newElement) {
				break;
			}
			
			context.fluentElement = context.fluentElement.parent;
		}
		
		if (!newElement) {
			newElement = fluentCallback(null);
		}
			
		if (!context.fluentElement) {
			context.content.push(newElement.content);
		}
		
		context.fluentElement = newElement;
	}
	
	FluentElement = function(type, content, parent) {
		if (parent && !(parent instanceof FluentElement)) {
			throw new Error('Parent is not of type FluentElement');
		}

		if (!content) {
			throw new Error('Content of FluentElement cannot be undefined');
		}

		this.parent = parent;
		this.type = type;
		this.content = content;
		
		if (parent) {
			parent.content.append(content);
		}
	}
})( jQuery );