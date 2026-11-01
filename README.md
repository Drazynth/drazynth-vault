# DRAZYNTH VAULT

A resource library for video editors. React + Vite + TypeScript frontend, Sanity as the admin panel and database, Cloudflare Pages for hosting, Google Drive for the actual files.

```
drazynth-vault/
  src/        the public website
  studio/     the admin panel (Sanity Studio) and the Resource form definition
```

Publishing flow: you sign in to the Studio, fill in the Resource form, press **Publish**. The website reads published content live from Sanity, so the new resource appears without a rebuild and without your laptop being on.

---

## 1. One-time setup (about 20 minutes)

You need Node.js 18 or newer (https://nodejs.org).

### A. Create the Sanity project
1. Go to https://www.sanity.io and create a free account.
2. Create a new project, name it `drazynth-vault`, dataset `production`, and keep the dataset **public** (this only exposes *published* content for reading; drafts stay private).
3. Copy the **Project ID** from the project page.

### B. Run the admin panel locally to test
```bash
cd studio
cp .env.example .env        # then paste your project ID into .env
npm install
npm run dev                 # opens at http://localhost:3333
```
Sign in with the account you used to create the project. Add a test resource and press Publish.

### C. Put the admin panel online
```bash
cd studio
npx sanity login
npm run deploy
```
Sanity gives you an address like `https://drazynth-vault.sanity.studio`. This is your **admin login**. Change `studioHost` in `studio/sanity.cli.ts` first if that name is taken.

Then, in the Sanity project settings under **API > CORS origins**, add:
- `http://localhost:5173` (for local testing)
- your live site address, e.g. `https://drazynth-vault.pages.dev` (no credentials needed)

### D. Run the website locally
```bash
# from the project root
cp .env.example .env        # fill in the project ID and Studio address
npm install
npm run dev                 # http://localhost:5173
```

---

## 2. Deploy the website (Cloudflare Pages)

1. Put this project on GitHub (the `.gitignore` already keeps `.env` out).
2. In Cloudflare, go to **Workers & Pages > Create > Pages > Connect to Git** and pick the repo.
3. Build settings: framework **Vite**, build command `npm run build`, output directory `dist`.
4. Add the environment variables from `.env.example` (`VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_STUDIO_URL`, `VITE_CONTACT_EMAIL`).
5. Deploy. `public/_redirects` makes links like `/resources/some-name` work when opened directly.

The site is now online independently of your computer.

---

## 3. Adding a resource (no code)

1. Open your Studio address and sign in.
2. Click **Resource > Create**.
3. Fill in: Name, click **Generate** on the URL slug, choose the **Category**, write the short description.
4. Upload the thumbnail and as many screenshots as you like.
5. Paste the **Download URL** (Google Drive). Optional: preview video link, audio preview (SFX), tags, version, file size, etc.
6. Press **Publish**. Use the menu next to Publish to **Unpublish** or **Delete**. Leaving it unpublished keeps it as a draft.

Featured items: turn on **Featured on home page**. Order: lower **Manual order** numbers appear first in category pages.

### Google Drive links
Right-click the file in Drive > Share > General access > **Anyone with the link** > Viewer, then copy the link. The site opens that link as-is. Drive may show a "can't scan for viruses" page for large files, and Drive can limit download traffic for popular files. The site can't change this. If a link breaks, edit the Download URL in the Studio and publish; no code change is needed.

---

## 4. How the download flow works

- First click on **Get Download** saves a note for that one resource in `sessionStorage` and opens the YouTube channel in a new tab.
- The button on that page becomes **Continue to Download**. Pressing it opens that resource's own Drive link.
- Every resource uses its own storage key (`dv:download:<id>`), so one resource can never open another's file.
- **Cancel** or **Start over** resets it. If a browser blocks the new tab, a plain link to YouTube is shown.
- The site does not check that anyone subscribed or watched anything, and the site never claims otherwise. It only sends people to your channel first.
- The note lives in the browser tab. Closing the tab resets it.

---

## 5. Security notes

- The website only holds the Project ID and dataset name. These are public values. **There is no write token anywhere in the frontend.**
- Editing, publishing and deleting require signing in to Sanity. Only members you invite in the Sanity project can do so. Do not invite anyone you don't trust, and turn on two-factor sign-in for your Sanity account.
- Keep the dataset public only for reading; Sanity does not allow anonymous writes.
- The `/admin` page on the site is only a signpost to the Studio. It protects nothing and needs to protect nothing.
- All external links open with `rel="noopener noreferrer"`. Links from the CMS are only used if they start with `http` or `https`.

## 6. Things to know

- **Free-plan limits and pricing change.** Check Sanity's and Cloudflare's current pricing pages before launch: asset storage and bandwidth, API request quotas, and the number of users on the free plan.
- **Link previews.** The site renders in the browser, so a shared resource link shows the generic site title and description on WhatsApp/Telegram. Per-resource link previews would need server-side rendering or a Cloudflare Function.
- **Search** matches the start of words (typing `trans` finds `transition`) in name, description, tags and compatible app.
- Only publish files you have the right to share. Mark modified or third-party APKs as **Unofficial** in the form so a notice appears.
- Replace the Privacy Policy and Terms text with wording reviewed for your situation and country.
- Run `npm run typecheck` before deploying if you change code.
