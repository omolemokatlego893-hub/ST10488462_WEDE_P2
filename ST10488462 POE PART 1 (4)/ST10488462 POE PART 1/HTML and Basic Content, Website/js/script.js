/* =========================================================
   PAWS HAVEN ANIMAL RESCUE — MAIN JAVASCRIPT FILE
   WEDE5020 POE Part 3: JavaScript Enhancements
   =========================================================
   This one file is linked to every page. Each feature below
   checks whether it is needed on the current page, so it is
   safe to load everywhere.

   Sections:
   1. Helper function
   2. Highlight the current page in the navigation
   3. Scroll reveal animation
   4. Back to top button
   5. Accordion (FAQ)
   6. Lightbox image viewer
   7. Dog directory: loads dogs from data/dogs.json, with search, filter and sort
   8. Dog details pop-up (modal window)
   9. Form helpers: checking what the visitor typed
   10. Interactive map (contact page)
   11. Contact form: checking, then building an email
   12. Enquiry form: checking, sending with AJAX, and showing a response
   13. Start everything when the page has loaded
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. HELPER FUNCTION
   Creates an HTML element, gives it a class name and any
   attributes, so we don't repeat the same few lines every
   time we build something with JavaScript.
--------------------------------------------------------- */
function createElement(tag, className, attributes) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (attributes) {
        Object.keys(attributes).forEach(function (name) {
            element.setAttribute(name, attributes[name]);
        });
    }

    return element;
}


/* ---------------------------------------------------------
   2. HIGHLIGHT THE CURRENT PAGE IN THE NAVIGATION
   Looks at the page address, finds the matching menu link,
   and marks it as the current page. This is DOM manipulation:
   we change the page after it has loaded.
--------------------------------------------------------- */
function highlightActiveNavLink() {
    // The web address might be /services.html (on your computer) or just
    // /services (on the live site), so remove ".html" before comparing.
    const path = window.location.pathname;
    const currentPage = (path.replace(/\/+$/, '').split('/').pop() || 'index').replace(/\.html$/, '');
    let foundMatch = false;

    document.querySelectorAll('nav a').forEach(function (link) {
        const linkPage = (link.getAttribute('href') || '').replace(/\.html$/, '');

        if (linkPage === currentPage) {
            link.classList.add('active');
            // Helps screen readers announce which page is current
            link.setAttribute('aria-current', 'page');
            foundMatch = true;
        }
    });

    // Visitors who arrive at the folder address (ending in "/") are on the home page
    if (!foundMatch && path.endsWith('/')) {
        const homeLink = document.querySelector('nav a[href="index.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
            homeLink.setAttribute('aria-current', 'page');
        }
    }
}


/* ---------------------------------------------------------
   3. SCROLL REVEAL ANIMATION
   Each section fades up into place the first time it scrolls
   into view. The CSS for this is in style.css (section 14).
--------------------------------------------------------- */
function initScrollReveal() {
    const sections = document.querySelectorAll('main section');

    // Older browsers without IntersectionObserver simply skip the
    // animation, so the content is never hidden from the visitor.
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Reveal once only, then stop watching this section
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(function (section) {
        section.classList.add('reveal');
        observer.observe(section);
    });
}


