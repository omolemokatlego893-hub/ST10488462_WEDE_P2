# Paws Haven Animal Rescue — Website Project

**Live website:** https://pawshaven-st10488462.netlify.app

## Student Information
- **Student Name:** Katleho Magano
- **Student Number:** ST10488462
- **Module:** WEDE5020 – Web Development Introduction
- **Institution:** The Independent Institute of Education (The IIE)
- **Assignment:** Portfolio of Evidence (POE) – Part 3

## Project Overview
This repository contains Parts 1, 2 and 3 of a three-part Portfolio of Evidence for the WEDE5020 module. The project is a website for **Paws Haven Animal Rescue**, a fictional animal rescue organisation that shelters, medically treats, and rehomes rescued dogs.

- **Part 1** built the foundation of the website using semantic HTML: structure, content, and navigation.
- **Part 2** added CSS styling and responsive design, giving the site a cohesive visual identity that works on desktop, tablet, and mobile screens.
- **Part 3** adds JavaScript interactivity (a photo gallery lightbox, an FAQ accordion, scroll animations, an interactive map, and a searchable dog directory), validated enquiry and contact forms, search engine optimisation (SEO), and deployment of the finished website on a free hosting platform (Netlify).

## Feedback on Previous Parts
| Part | Result | Feedback received | Action taken |
|---|---|---|---|
| Part 1 (HTML) | 98% | No individual corrective comments | Nothing to correct; Part 2 went ahead as planned |
| Part 2 (CSS) | 96% | No individual corrective comments | Nothing to correct; the Part 2 work was kept as the base for Part 3 and built on, not replaced |

Because no corrections were requested, the changelog below records the Part 2 feedback review as a dated entry, followed by the full record of Part 3 development.

## Website Goals / Objectives
- Raise awareness of Paws Haven Animal Rescue and the work it does
- Showcase dogs currently available for adoption, and make them easy to search and filter
- Make it easy for visitors to volunteer, sponsor a dog, or make an enquiry
- Provide clear contact details and shelter locations on an interactive map
- Build a simple, accessible, and easy-to-navigate site structure that works on desktop, tablet, and mobile
- Be easy for people to find through search engines and easy to share on social media

## Key Features / Functionality
**Foundation (Parts 1 and 2)**
- Semantic HTML structure using `header`, `nav`, `main`, `footer` on every page
- Consistent navigation menu across all 5 pages
- External stylesheet (`style.css`) with a CSS reset, colour and spacing variables, a typography scale, Flexbox and CSS Grid layouts, and hover, focus and active states
- Responsive design with breakpoints at 768px (tablet) and 480px (mobile)

**Interactive elements (Part 3)**
- **Photo gallery with lightbox** on the About Us page: click any photo to enlarge it, move between photos with the arrow buttons or the keyboard arrow keys, close with the X button, the Esc key, or by clicking outside the photo. The dog photos on the Adoption page open in the same lightbox.
- **FAQ accordion** on the Adoption page: click a question to open its answer; only one answer is open at a time.
- **Animations and transitions:** sections fade up as they scroll into view, a back-to-top button appears after scrolling, buttons and gallery photos react on hover, and panels slide open. Animations switch off for visitors who have asked their device to reduce motion.
- **Navigation highlighting:** the link for the page the visitor is on is highlighted automatically.
- **Interactive map** on the Contact page (Leaflet with OpenStreetMap): markers and pop-ups for the Pretoria shelter and the Centurion adoption centre, "Show on map" buttons that fly the map to a location, a "Show both locations" button, and "Get directions" links.

**Dynamic content (Part 3)**
- The dogs on the Adoption page are loaded from `data/dogs.json` using `fetch` (AJAX) and built into cards with JavaScript.
- **Search, filter and sort:** a search box (name, breed or personality), an age filter, a size filter, a sort menu (name A–Z or Z–A, youngest or oldest first), a "Clear filters" button, and a live count of results ("Showing 3 of 6 dogs").
- **Dog details pop-up (modal window):** each dog has a "View details" button that opens a window with the dog's story, age, breed, size, energy level, and how they get on with kids and other dogs.

