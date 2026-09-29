# Triple Maintenance Group — website

Static HTML site, ready to push to GitHub and deploy to Azure Static Web Apps.

## What changed in this pass

The pages were previously built and reviewed as standalone files, each with
the logo and photos embedded directly as base64 data. That was the right
call for fast review, but wrong for a real repo: every page was carrying
its own full copy of every image it used. This pass fixed that:

- **Images extracted** to `assets/images/`, deduplicated by content — the
  logo (used on every page) now exists as one file, not twelve copies.
  Total HTML dropped from 10.6 MB to under 200 KB; images are 6.4 MB
  across 27 unique files.
- **Shared CSS extracted** to `assets/css/base.css` — the design system
  (colors, type, buttons, header/nav including the mobile menu, footer)
  now lives in one file instead of being retyped on every page. In the
  process, a few small inconsistencies between pages (e.g. heading
  line-height varying between 1, 1.05, and 1.1 depending on the page)
  were standardized.
- **Clean filenames.** `tmg-homepage-preview.html` → `index.html`, etc.
  See the table below. All internal links were updated to match.
- **Verified with a real headless browser** (Playwright), not just by
  reading the code — every page was rendered and checked for console
  errors and broken asset paths before this was called done.

## File map (old name → new name)

| Old (review) filename | New (repo) filename |
|---|---|
| tmg-homepage-preview.html | index.html |
| tmg-about-preview.html | about.html |
| tmg-services-preview.html | services.html |
| tmg-service-building-maintenance.html | services-building-maintenance.html |
| tmg-service-grounds-maintenance.html | services-grounds-maintenance.html |
| tmg-service-janitorial.html | services-janitorial.html |
| tmg-service-project-management.html | services-project-management.html |
| tmg-providers-preview.html | providers.html |
| tmg-customers-preview.html | customers.html |
| tmg-contact-preview.html | contact.html |
| tmg-privacy-policy.html | privacy-policy.html |
| tmg-provider-terms.html | provider-terms.html |

The Careers page was struck from the site by request and is not included.
The site index / status-tracker page and the provider-onboarding
interactive mock were internal review tools, not site pages, and are also
not included here.

## Structure

```
/
├── index.html, about.html, services.html, ...   (12 pages)
├── assets/
│   ├── css/base.css       (shared design system — reset, type, buttons,
│   │                        header/nav incl. mobile toggle, footer)
│   └── images/             (27 deduplicated images, referenced by page)
└── .github/workflows/
    └── azure-static-web-apps.yml
```

Each page still has its own `<style>` block for content unique to that
page (hero layout, the Providers state maps, the Customers modal, etc.).
Only the truly shared rules live in `base.css`.

## Run it locally

No build step — these are plain static files. Either:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000`, or just open `index.html` directly in
a browser (all asset paths are relative, so both work).

## Deploy to Azure Static Web Apps

1. Push this repo to GitHub.
2. In the Azure portal, create a Static Web App and point it at the repo.
   Azure auto-generates a matching GitHub Actions secret
   (`AZURE_STATIC_WEB_APPS_API_TOKEN`) in your repo settings.
3. Every push to `main` deploys automatically via
   `.github/workflows/azure-static-web-apps.yml`.

The domain (triplemg.com) gets pointed at the Static Web App's default
hostname via CNAME once the app is created.

## Known gaps — not fixed in this pass

- **Fonts require internet access.** The site pulls Oswald and Inter from
  Google Fonts at `assets/css/base.css`'s first line. This works fine on
  any real connection; it only fails in network-sandboxed environments.
- **No backend is wired up.** The Contact form, the Providers "Apply to
  join" / "See requirements" buttons, and the Customers "Book a discovery
  call" pop-up all collect input but don't submit anywhere yet. A partial
  Azure Functions backend exists separately (provider registration) but
  isn't deployed or linked to any page.
- **Portal Login isn't built.** It's being treated as an app-design task
  (auth, client vs. technician dashboards) rather than a page-content
  task, and is being built alongside the backend.
- **Several photos are stand-ins.** A few show other companies' branding
  (visible on staff clothing/vehicles in some shots) or appear to be
  AI-generated. Fine for review; replace with real or licensed photos
  before launch — see `assets/images/manifest.json` for the full list of
  image files and which page first used each one.
- **Public guarantee.** The Customers page states "100% satisfaction
  guaranteed." Worth defining what that means in practice (redo, credit,
  refund) before it's live.
