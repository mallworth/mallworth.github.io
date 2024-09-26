$(document).ready(function() {
    // Photography
    const photoURLs = [
        'imgs/moab2.jpg',
        'imgs/alaska2.jpg',
        'imgs/slo1.jpg',
        'imgs/antonio1.jpg',
        'imgs/alaska1.jpg',
        'imgs/alaska5.jpeg',
        'imgs/alaska3.jpg',
        'imgs/monterey.jpg',
        'imgs/sur2.jpg',
        'imgs/wyoming.jpg',
        'imgs/moab1.jpg',
        'imgs/sur1.jpg',
    ];

    // defines what happens on image click, adds event listener for window resize while image is expanded
    function setupImageExpander() {
        const overlay = document.getElementById('overlay');

        function handleImageClick(event) {
            const clickedImage = event.currentTarget.querySelector('img');
            const expandedImage = document.createElement('img');

            expandedImage.classList.add('expanded-image');
            document.body.appendChild(expandedImage);
            expandedImage.src = clickedImage.src;
            overlay.style.display = 'block';
            expandedImage.classList.add('active');

            function resizeExpandedImage() {
                const width = window.innerWidth;
                const height = window.innerHeight;
                const aspectRatio = expandedImage.width / expandedImage.height;
        
                // adjust expanded image to look nice (PROPER ASPECT RATIO)
                if (width / aspectRatio < height) {
                    expandedImage.style.width = width + 'px';
                    expandedImage.style.height = 'auto';
                } else {
                    expandedImage.style.height = height + 'px';
                    expandedImage.style.width = 'auto';
                }
            }
        
            resizeExpandedImage();
            overlay.addEventListener('click', closeExpandedImage);
        }

        function closeExpandedImage() {
            const expandedImage = document.querySelector('.expanded-image');
            if (expandedImage !== null) {
                expandedImage.classList.remove('active');
                overlay.style.display = 'none';
                document.body.removeChild(expandedImage);
                overlay.removeEventListener('click', closeExpandedImage);
            }
        }

        const imageWrappers = document.querySelectorAll('.image-wrapper');

        // remove old click listener from each image, add new one **IDK WHY THIS WORKS BUT IT DOES**
        imageWrappers.forEach(imageWrapper => {
            imageWrapper.removeEventListener('click', handleImageClick);
            imageWrapper.addEventListener('click', handleImageClick);
        });
    }

    // goes through resized photos and displays, adds hover zoom effect and listens for image clicks
    function displayModifiedPhotos(modifiedPhotos) {
        const photoContainer = document.getElementById('photoContainer');
        photoContainer.innerHTML = '';

        modifiedPhotos.forEach(modifiedPhoto => {
            const imageWrapper = document.createElement('div');
            const image = document.createElement('img');

            imageWrapper.classList.add('image-wrapper');
            imageWrapper.classList.add('hover-zoom');
            imageWrapper.style.width = modifiedPhoto.width + 'px';

            image.src = modifiedPhoto.src;
            image.width = modifiedPhoto.width;
            image.height = modifiedPhoto.height;

            imageWrapper.appendChild(image);
            photoContainer.appendChild(imageWrapper);
        });

        // set up image expander listener
        setupImageExpander();
    }

    // photo display algo
    function scalePhotos(screenWidth, photoURLs) {
        const scaledPhotos = [];
        let rowImages;
        let sameHeightPhotos;
        const imagesPerRow = screenWidth < 650 ? 2 : 3;

        const imagePromises = photoURLs.map(photoURL => {
            return new Promise((resolve) => {
                const image = new Image();
                image.src = photoURL;
                image.onload = () => resolve(image);
            });
        });

        Promise.all(imagePromises).then(() => {
            for (let i = 0; i < photoURLs.length; i += imagesPerRow) {
                sameHeightPhotos = [];
                rowImages = photoURLs.slice(i, i + imagesPerRow); 
                let totalWidth = 0;

                rowImages.forEach((photoURL) => {
                    const image = new Image();
                    image.src = photoURL;

                    let nHeight = 100;
                    let nWidth = image.width * (nHeight / image.height);

                    totalWidth += nWidth;

                    sameHeightPhotos.push({
                        src: image.src,
                        width: nWidth,
                        height: nHeight
                    });
                });

                sameHeightPhotos.forEach((photo) => {
                    const scaledWidth = (photo.width / totalWidth) * screenWidth;
                    const scaledHeight = photo.height * (scaledWidth / photo.width);

                    if (screenWidth < 350) {
                        scaledPhotos.push({
                            src: photo.src,
                            width: scaledWidth * 0.85,
                            height: scaledHeight * 0.85
                        });
                    } else if (imagesPerRow == 2) {
                        scaledPhotos.push({
                            src: photo.src,
                            width: scaledWidth * 0.9,
                            height: scaledHeight * 0.9
                        });
                    } else {
                        scaledPhotos.push({
                            src: photo.src,
                            width: scaledWidth * 0.9,
                            height: scaledHeight * 0.9
                        });
                    }
                });
            }
            displayModifiedPhotos(scaledPhotos);
        });
    }

    function handleResize() {
        if ($('#page2').hasClass('invis')) {
            return
        }
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        scalePhotos(screenWidth, photoURLs);
    }

    setupImageExpander();
    handleResize();

    // listen for window resize to restructure photo arrangement 
    $(window).on('resize', handleResize);

    $('.page').hide();
    $('#page1').show();

    // Function to handle tab switching
    $('li a').click(function(){
        let curId = $(this).attr('id');

        if ($(this).hasClass('invis')){   
            // Add invis everywhere so home can be switched back to
            $('li a').addClass('invis');        
            $(this).removeClass('invis');
            $('.page').hide();

            // Close burger if open
            if ($('.burgerbox').is(':checked')) {
                $('.burgerbox[type="checkbox"]').prop('checked', false);
            }

            // Concatenate to get page id
            $('#page' + curId).show();  

            // Focus on input box if on T&C
            if (curId == '4') {
                $('#typesomething').focus();
            }
        }
    });

    // Type & Color
    // Color picker widget from https://iro.js.org/
    let cpb = new iro.ColorPicker('#backgroundpicker', {
        width: 170,
        color: '#ffffff',
        layout: [
            {component: iro.ui.Wheel},
            {component: iro.ui.Slider}
        ]
    });

    cpb.on('color:change', function(color) {
        $('body').css('background-color', color.hexString);
        $('#typesomething').css('background-color', color.hexString);
        $('#backgroundcolor').text(color.hexString);
        $('select').css('background-color', color.hexString);
        $('ul').css('background-color', color.hexString);
    });

    // Type color picker
    let cpt = new iro.ColorPicker('#typepicker', {
        width: 170,
        color: '#2c3628',
        layout: [
            {component: iro.ui.Wheel},
            {component: iro.ui.Slider}
        ]
    });

// Un comment to have font color load in with lighter color to assign to "Type Something..."
    // let r = Math.min(255, parseInt(cpt.color.hexString.slice(1, 3), 16) + 45);
    // let g = Math.min(255, parseInt(cpt.color.hexString.slice(3, 5), 16) + 45);
    // let b = Math.min(255, parseInt(cpt.color.hexString.slice(5, 7), 16) + 45);
    // let lighter = '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    
    // $('<style>')
    //     .prop('type', 'text/css')
    //     .html(`input::placeholder { color: ${lighter}; }`)
    //     .appendTo('head');

    // $('#typecolor').text(lighter);


    cpt.on('color:change', function(color) {
        $('body').css('color', color.hexString);
        $('input').css('color', color.hexString);
        $('select').css('color', color.hexString);
        $('select').css('border', '2px solid ' + color.hexString);
        $('#typecolor').text(color.hexString);
        $('ul li a').css('color', color.hexString);
        $(':root').css('--foreground-burger', color.hexString);
        $('p').css('color', color.hexString);
        
        // Apply dynamic lighter color to input placeholder text 
        let r = Math.min(255, parseInt(color.hexString.slice(1, 3), 16) + 45);
        let g = Math.min(255, parseInt(color.hexString.slice(3, 5), 16) + 45);
        let b = Math.min(255, parseInt(color.hexString.slice(5, 7), 16) + 45);
        let lighter = '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
        
        $('<style>')
            .prop('type', 'text/css')
            .html(`input::placeholder { color: ${lighter}; }`)
            .appendTo('head');
    });

    // Font switch function
    $('#font').change(function() {
        let newfont = $(this).val();

        $('#backgroundcolor').css('font-family', newfont);
        $('#typecolor').css('font-family', newfont);
        $('#typesomething').css('font-family', newfont);
        $('#font').css('font-family', newfont);
        $('p').css('font-family', newfont);
        $('ul li a').css('font-family', newfont);

        let cur_color = $(this).css('color');
        $('#font').css('font-family', newfont);
        $('#font').css('border', '2px solid ' + cur_color);
    });


    // CODING: TTimage video stream
    // let font_size = 12;

    // function change_font_size(increment) {
    //     font_size += increment;
    //     drawFrame();
    // }


    function startWebcam() {
        const videoElement = document.getElementById('webcamVideo');
        const constraints = { video: true };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                videoElement.srcObject = stream;
                processFrames();
            })
            .catch(error => {
                console.error('Error accessing webcam: ', error);
            });
    }


    function processFrames() {
        const videoElement = document.getElementById('webcamVideo');
        const canvasElement = document.getElementById('webcamCanvas');
        const context = canvasElement.getContext('2d', { willReadFrequently: true});

        function resizeCanvas() {
            canvasElement.width = videoElement.videoWidth * 2;
            canvasElement.height = videoElement.videoHeight * 2;
        }

        videoElement.addEventListener('loadedmetadata', resizeCanvas);

        function drawFrame() {
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);

            // Mirror webcam feed
            context.translate(canvasElement.width, 0);
            context.scale(-1, 1);

            context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

            context.setTransform(1, 0, 0, 1, 0, 0);

            const frame = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const data = frame.data;

            context.clearRect(0, 0, canvasElement.width, canvasElement.height);
            context.fillStyle = 'black';

            let font_size = 16;

            let spacing = Math.round(font_size - (font_size * 0.1875));
            let color = $('.name').css('color');
            context.font = '800 ${font_size}px Monaco';
            context.fillStyle = color;

            for (let y = 0; y < canvasElement.height; y += spacing) {
                for (let x = 0; x < canvasElement.width; x += spacing) {

                    const index = ((y * canvasElement.width) + x) * 4;
                    const red = data[index];
                    const green = data[index + 1];
                    const blue = data[index + 2];
                    // Avg values to find brightness
                    const brightness = (red + green + blue) / 3;

                    const chars = [[0, ' '],
                                [70, ','],
                                [100, '~'],
                                [150, '*'],
                                [190, '?'],
                                [230, '$'],
                                [245, '#'],
                                [255, '@']]

                    let char = ' ';

                    for (let i = 0; i < 8; i++) {
                        if (chars[i][0] <= brightness  && brightness <= chars[i+1][0]) {
                            char = chars[i][1];
                        }
                    }

                    if (char == ' ') {
                        char = chars[7][1];
                    }

                    context.fillText(char, x, y);
                }
            }

            requestAnimationFrame(drawFrame);
        }

        videoElement.addEventListener('play', () => {
            resizeCanvas();
            requestAnimationFrame(drawFrame);
        });

        window.addEventListener('resize', resizeCanvas);
    }

    startWebcam();
});