**Forms (Part 3)**
- **Enquiry form (Volunteer / Sponsor):** text, email, phone, dropdown, checkbox, radio and textarea controls. Extra questions appear depending on whether the visitor chooses volunteering, sponsoring, or both. Every field is validated with a clear error message. The enquiry is sent in the background with `fetch` (AJAX), and a personal response then appears showing the cost and availability that match the visitor's choices (for volunteers: free, plus the date of the next orientation session; for sponsors: R350 per month or R1,200 once-off, and the chosen dog's availability), together with a reference number.
- **Contact form:** text, email, phone, radio buttons, dropdown, textarea with a character counter, and checkboxes. Every field is validated with a clear error message (including South African phone number format and message length). When everything is correct, the details are compiled into an email addressed to info@pawshaven.org that the visitor can review, open in their email app, or copy.

**Search engine optimisation and performance (Part 3)**
- Unique title tags, meta descriptions and meta keywords on every page
- One unique `h1` per page and a logical heading structure
- Descriptive image file names and descriptive alt text; image width and height set; lazy loading
- Canonical links, Open Graph and Twitter tags for social sharing, and social share links in the footer
- Structured data (schema.org `AnimalShelter`) describing both locations for local search
- `robots.txt`, `sitemap.xml`, a custom 404 page, and security headers
- Internal links between pages in the page content and in the footer

## Timeline / Milestones
| Milestone | Status |
|---|---|
| Organisation selection and proposals | Complete |
| Content research and sourcing | Complete |
| Sitemap design | Complete |
| File and folder structure setup | Complete |
| HTML pages built (5 pages) | Complete |
| Images sourced and added | Complete |
| GitHub repository setup | Complete |
| Part 1 submission | Complete |
| Part 1 feedback reviewed (98%, no corrections needed) | Complete |
| External stylesheet, layout and responsive design | Complete |
| Part 2 submission | Complete |
| Part 2 feedback reviewed (96%, no corrections needed) | Complete |
| Interactive elements (lightbox, accordion, animations) | Complete |
| Dynamic dog directory with search, filter and sort | Complete |
| Interactive map and validated contact form | Complete |
| Validated enquiry form with AJAX and response | Complete |
| SEO (titles, descriptions, robots.txt, sitemap.xml) | Complete |
| Website deployed on Netlify | Complete |
| Part 3 submission | Complete |

## Part 1 Details
- Two website project proposals (Paws Haven Animal Rescue and Sweet Crumb Bakery), with Paws Haven Animal Rescue selected as the chosen organisation
- Research and sourcing of content used to inform the website's copy and structure
- A sitemap outlining the site's page hierarchy
- A file and folder structure separating images and scripts from the HTML files
- Five HTML pages: `index.html`, `about.html`, `services.html`, `enquiry.html`, `contact.html`

## Part 2 Details
- A single external stylesheet (`style.css`) linked to all five HTML pages
- A CSS reset and a base style layer using CSS custom properties (variables) for colours, spacing and typography
- Typography styling with a consistent font scale
- Layout built with Flexbox (navigation, dog cards) and CSS Grid (homepage "What We Do" section, About Us Mission and Vision section)
- A warm, cohesive colour palette suited to an animal rescue organisation
- Interactive pseudo-classes (`:hover`, `:focus`, `:active`, `:focus-visible`)
- Responsive design with two breakpoints (768px for tablet, 480px for mobile)
- A separate Part 2 documentation report explaining how each rubric requirement was met

## Part 3 Details

### 1. Interactive elements
All JavaScript lives in one commented file, `js/script.js`, linked to every page with `defer` so it runs after the page has loaded. Each feature first checks whether it is needed on the current page, so the same file is safe to load everywhere. The accordion uses a button with `aria-expanded` and `aria-controls`; the lightbox and the dog details pop-up have `role="dialog"`, can be closed with the Esc key, trap or return keyboard focus, and stop the page behind from scrolling. Matching styles were added to `style.css` (sections 13 to 29).

### 2. Interactive map
The two Google Maps embeds from Part 1 were replaced with a Leaflet map. Leaflet is loaded from a CDN with Subresource Integrity (`integrity` attributes) so the browser checks the files have not been altered, and only on the Contact page for page speed. If the map library cannot load, a friendly message appears and the "Get directions" links still work.

### 3. Dynamic content, search, filter and sort
`data/dogs.json` holds six dogs. `fetch('data/dogs.json')` loads them, and `buildDogCard()` creates a card for each one. The search splits what the visitor types into words so that every word must match; the filters and sort menu then work on the matching dogs, and the list is redrawn each time something changes. If the data file cannot be loaded, the three original cards in the HTML remain and the controls are switched off with an explanatory message. Three dogs (Daisy, Rocky and Bella) use a "Photo coming soon" placeholder image.

