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
  css/style.css                All styling (colours and fonts at the top)
  js/main.js                   Home page "cover follows the cursor" effect
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

## Differences from the Squarespace version

- **Accordions** ("Trend-Responsive Content Creation" and the others) use the browser's
  built-in `<details>` element. They open and close the same way.
- **Galleries** are simple rows and horizontal scrollers instead of Squarespace's
  slideshow and lightbox widgets.
- **Layout** reproduces the original 12-column grid closely, but not pixel for pixel.
  On phones every block stacks in reading order.
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
