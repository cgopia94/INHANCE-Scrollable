// JQuery plugin for making the wrapper div scrollable using mouse
// currently only supports for either vertical or horizontal scroll not both
// version: 0.0.5
// date: 02/22/2017
// Author: Myeong Kim
// Example:
// $('#theWrapper').INHANCE_scrollable({direction: 'horizontal'});

(function ($) {
	$.fn.INHANCE_scrollable = function(options) {
		var settings;

		var defaults = {
			direction: 'vertical'
		};

		settings = $.extend(defaults, options);

		$.event.special.destroyed = {
	    remove: function(o) {
	      if (o.handler) {
	        o.handler();
	      }
	    }
	  };

		return this.each(function () {
			var scrollStartPos = 0;
	    var startX = 0;
	    var isMouseDown = false;
	    var isScrolling = false;
	    var THRESHOLD_PIXELS_FOR_MOVE = 8;
	    var scrollDir = settings.direction == 'vertical' ? 'scrollTop' : 'scrollLeft';
	    var capturingHandler = function (event) {
	    	if (!isScrolling) {
	    		event.stopPropagation();
	    	}
	    };

	    console.log(scrollDir);
	    $(this).off('mousedown.scrollable touchstart.scrollable').on('mousedown.scrollable touchstart.scrollable', function(event) {
	      event.stopImmediatePropagation();
	      var mouseX = settings.direction == 'vertical' ? ((event.touches && event.touches[0].pageY) || event.pageY) : ((event.touches && event.touches[0].pageX) || event.pageX);
	      
	      startX = mouseX;
	      scrollStartPos = this[scrollDir] + mouseX;
	      isMouseDown = true;
	    });
	    $(this).off('mouseup.scrollable touchend.scrollable').on('mouseup.scrollable touchend.scrollable', function(event) {
	      event.stopImmediatePropagation();
	      var mouseX = settings.direction == 'vertical' ? ((event.touches && event.touches[0].pageY) || event.pageY) : ((event.touches && event.touches[0].pageX) || event.pageX);
	      isMouseDown = false;
	      if(isScrolling && Math.abs(startX - mouseX) > THRESHOLD_PIXELS_FOR_MOVE) {
	      	isScrolling = false;
	      }
	      else {
	      	isScrolling = true;
	      }
	    });

	    $(this).off('mousemove.scrollable touchmove.scrollable').on('mousemove.scrollable touchmove.scrollable', function(event) {
	    	event.preventDefault();
	      event.stopImmediatePropagation();
	      var mouseX;
	      var marginStart;
	      var marginEnd;
	      if (settings.direction == 'vertical') {
	      	mouseX = (event.touches && event.touches[0].pageY) || event.pageY;
	      	marginStart = $(this).offset().top;
	      	marginEnd = $(this).offset().top + $(this).height();
	      }
	      else {
	      	mouseX = (event.touches && event.touches[0].pageX) || event.pageX;
	      	marginStart = $(this).offset().left;
	      	marginEnd = $(this).offset().left + $(this).width();
	      }
	      
	      if(isMouseDown) {
	      	this[scrollDir] = scrollStartPos - mouseX;
	        isScrolling = true;

	        $(this).on('mouseleave.scrollable touchleave.scrollable', function () {
	        	console.log('out!!');
	        	$(this).off('mouseleave.scrollable touchleave.scrollable').trigger('mouseup.scrollable');
	        });
	      }
	      
	    });

	    var that = this;
	    $(this).off('destroyed').on('destroyed', function (evt) {
				that.removeEventListener('click', capturingHandler);	    	
	    });

	    this.addEventListener('click', capturingHandler, true);
		});
	};
}(jQuery));