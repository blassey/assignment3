// photo gallery
$(document).ready(function() {
    var request; // Latest image to be requested
    var $current; // Image currently being shown 
    var cache = {}; // Cache object
    var $frame = $('#mainImage'); // Container for image
    var $thumbs = $('.thumbnail'); // Thumbnails
    var $currentThumb;

    function crossfade($img) { // Function to fade between images
        // Pass in new image as parameter
        if ($current) { // If there is currently an image showing
            $current.stop().fadeOut('slow'); // Stop any animation & fade it out
            $current.remove();
            $frame.append($img);
        }

        $img.stop().fadeTo('slow', 1); // Stop animation on new image & fade in

        $current = $img; // New image becomes current image

    }

    $(document).on('click', '.thumbnail', function(e) { // When a thumb is clicked on
        var $img, // Create local variable called $img
            src = this.href; // Store path to image
        request = src; // Store latest image request

        e.preventDefault(); // Stop default link behavior

        $currentThumb = $(this); //store current thumbnail

        $thumbs.removeClass('active'); // Remove active from all thumbs
        $(this).addClass('active'); // Add active to clicked thumb

        if (cache.hasOwnProperty(src)) { // If cache contains this image
            if (cache[src].isLoading === false) { // And if isLoading is false
                crossfade(cache[src].$img); // Call crossfade() function
            }
        } else { // Otherwise it is not in cache
            $img = $('<img/>'); // Store empty <img/> element in $img
            cache[src] = { // Store this image in cache
                $img: $img, // Add the path to the image
                isLoading: true // Set isLoading property to false
            };

            // Next few lines will run when image has loaded but are prepared first
            $img.on('load', function() { // When image has loaded
                $img.hide(); // Hide it
                // Remove is-loading class from frame & append new image to it
                $frame.removeClass('is-loading').append($img);
                cache[src].isLoading = false; // Update isLoading in cache
                // If still most recently requested image then
                if (request === src) {
                    crossfade($img); // Call crossfade() function
                } // Solves asynchronous loading issue
            });

            $frame.addClass('is-loading'); // Add is-loading class to frame

            $img.attr({ // Set attributes on <img> element
                'src': src, // Add src attribute to load image
                'alt': this.title || '' // Add title if one was given in link
            });

        }

    });
    $('#next').on('click', function() {
        var $nextItem = $currentThumb.next();

        if ($nextItem.length > 0) {
            $nextItem.click();
        } else {
            $currentThumb.siblings().first().click();
        }
    });

    $('#previous').on('click', function() {
        var $prevItem = $currentThumb.prev();
        $prevItem.click();

        if ($prevItem.length > 0) {
            $prevItem.click();
        } else {
            $currentThumb.siblings().last().click();
        }

    });


    // Final line runs once when rest of script has loaded to show the first image
    $('.thumbnail').eq(0).click(); // Simulate click on first thumb


    //  FILTERS //

    var $imgs = $('#queue img'); // Store all images
    var tagged = {}; // Create tagged object

    $imgs.each(function() { // Loop through images and
        var img = this; // Store img in variable
        var tags = $(this).data('tags'); // Get this element's tags
		
        if (tags) { // If the element had tags
            tags.split(',').forEach(function(tagName) { // Split at comma and
                if (tagged[tagName] == null) { // If object doesn't have tag
                    tagged[tagName] = []; // Add empty array to object
                }
                tagged[tagName].push(img); // Add the image to the array
            });
        }
    });

    $('.filter').on('click', function() {
        var filterColor = $(this).data('filter');
		$imgs.hide();                                      // Hide all of the images
		$imgs.filter(tagged[filterColor]).show();          // Show the images with the selected filter
		if (filterColor == ""){
			$imgs.show();
		}
		$('#queue img:visible').eq(0).parent().click();
	});
});