/* ---------------------------------------------------------
   4. BACK TO TOP BUTTON
   Builds a round button with JavaScript. It appears once the
   visitor has scrolled down, and takes them back to the top.
--------------------------------------------------------- */
function initBackToTop() {
    const button = createElement('button', 'back-to-top', {
        type: 'button',
        'aria-label': 'Back to top'
    });
    button.textContent = '\u2191'; // up arrow
    document.body.appendChild(button);

    window.addEventListener('scroll', function () {
        // Show the button after scrolling 400 pixels down
        button.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ---------------------------------------------------------
   5. ACCORDION (FAQ)
   Clicking a question opens its answer and closes the others.
   aria-expanded tells screen readers whether it is open.
--------------------------------------------------------- */
function setAccordionState(header, isOpen) {
    const panel = document.getElementById(header.getAttribute('aria-controls'));

    header.setAttribute('aria-expanded', String(isOpen));
    panel.hidden = !isOpen;
}

function initAccordions() {
    document.querySelectorAll('.accordion').forEach(function (accordion) {
        const headers = accordion.querySelectorAll('.accordion-header');

        headers.forEach(function (header) {
            header.addEventListener('click', function () {
                const isOpen = header.getAttribute('aria-expanded') === 'true';

                // Close every question in this accordion first...
                headers.forEach(function (other) {
                    setAccordionState(other, false);
                });

                // ...then open the clicked one (unless it was already open)
                if (!isOpen) {
                    setAccordionState(header, true);
                }
            });
        });
    });
}


/* ---------------------------------------------------------
   6. LIGHTBOX IMAGE VIEWER
   Any image with a data-lightbox attribute opens in a large
   full-screen viewer when clicked. Images that share the same
   data-lightbox name form a group you can move through with
   the arrow buttons or the keyboard.
--------------------------------------------------------- */

// Lets keyboard users reach the images with the Tab key
function makeImagesFocusable(root) {
    root.querySelectorAll('img[data-lightbox]').forEach(function (image) {
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', 'View larger image: ' + image.alt);
    });
}

function initLightbox() {
    // Only build the viewer if this page has images that need it. The adoption
    // page counts too, because its dog photos are added later by JavaScript.
    if (!document.querySelector('img[data-lightbox]') &&
        !document.getElementById('dog-search-input')) {
        return;
    }

    makeImagesFocusable(document);

    // Build the viewer piece by piece
    const overlay = createElement('div', 'lightbox', {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'Image viewer',
        hidden: ''
    });
    const closeButton = createElement('button', 'lightbox-close', {
        type: 'button',
        'aria-label': 'Close image viewer'
    });
    const prevButton = createElement('button', 'lightbox-prev', {
        type: 'button',
        'aria-label': 'Previous image'
    });
    const nextButton = createElement('button', 'lightbox-next', {
        type: 'button',
        'aria-label': 'Next image'
    });
    const figure = createElement('figure', 'lightbox-figure');
    const largeImage = createElement('img', 'lightbox-img');
    const caption = createElement('figcaption', 'lightbox-caption');

    closeButton.textContent = '\u00D7'; // multiplication sign used as an X
    prevButton.textContent = '\u2039';  // left arrow
    nextButton.textContent = '\u203A';  // right arrow

    figure.appendChild(largeImage);
    figure.appendChild(caption);
    overlay.appendChild(closeButton);
    overlay.appendChild(prevButton);
    overlay.appendChild(figure);
    overlay.appendChild(nextButton);
    document.body.appendChild(overlay);

    // Remember which images are in the current group, which one is
    // showing, and which image to return focus to when we close.
    let groupImages = [];
    let currentIndex = 0;
    let triggerImage = null;

    function showImage(index) {
        // Wrap around: after the last image comes the first, and so on
        currentIndex = (index + groupImages.length) % groupImages.length;

        const image = groupImages[currentIndex];
        largeImage.src = image.currentSrc || image.src;
        largeImage.alt = image.alt;
        caption.textContent = image.dataset.caption || image.alt;

        // Hide the arrows when there is only one image in the group
        const hasMany = groupImages.length > 1;
        prevButton.hidden = !hasMany;
        nextButton.hidden = !hasMany;
    }

    function openLightbox(image) {
        triggerImage = image;
        groupImages = Array.from(
            document.querySelectorAll('img[data-lightbox="' + image.dataset.lightbox + '"]')
        );

        showImage(groupImages.indexOf(image));
        overlay.hidden = false;
        document.body.classList.add('no-scroll');
        closeButton.focus();
    }

    function closeLightbox() {
        overlay.hidden = true;
        document.body.classList.remove('no-scroll');

        // Put keyboard focus back where the visitor was
        if (triggerImage) {
            triggerImage.focus();
        }
    }

    // Click on any lightbox image to open it. Listening on the whole
    // document means images added later by JavaScript work too.
    document.addEventListener('click', function (event) {
        const image = event.target.closest('img[data-lightbox]');
        if (image) {
            openLightbox(image);
        }
    });

    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', function () {
        showImage(currentIndex - 1);
    });
    nextButton.addEventListener('click', function () {
        showImage(currentIndex + 1);
    });

    // Clicking the dark area around the picture also closes the viewer
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closeLightbox();
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', function (event) {
        if (overlay.hidden) {
            // Enter or Space on a focused image opens it
            const focused = document.activeElement;
            if ((event.key === 'Enter' || event.key === ' ') &&
                focused && focused.matches('img[data-lightbox]')) {
                event.preventDefault();
                openLightbox(focused);
            }
            return;
        }

        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            showImage(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            showImage(currentIndex + 1);
        }
    });
}


/* ---------------------------------------------------------
   7. DOG DIRECTORY (dynamic content, search, filter and sort)
   The dogs are not typed into the HTML. Instead, JavaScript asks
   for the file data/dogs.json (an AJAX request using fetch), then
   builds a card for every dog. The search box, the filters and the
   sort menu rebuild the cards each time the visitor changes them.
--------------------------------------------------------- */

// Works out which age group a dog belongs to
function getAgeGroup(dog) {
    if (dog.age < 1) {
        return 'puppy';
    }
    if (dog.age < 4) {
        return 'young';
    }
    return 'adult';
}

// Builds one dog card (an <article>) from one dog's information
function buildDogCard(dog, onDetailsClick) {
    const card = createElement('article', 'dog-card');

    const image = createElement('img', null, {
        src: dog.image,
        alt: dog.alt,
        loading: 'lazy'
    });

    // Only real photos open in the lightbox; the placeholder picture does not
    if (dog.photo) {
        image.setAttribute('data-lightbox', 'dogs');
        image.setAttribute('data-caption', dog.name + ': ' + dog.ageLabel + ' old, ' +
            dog.temperament.charAt(0).toLowerCase() + dog.temperament.slice(1).replace(/\.$/, ''));
    }

    const name = createElement('h3');
    name.textContent = dog.name;

    const summary = createElement('p');
    summary.textContent = 'Age: ' + dog.ageLabel + ' | Breed: ' + dog.breed +
        ' | ' + dog.temperament;

    const detailsButton = createElement('button', 'details-button', {
        type: 'button',
        'aria-label': 'View details for ' + dog.name
    });
    detailsButton.textContent = 'View details';
    detailsButton.addEventListener('click', function () {
        onDetailsClick(dog, detailsButton);
    });

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(summary);
    card.appendChild(detailsButton);
    return card;
}

