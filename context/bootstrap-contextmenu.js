const contextMenu = {

	init : function(selector , options) {
		$(document).on("contextmenu", selector, function(e) {

			$('.context-widget').remove()
			e.stopImmediatePropagation()

			if(contextMenu.builder(selector, options, e)) {			

				$('.context-widget').css({
					display: "block",
					left: e.pageX,
					top: e.pageY, 
					position : 'absolute'
				});

				let w = $('.context-widget .dropdown-menu').outerWidth()
				if(e.pageX + w > $(window).width()) {
					$('.context-widget').css({
						left : 'auto', 
						right : (w+2) +'px'
					})
				}

				let h = $('.context-widget .dropdown-menu').outerHeight()
				if(e.pageY + h > $(window).height()) {
					$('.context-widget').css({
						top : 'auto', 
						bottom : (h+2) +'px'
					})
				}

				return false;
			}
		});

		$(selector+' a').on("click", function(e) {
		   	$('.context-widget').remove()

		});

		$('body,html').on('click' , function() {
		   	$('.context-widget').remove()
		})		
	},

	builder : function(classname, options, event) {
		let html = ''

		if(classname) {
			html +=	'<div class="dropdown context-widget open clearfix">'		
		}

		html += '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">'

		for(let k in options) {
			let item = options[k], 
				display = true

			display = 	(typeof item.display == 'function') 
							? item.display(event)
							: item.display

			if(display == false) {
				continue
			}

			if(item.type == 'item') {

				if(typeof item.html != 'undefined') {
					html += contextMenu.htmlItem(item.html, event)
					continue
				}

				html += contextMenu.item(item.text, item.href, item.attr || [], event)
			}

			if(item.type == 'header') {
				html += contextMenu.header(item.text, event)
			}

			if(item.type == 'divider') {
				html += contextMenu.divider()
			}

			if(item.type == 'submenu') {
				html += contextMenu.submenu(item.items, item.text, event)
			}
		}

		html +=		'</ul>'
		if(classname) {		
			html += '</div>' 
			$('body').append(html)	
			return true	
		} else {
			return html
		}
	},

	item : function(text, href, attrs = [], event) {

		href = href || 'javascript:void(0)'

		if(typeof href == 'function') href = href(event)
		if(typeof text == 'function') text = text(event)

		return 	'<li '+contextMenu.attrs(attrs, event)+'>'+
					'<a href="'+href+'">'+
						text+
					'</a>'+
				'</li>'
	},

	htmlItem : function(html , event) {

		if(typeof html == 'function') {
			return html(event)
		}

		return html

	},

	header : function(text, event) {
		if(typeof text == 'function') text = text(event)
		return '<li class="dropdown-header">'+text+'</li>'
	},

	divider : function() {
		return '<li class="divider"></li>'
	},

	submenu : function(items, text, event) {
		if(typeof text == 'function') text = text(event)

		return '<li class="dropdown-submenu">' + 
					'<a tabindex="-1" href="javascript:void(0)">'+text+'</a>'+
					contextMenu.builder(false, items, event)+
				'</li>'
	},

	attrs : function(obj, event) {
		let str = ''
		for (let k in obj) {
			if(obj.hasOwnProperty(k)) {
				if(typeof obj[k] == 'function') {
					str += k+'="'+obj[k](event)+'"'
					continue
				}
				str += k+'="'+obj[k]+'"'			
			}
		}

		return str
	}, 
}