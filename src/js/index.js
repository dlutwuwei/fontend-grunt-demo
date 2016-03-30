$(function() {

	var panels = $('.slider .slider-panel');
	var dots = $('.slider-nav .item');
	dots.hover(function(evt) {
		dots.removeClass('select')
		$(this).addClass('select')
		var index = $(this).attr('index');
		panels.removeClass('show');
		$(panels[index]).addClass('show');
	});

	function turn() {
		var pos = 0;
		return setInterval(function() {
			panels.removeClass('show');

		})
	}

	var servs = $('.service-list .service');
	var covers = $('.service-list .cover');
	servs.hover(function(evt) {
		covers.hide();
		var el = $(this).find('.cover').show();

	});
})