function initDogDirectory() {
    const list = document.getElementById('available-dogs');
    const searchInput = document.getElementById('dog-search-input');

    // Only run on the adoption page
    if (!list || !searchInput) {
        return;
    }

    const ageFilter = document.getElementById('dog-age-filter');
    const sizeFilter = document.getElementById('dog-size-filter');
    const sortMenu = document.getElementById('dog-sort');
    const resetButton = document.getElementById('dog-reset');
    const countMessage = document.getElementById('dog-count');
    const controls = [searchInput, ageFilter, sizeFilter, sortMenu, resetButton];

    const showDetails = initDogModal();
    let allDogs = [];

    // Works out which dogs to show, in which order, and redraws the cards
    function updateList() {
        // Split the search into words, so "lab large" must match both words
        const words = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);

        const matches = allDogs.filter(function (dog) {
            const searchableText = [dog.name, dog.breed, dog.size, dog.temperament, dog.ageLabel]
                .join(' ').toLowerCase();

            const matchesSearch = words.every(function (word) {
                return searchableText.indexOf(word) !== -1;
            });
            const matchesAge = ageFilter.value === 'all' || getAgeGroup(dog) === ageFilter.value;
            const matchesSize = sizeFilter.value === 'all' || dog.size === sizeFilter.value;

            return matchesSearch && matchesAge && matchesSize;
        });

        // Sort the matching dogs (ties are broken by name)
        matches.sort(function (a, b) {
            const byName = a.name.localeCompare(b.name);

            switch (sortMenu.value) {
                case 'name-desc':
                    return -byName;
                case 'age-asc':
                    return (a.age - b.age) || byName;
                case 'age-desc':
                    return (b.age - a.age) || byName;
                default:
                    return byName;
            }
        });

        // Clear the old cards and draw the new ones
        list.innerHTML = '';

        if (matches.length === 0) {
            const emptyMessage = createElement('p', 'dog-empty');
            emptyMessage.textContent = 'No dogs match your search. Try a different word or clear the filters.';
            list.appendChild(emptyMessage);
        } else {
            matches.forEach(function (dog) {
                list.appendChild(buildDogCard(dog, showDetails));
            });
        }

        makeImagesFocusable(list);
        countMessage.textContent = 'Showing ' + matches.length + ' of ' + allDogs.length + ' dogs';
    }

    // Ask for the dog data (AJAX), then show the dogs
    fetch('data/dogs.json')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Could not load the dog data (status ' + response.status + ')');
            }
            return response.json();
        })
        .then(function (data) {
            allDogs = data.dogs;
            updateList();

            // Redraw the list whenever the visitor changes any control
            searchInput.addEventListener('input', updateList);
            ageFilter.addEventListener('change', updateList);
            sizeFilter.addEventListener('change', updateList);
            sortMenu.addEventListener('change', updateList);
            resetButton.addEventListener('click', function () {
                searchInput.value = '';
                ageFilter.value = 'all';
                sizeFilter.value = 'all';
                sortMenu.value = 'name-asc';
                updateList();
                searchInput.focus();
            });
        })
        .catch(function (error) {
            // If the data cannot load, the three backup cards in the HTML stay
            // on the page and the search tools are switched off.
            console.error(error);
            controls.forEach(function (control) {
                control.disabled = true;
            });
            countMessage.textContent = 'The search tools are unavailable right now. Some of our dogs are shown below.';
        });
}


/* ---------------------------------------------------------
   8. DOG DETAILS POP-UP (modal window)
   Clicking "View details" on a card opens a window with more
   information about that dog. Returns a function that opens it.
--------------------------------------------------------- */
function initDogModal() {
    // Build the pop-up piece by piece
    const modal = createElement('div', 'modal', {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'modal-title',
        hidden: ''
    });
    const content = createElement('div', 'modal-content');
    const closeButton = createElement('button', 'modal-close', {
        type: 'button',
        'aria-label': 'Close dog details'
    });
    const image = createElement('img', 'modal-image');
    const body = createElement('div', 'modal-body');
    const title = createElement('h2', null, { id: 'modal-title' });
    const story = createElement('p', 'modal-story');
    const facts = createElement('dl', 'modal-facts');
    const enquireLink = createElement('a', 'cta-button', { href: 'enquiry.html' });

    closeButton.textContent = '\u00D7';

    body.appendChild(title);
    body.appendChild(story);
    body.appendChild(facts);
    body.appendChild(enquireLink);
    content.appendChild(closeButton);
    content.appendChild(image);
    content.appendChild(body);
    modal.appendChild(content);
    document.body.appendChild(modal);

    let triggerButton = null;

    function openModal(dog, button) {
        triggerButton = button;

        image.src = dog.image;
        image.alt = dog.alt;
        title.textContent = dog.name;
        story.textContent = dog.story;
        enquireLink.textContent = 'Enquire about adopting ' + dog.name;

        // Fill the list of facts (term + description pairs)
        facts.innerHTML = '';
        [
            ['Age', dog.ageLabel],
            ['Breed', dog.breed],
            ['Size', dog.size],
            ['Energy level', dog.energy],
            ['Good with kids', dog.goodWithKids],
            ['Good with other dogs', dog.goodWithDogs]
        ].forEach(function (fact) {
            const term = createElement('dt');
            const description = createElement('dd');
            term.textContent = fact[0];
            description.textContent = fact[1];
            facts.appendChild(term);
            facts.appendChild(description);
        });

        modal.hidden = false;
        document.body.classList.add('no-scroll');
        closeButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('no-scroll');

        // Return keyboard focus to the button that opened the pop-up
        if (triggerButton) {
            triggerButton.focus();
        }
    }

    closeButton.addEventListener('click', closeModal);

    // Clicking the dark area outside the window closes it
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (modal.hidden) {
            return;
        }

        if (event.key === 'Escape') {
            closeModal();
        }

        // Keep the Tab key inside the pop-up while it is open
        if (event.key === 'Tab') {
            const focusable = Array.from(modal.querySelectorAll('a[href], button'));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    return openModal;
}


/* ---------------------------------------------------------
   9. FORM HELPERS: CHECKING WHAT THE VISITOR TYPED
   Small reusable functions. Each "validate" function returns an
   error message to show, or an empty string when the value is fine.
--------------------------------------------------------- */

function validateName(value) {
    const name = value.trim();

    if (name === '') {
        return 'Please enter your full name.';
    }
    if (name.length < 2) {
        return 'Your name must be at least 2 characters long.';
    }
    // Letters (including accented ones), spaces, hyphens and apostrophes only
    if (!/^\p{L}[\p{L}' -]*$/u.test(name)) {
        return 'Your name can only contain letters, spaces, hyphens and apostrophes.';
    }
    return '';
}

function validateEmail(value) {
    const email = value.trim();

    if (email === '') {
        return 'Please enter your email address.';
    }
    // Pattern: something, then @, then something, then a dot and an ending
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return 'Please enter a valid email address, like name@example.com.';
    }
    return '';
}

function validatePhone(value, isRequired) {
    const phone = value.trim();

    if (phone === '') {
        return isRequired ? 'Please enter your phone number so that we can call you.' : '';
    }
    // Remove spaces, brackets and dashes, then expect 0 or +27 followed by 9 digits
    const digitsOnly = phone.replace(/[\s()-]/g, '');
    if (!/^(\+27|0)\d{9}$/.test(digitsOnly)) {
        return 'Please enter a valid South African number, like 012 345 6789 or +27 12 345 6789.';
    }
    return '';
}

function validateMessage(value, minimumLength) {
    const message = value.trim();

    if (message === '') {
        return 'Please enter your message.';
    }
    if (message.length < minimumLength) {
        return 'Your message must be at least ' + minimumLength + ' characters long (you have ' +
            message.length + ').';
    }
    return '';
}

// Shows (or clears) an error message under a form field and styles the field red
function setFieldError(field, errorId, message) {
    const errorBox = document.getElementById(errorId);
    errorBox.textContent = message;

    field.classList.toggle('invalid', message !== '');

    // Tells screen readers that this field has a problem (not used on fieldsets)
    if (field.matches('input, select, textarea')) {
        field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
    }
}

// Copies text to the clipboard, with a backup method for older browsers
function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
        const helper = createElement('textarea', null, { 'aria-hidden': 'true' });
        helper.value = text;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();

        const worked = document.execCommand('copy');
        document.body.removeChild(helper);

        if (worked) {
            resolve();
        } else {
            reject(new Error('Copy failed'));
        }
    });
}


