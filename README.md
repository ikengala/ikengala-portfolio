# Ike Ngala: Marketing Portfolio

A plain HTML/CSS rebuild of the Squarespace portfolio that used to live at
`ikengala.squarespace.com`. There's no password, no Squarespace, and no build step:
the files in this folder are the website.

This version keeps the original content and layout so nothing is lost. It's meant
as the starting point for a more creative redesign later.

## What's here

```
index.html                     Home: bio, intro, project list, skills & tools
projects/
  before-i-go-away.html        Case study 1: virality
  galatea.html                 Case study 2: press
  favorite.html                Case study 3: long-form brand building
assets/
  css/style.css                Shared styling (colours and fonts at the top)
  css/layout/<page>.css        Exact block positions copied from the original
                               Squarespace grid (24 columns; 8 on phones)
  js/main.js                   Section dividers, slideshows, reels, sliding dropdowns,
                               scroll fade-ins, counters, clip sound buttons,
                               off-screen video pausing, home hover-cover effect
  files/Ike-Ngala-CV.pdf       CV linked from the header and footer (swap the file to update it)
  images/posters/              Preview frames shown while each video loads
  images/favicon.svg           Browser tab icon
404.html                       "Page not found" page
CNAME                          Tells GitHub Pages the site lives at ikengala.com
robots.txt                     Keeps search engines out of the images/videos folder
  images/<page>/               Every image at original resolution
  images/covers/               The three project cover artworks
  videos/<page>/               Every video, converted to MP4
  videos/shared/               Blue background video (home + Before I Go Away)
content/
  home.md, before-i-go-away.md, galatea.md, favorite.md
                               All page text in order, with images, videos and
                               links in place. Easiest place to read or edit copy.
  site-data.json               The same content as structured data (every section,
                               block, colour theme and asset path), handy for
                               feeding into a future redesign.
  image-descriptions.json      A short description of every image (used as alt
                               text for screen readers and search engines).
```

## Viewing it

Open `index.html` in a browser. Everything is linked with relative paths, so it also
works straight from your computer.

## Putting it online for free (GitHub Pages)

1. On GitHub, open this repository, then **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick your branch
   and the `/ (root)` folder, then save.
3. After a minute the site is live at `https://<your-username>.github.io/ikengala-portfolio/`.
   You can add your own domain on the same settings page.

Netlify, Cloudflare Pages and Vercel also work: drag the folder in or connect the repo,
with no build command.

## Kept out of search results

The site is meant to be shared by link, not found by searching your name:

- Every page has `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">`.
- `robots.txt` blocks crawlers from `/assets/` so images and videos don't show up in image search.
  Pages are deliberately *not* blocked there: a crawler has to read a page to see its noindex tag.
- Link previews on LinkedIn, Slack, iMessage etc. still work.

To make the site searchable later, delete that meta tag from each page and the `Disallow` line from `robots.txt`.

## Design reference (from the original site)

| | |
|---|---|
| Heading font | Manrope 500 (Google Fonts) |
| Body font | Nunito Sans 400 (Google Fonts) |
| Home | White and black sections |
| Before I Go Away | Blue `#64a6c9`, white text |
| Galatea | Black with yellow accent `#ffd15c`; yellow "Outcomes" section |
| Favorite | Red `#ca2216` / `#bb2217`, yellow text `#ffd15c` |

Background videos are dimmed or blurred the way Squarespace did it: 70% opacity on
Before I Go Away and Favorite, a 15px blur on the Galatea outcomes section.

## Added on top of the Squarespace version

- Header links to each case study and to Contact ("Work · Contact" on phones).
- Home: focus labels under each project (cover art shown on touch screens), a
  "Results in numbers" strip with career-wide figures (from the CV and case studies),
  and a breathing animation on the BCZIKN logo.
- CV link in the header and a Download CV button in the footer.
- Case studies: an "At a glance" strip (release date, focus, role, three headline results).
  The figures all come from the case-study text; edit them in each page's HTML.
- Dropdowns slide open, content fades in as you scroll (off for people who prefer reduced
  motion), Before I Go Away clips have sound buttons, the Galatea slideshows can be swiped.
- Social preview card (title, description, image) for links shared on LinkedIn, Slack etc.

## Differences from the Squarespace version

- **Layout** uses the original's exact grid positions, block offsets, section heights
  and divider shapes, including its separate phone layout.
- **Dropdowns** ("Trend-Responsive Content Creation" and the others) use the browser's
  built-in `<details>` element, with the original alignment and +/– or chevron icons.
- **Galleries** (photo rows, the Galatea slideshows and the playlist reels) are rebuilt
  with plain HTML and a few lines of JavaScript, and look the same. The press-photo
  lightbox (tap to enlarge) and the 3° tilt-on-scroll animation on some images weren't
  carried over.
- **Videos** are MP4 files in the repo rather than Squarespace's streaming player. They
  are compressed (max 1280px, background videos without sound) so the whole site
  deploys and loads quickly; the largest is about 10 MB. The higher-quality copies
  pulled from Squarespace are in the first commit's history if you ever need them.
- The contact section that sat at the bottom of every page is now a single shared footer.

## Image filenames

Images keep their original upload names where those were meaningful (`tender.png`,
`miss-me-vid-cover.png`). Phone-generated names like `temp_image_590DE304…` became
`img-590de304…`. Feel free to rename them during the redesign, but update the HTML
and Markdown references too.
