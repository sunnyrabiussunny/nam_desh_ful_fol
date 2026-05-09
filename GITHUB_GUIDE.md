# GitHub Guide — Nam Desh Ful Fol
**Repo:** https://github.com/sunnyrabiussunny/nam_desh_ful_fol

---

## First time push (from Windows with Git Bash)

You said you already pushed once. Skip to **"Push updates"** below.

---

## Push updates to existing repository

After downloading the new ZIP and extracting it:

```bash
# 1. Go into the folder you already pushed
cd path/to/nam_desh_ful_fol

# 2. Copy new files from the ZIP into this folder
#    (overwrite everything except the .git folder)

# 3. Stage all changes
git add .

# 4. Commit
git commit -m "v2 — fix letter picking, port 3210, improved installer"

# 5. Push
git push
```

If it asks for username/password — use your GitHub username and a **Personal Access Token** (not your password):
- Go to https://github.com/settings/tokens/new
- Name: `nam-desh-ful-fol`
- Check **repo** scope → Generate → copy the token
- Paste it as the password

---

## Full push from scratch (if needed)

```bash
# In Git Bash on Windows:
cd ~/Downloads
unzip nam-desh-ful-fol-linux.zip -d nam_desh_ful_fol
cd nam_desh_ful_fol

git init
git add .
git commit -m "Initial release — Nam Desh Ful Fol v2.0"
git remote add origin https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
git branch -M main
git push -u origin main
```

---

## After pushing — verify

Open https://github.com/sunnyrabiussunny/nam_desh_ful_fol

Check that these files are there:
- `src/server.js`
- `public/index.html`
- `public/client.js`
- `public/wordlists.js`
- `README.md`
- `install.sh`

---

## Anyone can now install with:

```bash
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
cd nam_desh_ful_fol
sudo bash install.sh
```

Game runs at **http://YOUR-IP:3210** ✅