/* ---------------------------------------------------------
   10. INTERACTIVE MAP (contact page)
   Uses Leaflet, a free map library loaded in contact.html, with
   map pictures from OpenStreetMap. Both shelters get a marker with a
   pop-up, and the buttons fly the map to the chosen location.
--------------------------------------------------------- */
function initMap() {
    const mapBox = document.getElementById('map');

    // Only run on the contact page
    if (!mapBox) {
        return;
    }

    const status = document.getElementById('map-status');

    // If the Leaflet library did not load (for example, no internet), say so
    // politely. The "Get directions" links still work without it.
    if (typeof L === 'undefined') {
        status.textContent = 'The interactive map could not be loaded. Please use the "Get directions" links to see our locations on Google Maps.';
        return;
    }

    const locations = {
        pretoria: {
            name: 'Main Shelter - Pretoria',
            coordinates: [-25.7479, 28.2293],
            description: 'Our main shelter, open Monday - Saturday, 9am - 4pm.'
        },
        centurion: {
            name: 'Satellite Adoption Centre - Centurion',
            coordinates: [-25.8603, 28.1894],
            description: 'Meet dogs ready for adoption, Monday - Saturday, 9am - 4pm.'
        }
    };

    // Create the map. Scroll-wheel zoom stays off until the map is clicked,
    // so visitors do not get stuck zooming when they just scroll the page.
    const map = L.map(mapBox, { scrollWheelZoom: false });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('focus', function () {
        map.scrollWheelZoom.enable();
    });
    map.on('blur', function () {
        map.scrollWheelZoom.disable();
    });

    // Add one marker per location, each with a pop-up built from the information above
    const markers = {};
    const allCoordinates = [];

    Object.keys(locations).forEach(function (key) {
        const place = locations[key];

        const popup = createElement('div');
        const heading = createElement('strong');
        const text = createElement('p');
        const directions = createElement('a', null, {
            href: 'https://www.google.com/maps/dir/?api=1&destination=' + place.coordinates.join(','),
            target: '_blank',
            rel: 'noopener noreferrer'
        });

        heading.textContent = place.name;
        text.textContent = place.description;
        directions.textContent = 'Get directions';
        popup.appendChild(heading);
        popup.appendChild(text);
        popup.appendChild(directions);

        markers[key] = L.marker(place.coordinates, { title: place.name, alt: place.name })
            .addTo(map)
            .bindPopup(popup);

        allCoordinates.push(place.coordinates);
    });

    // A "show both" button so visitors can zoom back out
    const showBothButton = createElement('button', 'secondary-button map-button map-both-button', {
        type: 'button'
    });
    showBothButton.textContent = 'Show both locations';
    mapBox.parentNode.insertBefore(showBothButton, mapBox);

    const locationButtons = document.querySelectorAll('.map-button[data-location]');

    function showBoth() {
        map.closePopup();
        map.fitBounds(allCoordinates, { padding: [50, 50] });
        locationButtons.forEach(function (button) {
            button.setAttribute('aria-pressed', 'false');
        });
        status.textContent = 'Showing both of our locations on the map.';
    }

    function showLocation(key) {
        const place = locations[key];

        map.flyTo(place.coordinates, 14);
        markers[key].openPopup();

        locationButtons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.dataset.location === key));
        });
        status.textContent = 'Showing ' + place.name + ' on the map.';
    }

    locationButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            showLocation(button.dataset.location);
        });
    });
    showBothButton.addEventListener('click', showBoth);

    // Start with both locations in view
    map.fitBounds(allCoordinates, { padding: [50, 50] });
}