### 4. Forms and validation
Both forms use `novalidate` so that custom, friendlier messages replace the browser's pop-ups. Each field is checked when the visitor leaves it, and every field is checked again on submit, with a summary message ("Please fix the 3 highlighted fields below") and focus moved to the first problem. Errors are linked to their fields with `aria-describedby` and `aria-invalid` for screen readers. Validation rules include: name (letters, spaces, hyphens and apostrophes, at least 2 characters), email format, South African phone numbers (`0` or `+27` followed by 9 digits, required only if the visitor asks to be called), message length (minimum and maximum), required dropdown, radio and checkbox choices, and consent. The enquiry form sends its data with `fetch` (a POST request with JSON) and shows "Sending..." while it waits; failures and timeouts show a clear message and keep the visitor's answers.

### 5. Search engine optimisation (SEO)
- **On-page:** unique title tags (60 characters or fewer), unique meta descriptions (120 to 160 characters), meta keywords, one `h1` per page, descriptive image file names (for example `dog-buddy.jpg`, `team-photo.jpg`) and alt text, short lower-case page names (Netlify serves them as clean addresses such as `/services`), internal links in the page content and footer, and a mobile-friendly responsive layout with the viewport meta tag.
- **Off-page and local SEO:** Open Graph and Twitter tags control how pages look when shared; each page has Facebook, X and WhatsApp share links; structured data describes the Pretoria and Centurion locations with address, coordinates, phone number and opening hours; backlinks would be pursued by listing the charity with local animal welfare directories and community pages that link back to the website.
- **Additional:** `robots.txt` (allows all crawlers and points to the sitemap), `sitemap.xml` (all five pages), a custom 404 page that is excluded from search results, image optimisation and lazy loading, scripts loaded with `defer`, HTTPS provided automatically by Netlify, and security headers in `_headers` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).

### 6. Deployment
The website is deployed on **Netlify**, a free hosting platform, at **https://pawshaven-st10488462.netlify.app**. The site folder was uploaded using Netlify Drop (drag and drop) and set to public, and the project was renamed to a meaningful address. Updates are deployed by dropping the updated folder onto the project's overview page. The website was opened in a normal browser window and a private window to confirm it is public, and the 404 page, `robots.txt` and `sitemap.xml` were checked on the live address.

### 7. Testing
Each stage was tested in the browser using VS Code Live Server before it was committed. Checks included: opening and closing the lightbox with the mouse and keyboard; opening each FAQ; searching, filtering and sorting the dogs and opening the details pop-up; using both map buttons and the pop-up links; submitting each form empty, with wrong values, and with correct values; confirming the personal response and the compiled email; visiting a page that does not exist to see the 404 page; and opening `robots.txt` and `sitemap.xml` on the live site. After deployment, the live address was also checked for the updated footer, the current-page highlight in the navigation, the map on the Contact page, the dog search tools on the Adoption page, the 404 page, `robots.txt` and `sitemap.xml`.

### 8. Known limitations
- The enquiry form sends to **JSONPlaceholder**, a free testing service that accepts any data and replies as a real server would; enquiries are therefore not delivered to a real inbox. To receive real enquiries, only the web address in `ENQUIRY_ENDPOINT` in `js/script.js` needs to change to a form service address.
- The contact form creates an email in the visitor's own email app (a `mailto:` link), so the visitor must have an email app set up; a "Copy email text" button is provided as a backup.
- The interactive map needs an internet connection to load its map pictures.
- Costs, dates and the dogs' stories are fictional and were created for this assignment.
- A stricter Content Security Policy header could be added in future.

## Sitemap
```
Homepage (index.html)
├── About Us (about.html)
├── Adoption (services.html)
├── Volunteer / Sponsor Enquiry (enquiry.html)
└── Contact (contact.html)
```

## File Structure
```
HTML and Basic Content, Website/
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── 404.html
├── style.css
├── robots.txt
├── sitemap.xml
├── _headers
├── README.md
├── data/
│   └── dogs.json
├── js/
│   └── script.js
└── images/
    ├── hero-dog.jpg
    ├── team-photo.jpg
    ├── dog-buddy.jpg
    ├── dog-luna.jpg
    ├── dog-max.jpg
    ├── dog-placeholder.svg
    └── favicon.svg
```

