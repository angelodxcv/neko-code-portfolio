# Deploy to GitHub Pages

## Quick Steps:

1. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Name it: `neko-code-portfolio` (or your preferred name)
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README
   - Click "Create repository"

2. **Push Your Code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/neko-code-portfolio.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your actual GitHub username)

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Scroll to **Pages** in the left sidebar
   - Under "Source", select **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
   - Click **Save**

4. **Access Your Site:**
   - Your site will be available at:
   - `https://YOUR_USERNAME.github.io/neko-code-portfolio/`
   - (It may take 1-2 minutes to go live)

## Alternative: Use GitHub CLI

If you have GitHub CLI installed:
```bash
gh repo create neko-code-portfolio --public --source=. --remote=origin --push
```

Then enable Pages in Settings → Pages (same as step 3 above).

