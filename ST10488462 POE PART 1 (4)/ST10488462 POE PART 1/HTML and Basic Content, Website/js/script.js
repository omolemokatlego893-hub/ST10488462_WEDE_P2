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
   9. Start everything when the page has loaded
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
    // Get just the file name from the address, e.g. "about.html"
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach(function (link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            // Helps screen readers announce which page is current
            link.setAttribute('aria-current', 'page');
        }
    });
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
   9. START EVERYTHING WHEN THE PAGE HAS LOADED
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
});