/* ---------------------------------------------------------
   11. CONTACT FORM: CHECKING, THEN BUILDING AN EMAIL
   1. Each field is checked when the visitor leaves it, and again
      for every field when they press the button.
   2. If everything is correct, the details are put together into
      an email addressed to Paws Haven.
   3. The visitor reviews the email, then opens it in their email
      app (or copies it) to send it.
--------------------------------------------------------- */
const CONTACT_EMAIL = 'info@pawshaven.org';

// Puts the visitor's answers together into an email
function buildContactEmail(details) {
    const subject = 'Website enquiry: ' + details.reason + ' - ' + details.name;

    const body = [
        'Hello Paws Haven team,',
        '',
        'Name: ' + details.name,
        'Email: ' + details.email,
        'Phone: ' + (details.phone || 'Not provided'),
        'Preferred way to reply: ' + details.method,
        'Reason for contacting you: ' + details.reason,
        '',
        'Message:',
        details.message,
        '',
        'Send me news and updates: ' + (details.updates ? 'Yes' : 'No')
    ].join('\n');

    // encodeURIComponent makes the text safe to place inside a link.
    // Email links use \r\n for a new line.
    const mailtoLink = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body).replace(/%0A/g, '%0D%0A');

    return { to: CONTACT_EMAIL, subject: subject, body: body, mailto: mailtoLink };
}

function initContactForm() {
    const form = document.getElementById('contact-form-element');

    // Only run on the contact page
    if (!form) {
        return;
    }

    const nameInput = document.getElementById('cf-name');
    const emailInput = document.getElementById('cf-email');
    const phoneInput = document.getElementById('cf-phone');
    const methodGroup = form.querySelector('fieldset');
    const methodRadios = form.querySelectorAll('input[name="cf-contact-method"]');
    const reasonSelect = document.getElementById('cf-reason');
    const messageInput = document.getElementById('cf-message');
    const messageCount = document.getElementById('cf-message-count');
    const updatesBox = document.getElementById('cf-updates');
    const consentBox = document.getElementById('cf-consent');
    const summary = document.getElementById('form-summary');
    const MIN_MESSAGE_LENGTH = 10;

    function getSelectedMethod() {
        const chosen = form.querySelector('input[name="cf-contact-method"]:checked');
        return chosen ? chosen.value : '';
    }

    // One entry per field: the element to mark, where its error appears,
    // and a function that returns the error message (or '' if fine).
    const checks = [
        { field: nameInput, errorId: 'cf-name-error', focusOn: nameInput,
          check: function () { return validateName(nameInput.value); } },
        { field: emailInput, errorId: 'cf-email-error', focusOn: emailInput,
          check: function () { return validateEmail(emailInput.value); } },
        // The phone number is optional, unless they asked us to reply by phone
        { field: phoneInput, errorId: 'cf-phone-error', focusOn: phoneInput,
          check: function () { return validatePhone(phoneInput.value, getSelectedMethod() === 'Phone'); } },
        { field: methodGroup, errorId: 'cf-contact-method-error', focusOn: methodRadios[0],
          check: function () { return getSelectedMethod() === '' ? 'Please choose how we should reply to you.' : ''; } },
        { field: reasonSelect, errorId: 'cf-reason-error', focusOn: reasonSelect,
          check: function () { return reasonSelect.value === '' ? 'Please choose what your message is about.' : ''; } },
        { field: messageInput, errorId: 'cf-message-error', focusOn: messageInput,
          check: function () { return validateMessage(messageInput.value, MIN_MESSAGE_LENGTH); } },
        { field: consentBox, errorId: 'cf-consent-error', focusOn: consentBox,
          check: function () { return consentBox.checked ? '' : 'Please tick the box to confirm that we may contact you.'; } }
    ];

    // Runs one check and shows its result. Returns true when the field is fine.
    function runCheck(item) {
        const message = item.check();
        setFieldError(item.field, item.errorId, message);
        return message === '';
    }

    // Check each field when the visitor leaves it, and keep re-checking
    // while they fix a field that is already showing an error.
    checks.forEach(function (item) {
        const controls = item.field === methodGroup ? methodRadios : [item.field];

        controls.forEach(function (control) {
            const isChoice = control.matches('select, input[type="radio"], input[type="checkbox"]');

            if (isChoice) {
                control.addEventListener('change', function () {
                    runCheck(item);
                });
            } else {
                control.addEventListener('blur', function () {
                    runCheck(item);
                });
                control.addEventListener('input', function () {
                    if (item.field.classList.contains('invalid')) {
                        runCheck(item);
                    }
                });
            }
        });
    });

    // Choosing "Phone" makes the phone number required, so re-check it
    methodRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (phoneInput.value.trim() !== '' || phoneInput.classList.contains('invalid')) {
                runCheck(checks[2]);
            }
        });
    });

    // Live character counter under the message box
    messageInput.addEventListener('input', function () {
        messageCount.textContent = messageInput.value.length + ' / ' + messageInput.maxLength + ' characters';
    });

    // ----- The "your email is ready" panel (built once, hidden until needed) -----
    const panelSection = document.getElementById('contact-form');
    const panel = createElement('div', 'email-ready', { hidden: '' });
    const panelHeading = createElement('h3', null, { tabindex: '-1' });
    const panelIntro = createElement('p');
    const panelPreview = createElement('pre', 'email-preview');
    const panelActions = createElement('div', 'email-actions');
    const openLink = createElement('a', 'cta-button');
    const copyButton = createElement('button', 'secondary-button', { type: 'button' });
    const editButton = createElement('button', 'secondary-button', { type: 'button' });
    const panelStatus = createElement('p', 'copy-status', { 'aria-live': 'polite' });
    const panelHint = createElement('p', 'email-hint');

    panelHeading.textContent = 'Your email is ready';
    panelIntro.textContent = 'Check your email below. When you are happy with it, choose "Open in my email app" and press send there.';
    openLink.textContent = 'Open in my email app';
    copyButton.textContent = 'Copy email text';
    editButton.textContent = 'Edit my message';
    panelHint.textContent = 'If nothing opens, choose "Copy email text" and paste it into a new email to ' + CONTACT_EMAIL + '.';

    panelActions.appendChild(openLink);
    panelActions.appendChild(copyButton);
    panelActions.appendChild(editButton);
    panel.appendChild(panelHeading);
    panel.appendChild(panelIntro);
    panel.appendChild(panelPreview);
    panel.appendChild(panelActions);
    panel.appendChild(panelStatus);
    panel.appendChild(panelHint);
    panelSection.appendChild(panel);

    let currentEmail = null;

    copyButton.addEventListener('click', function () {
        const fullText = 'To: ' + currentEmail.to + '\nSubject: ' + currentEmail.subject +
            '\n\n' + currentEmail.body;

        copyTextToClipboard(fullText)
            .then(function () {
                panelStatus.textContent = 'Email text copied. You can now paste it into a new email.';
            })
            .catch(function () {
                panelStatus.textContent = 'Sorry, we could not copy automatically. Please select the text above and copy it.';
            });
    });

    editButton.addEventListener('click', function () {
        panel.hidden = true;
        form.hidden = false;
        panelStatus.textContent = '';
        messageInput.focus();
    });

    // ----- What happens when the visitor presses "Prepare My Email" -----
    form.addEventListener('submit', function (event) {
        // Stop the browser from reloading the page
        event.preventDefault();

        // Run every check (not just the first one that fails)
        const failed = checks.filter(function (item) {
            return !runCheck(item);
        });

        if (failed.length > 0) {
            summary.textContent = failed.length === 1
                ? 'Please fix the 1 highlighted field below.'
                : 'Please fix the ' + failed.length + ' highlighted fields below.';
            summary.hidden = false;
            failed[0].focusOn.focus();
            return;
        }

        summary.hidden = true;

        currentEmail = buildContactEmail({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            method: getSelectedMethod(),
            reason: reasonSelect.value,
            message: messageInput.value.trim(),
            updates: updatesBox.checked
        });

        panelPreview.textContent = 'To: ' + currentEmail.to + '\nSubject: ' + currentEmail.subject +
            '\n\n' + currentEmail.body;
        openLink.setAttribute('href', currentEmail.mailto);

        form.hidden = true;
        panel.hidden = false;
        panelHeading.focus();
    });
}


