# Sachin Bhardwaj — Portfolio Website

A responsive, dark-themed developer portfolio built with plain HTML, CSS, and JavaScript.

## 📁 Files

```
index.html            → main page (all sections)
style.css              → all styling, dark/light theme tokens
script.js              → theme toggle, mobile nav, terminal typing effect, contact form
favicon.ico            → browser tab icon (multi-size)
favicon-32.png         → 32px tab icon (modern browsers)
apple-touch-icon.png   → iOS home-screen icon
```

Keep all six files in the **same folder** — nothing else is required.

---

## ✅ Before you deploy — update these placeholders

Open `index.html` and replace:

| What | Line area | Replace with |
|---|---|---|
| GitHub link | Contact section (`social-link`) | your real GitHub profile URL |
| LinkedIn link | Contact section (`social-link`) | your real LinkedIn profile URL |
| Email | `mailto:hello@sachinbhardwaj.dev` | your real email |
| Project "Live Demo" buttons (×3) | Projects section | real deployed URLs once each project is hosted |
| Project "GitHub Repo" buttons (×3) | Projects section | links to each project's actual repo |

Search for `href="#"` and `github.com/` / `linkedin.com/` in the file to find them quickly.

The contact **form** currently only shows a success message locally — it doesn't send email yet. To make it actually deliver messages, connect it to a free service like [Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com), or point it at your own backend.

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (free, easiest)
1. Create a new GitHub repo (e.g. `portfolio`).
2. Upload all 6 files to the repo (drag-and-drop works on github.com, or use `git push`).
3. Go to **Settings → Pages**.
4. Under "Source," select the `main` branch and `/ (root)` folder → Save.
5. Your site goes live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

### Option 2: Netlify (free, drag-and-drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole folder (all 6 files) into the browser window.
3. Netlify instantly deploys it and gives you a live URL.
4. Optional: connect a custom domain under **Site settings → Domain management**.

### Option 3: Vercel (free)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the folder as a project (or connect it via a GitHub repo).
3. Leave build settings empty (it's a static site — no build step needed).
4. Deploy.

Any of these three work well for a static HTML/CSS/JS site like this one — no backend or build tools required.

---

## 🔧 Local preview (before deploying)

Just double-click `index.html` to open it in your browser, or for a closer-to-production preview:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 🎨 Customizing later

- **Colors/fonts**: edit the CSS variables at the top of `style.css` (`:root` block).
- **Typing text in the hero terminal**: edit the `messages` array near the top of `script.js`.
- **Favicon**: swap `favicon.ico`, `favicon-32.png`, or `apple-touch-icon.png` for new versions — no HTML changes needed as long as filenames stay the same.