## How to Run the Website Locally
1. Open the `HTML and Basic Content, Website` folder in VS Code.
2. Install the Live Server extension, then right-click `index.html` and choose **Open with Live Server**. (A local server is needed because the dog list is loaded from `data/dogs.json`.)

## Commit History (Part 3)
| Stage | Commit message |
|---|---|
| Interactive elements | Add JavaScript interactivity: photo gallery lightbox, FAQ accordion, scroll animations |
| Dynamic content | Add dynamic dog directory with search, filter, sort and details pop-up |
| Map and contact form | Add interactive Leaflet map and validated contact form that builds an email |
| Enquiry form | Add validated enquiry form with AJAX submission and personalised cost and availability response |
| SEO | Add SEO: unique titles and descriptions, social tags, structured data, robots.txt, sitemap.xml, 404 page and security headers |

## Changelog
| Date | Change |
|---|---|
| 03 August 2026 | Initial repository setup |
| 04 August 2026 | Added proposals and sitemap |
| 05 August 2026 | Created folder structure (css, js, images) |
| 06 August 2026 | Built all 5 HTML pages with navigation |
| 07 August 2026 | Added images to images folder |
| 07 August 2026 | Final Part 1 review and submission |
| 15 September 2026 | Reviewed Part 1 feedback (98%, no corrections required) |
| 15 September 2026 | Created external stylesheet (style.css) and linked it to all 5 HTML pages |
| 15 September 2026 | Implemented CSS reset and base styles (colour variables, spacing scale) |
| 15 September 2026 | Applied typography styles and a consistent font scale |
| 16 September 2026 | Built layout structure using Flexbox and CSS Grid |
| 16 September 2026 | Applied decorative and colour styling across all pages |
| 16 September 2026 | Added interactive pseudo-classes (hover, focus, active) |
| 16 September 2026 | Implemented responsive breakpoints for tablet and mobile |
| 16 September 2026 | Final Part 2 review and submission |
| 20 October 2026 | Reviewed the Part 3 brief and marking rubric and planned the work in stages: interactive elements, dynamic content, map and contact form, enquiry form, SEO, deployment, documentation |
| 21 October 2026 | Created `js/script.js` and linked it to all 5 HTML pages with `defer` in the `<head>` |
| 21 October 2026 | About Us page: added a "Photo Gallery" section with five photos and a lightbox viewer (enlarge, previous and next buttons, keyboard arrow keys, Esc and click-outside to close, captions, focus returned to the photo on close); the team photo also opens in the lightbox |
| 21 October 2026 | Adoption page: made the three dog photos open in the same lightbox, and added an "Adoption FAQs" accordion with four questions (fee, timeline, other pets, settling-in period) using `aria-expanded` and `aria-controls` |
| 21 October 2026 | Added animations and transitions: sections fade up on scroll (IntersectionObserver), a back-to-top button built with JavaScript, an automatic highlight on the current navigation link, and a `prefers-reduced-motion` rule that switches animations off; appended the matching styles to `style.css` (sections 13 to 18) |
| 21 October 2026 | Tested the lightbox, accordion and animations in the browser and committed the work to GitHub |
| 23 October 2026 | Moved the dog information into `data/dogs.json`, and made `script.js` load it with `fetch` and build the dog cards; added three more dogs (Daisy, Rocky, Bella) with a "Photo coming soon" placeholder image (`images/dog-placeholder.svg`) |
| 23 October 2026 | Adoption page: added a "Find Your Match" panel with a search box, age filter, size filter, sort menu, "Clear filters" button and a live results count; the original three cards remain in the HTML as a backup if the data cannot load |
| 23 October 2026 | Added a "View details" button and a pop-up window (modal) on each dog card, with the dog's story, facts and an "Enquire about adopting" link; appended the matching styles (sections 19 to 21) and committed the work |
| 23 October 2026 | Contact page: replaced the two Google Maps embeds with one interactive Leaflet map with two markers and pop-ups, location cards with "Show on map" and "Get directions", and a "Show both locations" button; Leaflet is loaded with Subresource Integrity |
| 23 October 2026 | Contact page: rebuilt the contact form with extra controls (phone, reply method, topic dropdown, message counter, checkboxes), JavaScript validation with error messages for every field, and an email builder that creates a `mailto:` email to info@pawshaven.org with Open, Copy and Edit buttons; appended styles (sections 22 to 25) and committed the work |
| 23 October 2026 | Enquiry page: rebuilt the enquiry form with extra questions that appear for volunteers and sponsors (availability, dog, sponsorship plan), validation with error messages, AJAX submission with `fetch` (with a "Sending..." state, a time limit and a clear error message), and a personal response showing the cost, availability, next orientation date and a reference number; appended styles (sections 26 and 27) and committed the work |
| 26 October 2026 | Reviewed Part 2 feedback (96%, no comments or corrections received); nothing to correct, and all Part 2 styling and responsive behaviour was kept |
| 26 October 2026 | Deployed the website to Netlify (Netlify Drop), set it to public and renamed it to https://pawshaven-st10488462.netlify.app; checked that the pages load |
| 26 October 2026 | SEO: wrote unique title tags, meta descriptions and meta keywords for each page; added canonical links, Open Graph and Twitter tags, a favicon, and schema.org structured data for the two locations |
| 26 October 2026 | SEO: gave every page one unique `h1` (the site name in the header became a styled paragraph, with identical appearance); improved alt text for the hero image and for Luna and Max (in the HTML and `dogs.json`); added internal links in the page content; replaced the footer link text "contact.html" with descriptive links and added share links for Facebook, X and WhatsApp |
| 26 October 2026 | Page speed: reduced the size of the three largest photos (same file names), added width and height to images, lazy loading on images below the fold, high priority for the hero image, and early connections for the map servers |
| 26 October 2026 | Added `robots.txt`, `sitemap.xml`, a custom `404.html` page, and `_headers` with security headers; deployed the update to Netlify and checked the 404 page, `robots.txt` and `sitemap.xml` on the live site |
| 26 October 2026 | Fixed the navigation highlight so it also works on Netlify's clean addresses (for example `/services`) as well as on `.html` addresses |
| 26 October 2026 | Committed the SEO work to GitHub |
| 26 October 2026 | Updated this README (Part 3 details, feedback section, changelog, references) and wrote the Part 3 documentation report |