/* ---------------------------------------------------------
   12. ENQUIRY FORM: CHECKING, SENDING WITH AJAX, SHOWING A RESPONSE
   1. Extra questions appear depending on what the visitor is
      interested in (volunteering, sponsoring or both).
   2. Every field is checked, with a clear message for each problem.
   3. The enquiry is sent in the background with fetch (AJAX), so the
      page never reloads.
   4. A personal response then appears, with the cost and availability
      that match what the visitor asked about.
--------------------------------------------------------- */

// The address the enquiry is sent to. This is JSONPlaceholder, a free test
// service that accepts any data and replies as a real server would. To send
// enquiries to a real inbox, replace this address with a form service address
// (for example one from Formspree) and the rest of the code stays the same.
const ENQUIRY_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

// Works out the date of our next volunteer orientation: the first
// Saturday of the month (always at 10:00), starting from the given day.
function getNextOrientationDate(fromDate) {
    function firstSaturdayOf(year, month) {
        const firstOfMonth = new Date(year, month, 1);
        // getDay(): Sunday is 0 ... Saturday is 6
        const daysUntilSaturday = (6 - firstOfMonth.getDay() + 7) % 7;
        return new Date(year, month, 1 + daysUntilSaturday);
    }

    const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    let next = firstSaturdayOf(today.getFullYear(), today.getMonth());

    // If this month's session is today or already over, use next month's
    if (next <= today) {
        next = firstSaturdayOf(today.getFullYear(), today.getMonth() + 1);
    }
    return next;
}

// Turns the visitor's answers into the facts shown in the response.
// Returns a list of blocks, each with a heading and label/value pairs.
function buildEnquiryResponse(details, orientationDate) {
    const blocks = [];
    const wantsVolunteer = details.interest === 'volunteer' || details.interest === 'both';
    const wantsSponsor = details.interest === 'sponsor' || details.interest === 'both';

    if (wantsVolunteer) {
        const dateText = orientationDate.toLocaleDateString('en-ZA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        blocks.push({
            heading: 'Volunteering',
            facts: [
                ['Cost', 'Free. Volunteering costs you nothing, and we provide everything you need on the day.'],
                ['Next orientation', dateText + ' at 10:00 at our Pretoria shelter.'],
                ['Shifts', 'Monday to Saturday, 9am to 4pm. We ask for at least 4 hours a week.'],
                ['Your availability', details.availability.join(', ')]
            ]
        });
    }

    if (wantsSponsor) {
        const isMonthly = details.sponsorPlan === 'monthly';

        blocks.push({
            heading: 'Sponsoring a dog',
            facts: [
                ['Cost', isMonthly
                    ? 'R350 per month, which covers food and routine care for one dog. You can cancel at any time.'
                    : 'R1,200 once-off, which covers sterilisation, vaccinations and a microchip for one dog.'],
                ['Availability', details.sponsorDog
                    ? details.sponsorDog + ' is currently looking for a sponsor.'
                    : 'We will match you with a dog that currently needs a sponsor.'],
                ['What you receive', 'A photo and health update about your dog every month.']
            ]
        });
    }

    return blocks;
}

