# The PRP Times — Online Edition

Static RP newspaper reader meant for GitHub Pages. The landing page hosts a lightweight flipbook that pulls each issue via an `<iframe>` so you can expand the `/pages` directory with more issues whenever you want.

## Structure
```
/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  ├─ css/issue.css
│  ├─ js/main.js
│  └─ img/
│     ├─ logo-placeholder.png
│     └─ bg-paper.jpg
├─ pages/
│  ├─ issue-001/
│  ├─ issue-002/
│  └─ issue-003/
├─ CNAME
└─ README.md
```

## Local preview
Open `index.html` in your browser or use a lightweight server:
```
npx serve .
# or
python3 -m http.server 4173
```

## Reader controls
- Use the on-screen arrows or your keyboard’s ← / → keys to flip through issues.
- The status chip between the buttons displays the active issue and total count.
- Tap the issue cards under the flipbook (or swipe on touch devices) to jump directly to any issue.
- Loading shimmer overlays appear until each iframe finishes rendering; the badge next to the indicator shows the issue subtitle/metadata.
- The reader remembers the last issue you opened (per browser) and resumes there automatically.

## GitHub Pages deployment
1. Push this folder to your repo main branch.
2. In repository settings → Pages, choose `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Set the Pages custom domain to match the value inside `CNAME` (currently `therptimes.example.com`).

## Updating issues
- Duplicate one of the existing `pages/issue-00X` folders, change the iframe path in `index.html`, and add your RP copy.
- Landing flipbook uses `assets/css/style.css`; each issue page pulls `assets/css/issue.css` for the vintage multi-column layout.

Have fun turning server lore into weekly headlines. ✨
