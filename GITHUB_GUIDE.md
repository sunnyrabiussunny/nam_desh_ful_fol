# GitHub Push Guide — Nam Desh Ful Fol
**Repository:** https://github.com/sunnyrabiussunny/nam_desh_ful_fol

---

## Step 1 — Install Git (if not installed)

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install -y git
```

**Windows:**
Download from https://git-scm.com/download/win → install with defaults.

**macOS:**
```bash
brew install git
```

---

## Step 2 — Configure Git (one time only)

```bash
git config --global user.name "Sunny Rabius Sunny"
git config --global user.email "your@email.com"
```

---

## Step 3 — Create the repository on GitHub

1. Go to https://github.com/new
2. Repository name: `nam_desh_ful_fol`
3. Description: `নাম দেশ ফুল ফল — Real-time multiplayer word game by Sunny Rabius Sunny`
4. Set to **Public**
5. Do NOT check "Add README" (we already have one)
6. Click **Create repository**

---

## Step 4 — Extract and push the Linux project

```bash
# Extract the ZIP
cd ~/Downloads
unzip ncff-battle-linux.zip -d nam_desh_ful_fol

# Go into the project
cd nam_desh_ful_fol

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial release — Nam Desh Ful Fol v1.0

Real-time multiplayer নাম দেশ ফুল ফল game
- Zero dependencies (pure Node.js built-ins only)
- WebSocket server with RFC 6455 implementation
- 778 person names + 307 countries + 171 flowers + 134 fruits
- Bangla + English word validation with fuzzy phonetic matching
- 3-50+ player support over local WiFi
- by Sunny Rabius Sunny"

# Connect to GitHub
git remote add origin https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 5 — Verify it worked

Open https://github.com/sunnyrabiussunny/nam_desh_ful_fol

You should see all files including:
- `src/server.js`
- `public/index.html`
- `public/client.js`
- `public/wordlists.js`
- `README.md`
- `install.sh`

---

## Step 6 — One-line install for anyone

After pushing, anyone can install with:
```bash
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
cd nam_desh_ful_fol
node src/server.js
```

Or with the install script:
```bash
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git && cd nam_desh_ful_fol && bash install.sh
```

---

## Step 7 — If you need a GitHub token (HTTPS auth)

GitHub no longer accepts passwords for push. Use a token:

1. Go to https://github.com/settings/tokens/new
2. Note: `nam-desh-ful-fol push`
3. Check **repo** scope
4. Click Generate token → copy it
5. When `git push` asks for password, paste the token

**Or use SSH (easier long-term):**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your@email.com"

# Copy the public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: https://github.com/settings/keys → New SSH key → paste

# Change remote to SSH
git remote set-url origin git@github.com:sunnyrabiussunny/nam_desh_ful_fol.git

# Push
git push -u origin main
```

---

## Future updates

After making changes:
```bash
git add .
git commit -m "Your update message"
git push
```
