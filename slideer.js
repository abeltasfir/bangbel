$('body').on('click', '.gallery__nav li', function(e){
	e.preventDefault();
	
	var $th           = $(this),
			$gallery      = $th.closest('.gallery-wrapper'),
			$itemsWrapper = $('.gallery__items', $gallery),
			$items        = $('.gallery__item', $itemsWrapper),
			i             = $th.index();
	
	if( $gallery.attr('data-animating') == 1 ) return;
	$gallery.attr('data-animating', 1);
	
	$th
		.addClass('active')
		.siblings()
		.removeClass('active');

	$items
		.eq(i)
		.addClass('gallery__item--active')
		.siblings()
		.removeClass('gallery__item--active');

	$itemsWrapper
		.css('transform', 'translate3d(-' + $items.eq(0).outerWidth() * i + 'px, 0, 0)');
	
	$gallery.attr('data-current-item', i);
	
	setTimeout(function(){
		var autoSlideId = $gallery.attr('data-current-intervalId') || null;
		$gallery.attr('data-animating', 0);
		
		clearInterval(autoSlideId);
	}, 500);
});

$('body').on('keydown', function(e){
	var keyCodes = {
		37: 'prev',
		39: 'next'
	},
	$gallery = $('.gallery-wrapper'),
	$galleryItems = $('.gallery__items>*', $gallery),
	$galleryNav   = $('.gallery__nav', $gallery),
	i = +$gallery.attr('data-current-item'),
	newI = i;
	
	switch(keyCodes[e.which]){
		case 'prev': {
			newI = (newI - 1) < 0 ? ($galleryItems.length - 1) : (newI - 1);
			break;
		}
		case 'next': {
			newI = (newI + 1) > ($galleryItems.length - 1) ? 0 : (newI + 1);
			break;
		}
	}
	
	$('>li', $galleryNav)
		.eq(newI)
		.trigger('click');
});

$('.gallery-wrapper').each(function(index, $gallery){
	var $galleryItems = $('.gallery__items>*', $gallery),
			$galleryNav   = $('.gallery__nav', $gallery),
			navItems      = '';
	
	for(var i = 0; i < $galleryItems.length; i++){
		navItems += '<li' + (i === 0 ? ' class="active"' : '') + '></li>';
	}
	
	$galleryNav
		.empty()
		.append(navItems);
	
	$('>li:first', $galleryNav)
		.trigger('click');
	
	var mc = new Hammer($gallery);
	mc.on('swipeleft swiperight', function(e){
		var newI = +$($gallery).attr('data-current-item');
		
		switch(e.type){
			case 'swiperight': {
				newI = (newI - 1) < 0 ? ($galleryItems.length - 1) : (newI - 1);
				break;
			}
			case 'swipeleft': {
				newI = (newI + 1) > ($galleryItems.length - 1) ? 0 : (newI + 1);
				break;
			}
		}

		$('>li', $galleryNav)
			.eq(newI)
			.trigger('click');
	});
	
	$($gallery).attr('data-current-intervalId', setInterval(function(){
		var newI = +$($gallery).attr('data-current-item');
		newI = (newI + 1) > ($galleryItems.length - 1) ? 0 : (newI + 1);
		
		$('>li', $galleryNav).eq(newI).trigger('click');
	}, 2000))
});