// Makes a reference number such as PH-20261023-4821
function makeReferenceNumber(date) {
    const pad = function (number) {
        return String(number).padStart(2, '0');
    };
    const datePart = date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate());
    const randomPart = String(Math.floor(1000 + Math.random() * 9000));
    return 'PH-' + datePart + '-' + randomPart;
}

function initEnquiryForm() {
    const form = document.getElementById('enquiry-form-element');

    // Only run on the enquiry page
    if (!form) {
        return;
    }

    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const typeSelect = document.getElementById('enquiry-type');
    const volunteerBox = document.getElementById('volunteer-options');
    const availabilityBoxes = form.querySelectorAll('input[name="availability"]');
    const availabilityGroup = volunteerBox.querySelector('fieldset');
    const sponsorBox = document.getElementById('sponsor-options');
    const sponsorDogSelect = document.getElementById('sponsor-dog');
    const planRadios = form.querySelectorAll('input[name="sponsor-plan"]');
    const planGroup = sponsorBox.querySelector('fieldset');
    const messageInput = document.getElementById('message');
    const messageCount = document.getElementById('message-count');
    const consentBox = document.getElementById('enquiry-consent');
    const summary = document.getElementById('enquiry-summary');
    const submitButton = document.getElementById('enquiry-submit');
    const status = document.getElementById('enquiry-status');
    const MIN_MESSAGE_LENGTH = 20;

    // ----- Helpers that read the current answers -----
    function wantsVolunteer() {
        return typeSelect.value === 'volunteer' || typeSelect.value === 'both';
    }

    function wantsSponsor() {
        return typeSelect.value === 'sponsor' || typeSelect.value === 'both';
    }

    function getChosenAvailability() {
        return Array.from(availabilityBoxes)
            .filter(function (box) { return box.checked; })
            .map(function (box) { return box.value; });
    }

    function getChosenPlan() {
        const chosen = form.querySelector('input[name="sponsor-plan"]:checked');
        return chosen ? chosen.value : '';
    }

    // ----- Fill the "which dog" menu from the same data file as the adoption page -----
    fetch('data/dogs.json')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Could not load the dog data');
            }
            return response.json();
        })
        .then(function (data) {
            // List the dogs A to Z, the same default order as the adoption page
            data.dogs.slice().sort(function (a, b) {
                return a.name.localeCompare(b.name);
            }).forEach(function (dog) {
                const option = createElement('option', null, { value: dog.name });
                option.textContent = dog.name + ' (' + dog.ageLabel + ', ' + dog.breed + ')';
                sponsorDogSelect.appendChild(option);
            });
        })
        .catch(function (error) {
            // The menu simply keeps its "No preference" choice
            console.error(error);
        });

    // ----- The checks. "isActive" skips questions that are not showing. -----
    const checks = [
        { field: nameInput, errorId: 'fullname-error', focusOn: nameInput,
          check: function () { return validateName(nameInput.value); } },
        { field: emailInput, errorId: 'email-error', focusOn: emailInput,
          check: function () { return validateEmail(emailInput.value); } },
        { field: phoneInput, errorId: 'phone-error', focusOn: phoneInput,
          check: function () { return validatePhone(phoneInput.value, false); } },
        { field: typeSelect, errorId: 'enquiry-type-error', focusOn: typeSelect,
          check: function () { return typeSelect.value === '' ? 'Please choose what you are interested in.' : ''; } },
        { field: availabilityGroup, errorId: 'availability-error', focusOn: availabilityBoxes[0],
          isActive: wantsVolunteer,
          check: function () { return getChosenAvailability().length === 0 ? 'Please choose at least one time that suits you.' : ''; } },
        { field: planGroup, errorId: 'sponsor-plan-error', focusOn: planRadios[0],
          isActive: wantsSponsor,
          check: function () { return getChosenPlan() === '' ? 'Please choose how you would like to sponsor.' : ''; } },
        { field: messageInput, errorId: 'message-error', focusOn: messageInput,
          check: function () { return validateMessage(messageInput.value, MIN_MESSAGE_LENGTH); } },
        { field: consentBox, errorId: 'enquiry-consent-error', focusOn: consentBox,
          check: function () { return consentBox.checked ? '' : 'Please tick the box to confirm that we may contact you.'; } }
    ];

    // Runs one check. Returns true when the field is fine (or not showing).
    function runCheck(item) {
        if (item.isActive && !item.isActive()) {
            setFieldError(item.field, item.errorId, '');
            return true;
        }
        const message = item.check();
        setFieldError(item.field, item.errorId, message);
        return message === '';
    }

    // Check each field when the visitor leaves it, and keep re-checking
    // while they fix a field that is already showing an error.
    checks.forEach(function (item) {
        let controls = [item.field];
        if (item.field === availabilityGroup) {
            controls = availabilityBoxes;
        } else if (item.field === planGroup) {
            controls = planRadios;
        }

        controls.forEach(function (control) {
            const isChoice = control.matches('select, input[type="radio"], input[type="checkbox"]');

            if (isChoice) {
                control.addEventListener('change', function () {
                    runCheck(item);
                });
            } else {
                control.addEventListener('blur', function () {
                    runCheck(item);
                });
                control.addEventListener('input', function () {
                    if (item.field.classList.contains('invalid')) {
                        runCheck(item);
                    }
                });
            }
        });
    });

    // Show only the extra questions that match what the visitor chose
    typeSelect.addEventListener('change', function () {
        volunteerBox.hidden = !wantsVolunteer();
        sponsorBox.hidden = !wantsSponsor();

        // Clear any old errors from questions that just disappeared
        checks.forEach(function (item) {
            if (item.isActive && !item.isActive()) {
                runCheck(item);
            }
        });
    });

    messageInput.addEventListener('input', function () {
        messageCount.textContent = messageInput.value.length + ' / ' + messageInput.maxLength + ' characters';
    });

    // ----- The response panel (built once, hidden until needed) -----
    const formSection = document.getElementById('enquiry-form');
    const response = createElement('div', 'enquiry-response', { hidden: '' });
    const responseHeading = createElement('h3', null, { tabindex: '-1' });
    const responseIntro = createElement('p');
    const responseBlocks = createElement('div', 'response-blocks');
    const responseNext = createElement('p');
    const newEnquiryButton = createElement('button', 'secondary-button', { type: 'button' });

    newEnquiryButton.textContent = 'Make another enquiry';
    response.appendChild(responseHeading);
    response.appendChild(responseIntro);
    response.appendChild(responseBlocks);
    response.appendChild(responseNext);
    response.appendChild(newEnquiryButton);
    formSection.appendChild(response);

    newEnquiryButton.addEventListener('click', function () {
        form.reset();
        volunteerBox.hidden = true;
        sponsorBox.hidden = true;
        messageCount.textContent = '0 / ' + messageInput.maxLength + ' characters';
        checks.forEach(function (item) {
            setFieldError(item.field, item.errorId, '');
        });
        status.textContent = '';
        status.classList.remove('error');
        response.hidden = true;
        form.hidden = false;
        nameInput.focus();
    });

    // Fills the response panel with the personal response
    function showResponse(details) {
        const now = new Date();
        const firstName = details.name.split(/\s+/)[0];

        responseHeading.textContent = 'Thank you, ' + firstName + '!';
        // The reference number sits in its own bold element so it never splits across two lines
        const reference = createElement('strong', 'reference-number');
        reference.textContent = makeReferenceNumber(now);
        responseIntro.textContent = 'We have received your enquiry. Your reference number is ';
        responseIntro.appendChild(reference);
        responseIntro.appendChild(document.createTextNode('.'));

        responseBlocks.innerHTML = '';
        buildEnquiryResponse(details, getNextOrientationDate(now)).forEach(function (block) {
            const card = createElement('div', 'response-card');
            const heading = createElement('h4');
            const facts = createElement('dl', 'response-facts');

            heading.textContent = block.heading;
            block.facts.forEach(function (fact) {
                const term = createElement('dt');
                const description = createElement('dd');
                term.textContent = fact[0];
                description.textContent = fact[1];
                facts.appendChild(term);
                facts.appendChild(description);
            });

            card.appendChild(heading);
            card.appendChild(facts);
            responseBlocks.appendChild(card);
        });

        responseNext.textContent = 'Our team will email you at ' + details.email +
            ' within 2 working days with the next steps. No payment is taken on this page.';

        form.hidden = true;
        response.hidden = false;
        responseHeading.focus();
    }

    // ----- What happens when the visitor presses "Submit Enquiry" -----
    form.addEventListener('submit', function (event) {
        // Stop the browser from reloading the page
        event.preventDefault();

        // Run every check (not just the first one that fails)
        const failed = checks.filter(function (item) {
            return !runCheck(item);
        });

        if (failed.length > 0) {
            summary.textContent = failed.length === 1
                ? 'Please fix the 1 highlighted field below.'
                : 'Please fix the ' + failed.length + ' highlighted fields below.';
            summary.hidden = false;
            failed[0].focusOn.focus();
            return;
        }

        summary.hidden = true;

        // Collect the answers into one object
        const details = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            interest: typeSelect.value,
            availability: wantsVolunteer() ? getChosenAvailability() : [],
            sponsorDog: wantsSponsor() ? sponsorDogSelect.value : '',
            sponsorPlan: wantsSponsor() ? getChosenPlan() : '',
            message: messageInput.value.trim()
        };

        // Show that something is happening, and stop double-clicks
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        status.classList.remove('error');
        status.textContent = 'Sending your enquiry...';

        // Give up after 10 seconds instead of waiting forever
        const controller = new AbortController();
        const timer = setTimeout(function () {
            controller.abort();
        }, 10000);

        // The AJAX request: send the answers to the server in the background
        fetch(ENQUIRY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details),
            signal: controller.signal
        })
            .then(function (serverReply) {
                if (!serverReply.ok) {
                    throw new Error('The server replied with status ' + serverReply.status);
                }
                return serverReply.json();
            })
            .then(function () {
                status.textContent = '';
                showResponse(details);
            })
            .catch(function (error) {
                console.error(error);
                status.classList.add('error');
                status.textContent = 'Sorry, we could not send your enquiry just now. Please check your internet connection and try again, or email info@pawshaven.org.';
            })
            .finally(function () {
                clearTimeout(timer);
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Enquiry';
            });
    });
}


/* ---------------------------------------------------------
   13. START EVERYTHING WHEN THE PAGE HAS LOADED
--------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Tells the CSS that JavaScript is working (used by the reveal animation)
    document.documentElement.classList.add('js');

    highlightActiveNavLink();
    initScrollReveal();
    initBackToTop();
    initAccordions();
    initLightbox();
    initDogDirectory();
    initMap();
    initContactForm();
    initEnquiryForm();
});
