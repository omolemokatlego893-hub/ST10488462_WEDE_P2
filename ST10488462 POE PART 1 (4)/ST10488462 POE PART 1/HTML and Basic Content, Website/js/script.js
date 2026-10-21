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
   7. Start everything when the page has loaded
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
    // Only build the viewer if this page has images that need it
    if (!document.querySelector('img[data-lightbox]')) {
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
   7. START EVERYTHING WHEN THE PAGE HAS LOADED
--------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Tells the CSS that JavaScript is working (used by the reveal animation)
    document.documentElement.classList.add('js');

    highlightActiveNavLink();
    initScrollReveal();
    initBackToTop();
    initAccordions();
    initLightbox();
});