## References
Harvard referencing style, adapted for The IIE.

**Images**
- Buddy and Luna photos: images were sourced from online image search results. The original creator/source could not be verified; this has been explicitly stated in place of a citation.
- Midlands Humane Society (n.d.) *Adoptable Dogs*. Available at: https://midlandshumanesociety.org/adopt/adoptable-dogs.html (Accessed: 7 August 2026) — used as `dog-max.jpg`
- Mission Mayday (n.d.) *Rescued Dog Ready for Adoption*. Available at: https://www.missionmayday.ca/ (Accessed: 7 August 2026) — used as `hero-dog.jpg`
- SolStock (2024) *Volunteering with Dogs at an Animal Shelter*. Getty Images. Available at: https://www.gettyimages.co.uk/photos/dog-shelter-volunteer (Accessed: 7 August 2026) — used as `team-photo.jpg`
- The "Photo coming soon" placeholder (`dog-placeholder.svg`) and the paw-print favicon (`favicon.svg`) were created for this project.

**Tools, libraries and standards used in Part 3**
- Agafonkin, V. (2023) *Leaflet: an open-source JavaScript library for mobile-friendly interactive maps*, version 1.9.4. Available at: https://leafletjs.com/ (Accessed: 26 October 2026)
- OpenStreetMap contributors (n.d.) *OpenStreetMap copyright and licence*. Available at: https://www.openstreetmap.org/copyright (Accessed: 26 October 2026) — map pictures shown in the Leaflet map
- typicode (n.d.) *JSONPlaceholder: free fake REST API for testing*. Available at: https://jsonplaceholder.typicode.com/ (Accessed: 26 October 2026) — receives the enquiry form submission
- Netlify (n.d.) *Netlify Drop*. Available at: https://app.netlify.com/drop (Accessed: 26 October 2026) — hosting and deployment
- Schema.org (n.d.) *AnimalShelter*. Available at: https://schema.org/AnimalShelter (Accessed: 26 October 2026) — structured data
- The Open Graph protocol (n.d.) *The Open Graph protocol*. Available at: https://ogp.me/ (Accessed: 26 October 2026) — social sharing tags
- Sitemaps.org (n.d.) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html (Accessed: 26 October 2026)
- Google (n.d.) *Introduction to robots.txt*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 26 October 2026)

## Use of AI Assistance
An AI assistant, Claude (Anthropic, 2026), was used during Part 3 to help write and test the JavaScript, the SEO files and the documentation, and to guide the setup, testing, deployment and GitHub steps. The student set up the project, tested each feature in the browser, deployed the site, and committed each stage to GitHub.
