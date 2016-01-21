$(document).ready(function() {

	$('table').addClass('enhanced');

	var container = $('<div class="table-menu table-menu-hidden"><ul /></div>');

	$( 'thead th').each(function(i) {
		var th = $(this),
				id = th.attr('id'),
				classes = th.attr('class'); //essential, optional

		// Assign an ID to each header, if none is in the markup
		if (!id) {
			id = ('col-') + i;
			th.attr('id', id);
		}

		// Loop through each row to assign a 'headers' attr and any
// classes (essential, optional) to the matching cell.
		// The 'headers' attr value = the header's ID
		$('tbody tr').each(function() {
			var cell = $(this).find('th, td').eq(i);
			cell.attr('headers', id);
			if (classes) { cell.addClass(classes); }
		});

		// Create the menu hide/show toggles
		if ( !th.is('.persist')) {
			// Note that each input's value matches the header's ID.
			// This value will be used to control the visibility of that
// header and its associated cells
			var toggle = $('<li><label for="toggle-col-"'+ i +'">'+ th.text() +'</label><input type="checkbox" name="toggle-cols" id="toggle-col'+ i +'"value="'+ id +'" /></li>');

			// Append each toggle to the container,
			container.find('ul').append(toggle);

			// assign behaviour,
			toggle.find('input')

				// when the chechbox is toggled
				.change(function() {
					var input = $(this),
							val = input.val(), // this equals the header's ID, i.e. 'comapany'
							cols = $('#'+ val +', [headers = '+ val +']'); // so we can easily find the matching header (id='company')
							// and cells (headers='company')

					if (input.is(':checked')) { 
						cols.show(); 
					} else { 
						cols.hide(); 
					}
				})
				// Custom event that sets the checked state for each toggle based on column visability, which is controlled by 
// @media rules in the css
				// Called whenever the window is resized or reorientated
				.bind('updateCheck', function() {
					if ( th.css('display') == 'table-cell') {
						$(this).attr('checked', true);
					} else {
						$(this).attr('checked', false)
					}
				})

				// Call the custom event on load
				.trigger('updateCheck'); 
		}
	});

	// Update the inputs checked status
	$(window).bind('orientationchange resize', function() {
		container.find('input').trigger('updateCheck');
	});

	var menuWrapper = $('<div class="table-menu-wrapper" />'),
   		menuBtn = $('<a href="#" class="table-menu-btn">Display</a>');

menuBtn.click(function(){
   container.toggleClass("table-menu-hidden");
   return false;
});

menuWrapper.append(menuBtn).append(container);
$('table').before(menuWrapper);  // append the menu immediately before the table

// assign click-away-to-close event
$(document).click(function(e){
   if ( !$(e.target).is( container ) && !$(e.target).is( container.find("*") ) ) {
      container.addClass("table-menu-hidden");
   }
});
});