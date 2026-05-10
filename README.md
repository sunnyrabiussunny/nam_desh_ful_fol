# Nam Desh Ful Fol — নাম দেশ ফুল ফল 🎮

**by Sunny Rabius Sunny**

Real-time multiplayer Bengali word game. Players race to fill নাম · দেশ · ফুল · ফল starting with a chosen letter before the 30-second timer runs out.

🔗 **https://github.com/sunnyrabiussunny/nam_desh_ful_fol**

---

## 🚀 One-Command Install (Ubuntu)

For a full self-hosted Ubuntu install that runs as a background service:

```bash
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
cd nam_desh_ful_fol
sudo bash install.sh
```

That's it. Nam Desh Ful Fol will be running at **http://YOUR-IP:3210** and will auto-start on reboot.

---

## 🖥 Manual Start (Ubuntu / macOS / Windows)

```bash
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
cd nam_desh_ful_fol
node src/server.js
```

---

## 📋 Requirements

- **Node.js 16+** — zero npm dependencies, built-ins only
- Any modern browser (Chrome, Firefox, Edge, Safari)
- All players on the **same WiFi network**

**Install Node.js:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install nodejs

# macOS
brew install node

# Windows — download from https://nodejs.org
```

---

## 🎮 How to Play

### 🖥 Host (the person running the server)

1. Open **http://localhost:3210** in your browser
2. Click **Host Game**
3. Set number of rounds, customize categories if you want
4. Share your **Room Code** and **IP address** with players
5. Wait for everyone to join → click **Start Game**

### 📱 Players (everyone else on the same WiFi)

1. Open **http://YOUR-HOST-IP:3210** in your browser
   *(e.g. `http://192.168.1.5:3210`)*
2. Click **Join Game**
3. Enter your name and the **Room Code** from the host
4. Wait for host to start!

### 📖 Rules

| Answer | Points |
|--------|--------|
| Valid unique answer starting with the letter | **+10 pts** |
| Same answer as another player (duplicate) | **0 pts** |
| Phonetically similar to another player's answer (e.g. Golap / Golaap) | **0 pts** |
| Gibberish / invalid word | **0 pts** |
| Blank | **0 pts** |
| **Max per round** (4 categories × 10) | **40 pts** |

- Each round: one player picks the letter (circular rotation)
- First player to submit starts a **30-second countdown** for others
- Most points after all rounds wins!

---

## ✨ Features

- **Zero dependencies** — pure Node.js built-ins, no npm install needed
- **3–50+ players** on same WiFi
- **Fuzzy phonetic matching** — Aparajita = Aporajita, Golap = Golaap, Litchi = Lichu
- **Bangla + English** word lists — 778 names, 307 countries, 171 flowers, 134 fruits
- **Gibberish detection** — random keyboard mashing scores 0
- **Custom categories** — replace any category before starting
- **Circular letter rotation** — every player gets a turn to pick
- **Demo mode** — play alone with 3 AI bots to learn the game
- Works on **Ubuntu, Debian, macOS, Windows**

---

## 🪟 Windows

```bat
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
cd nam_desh_ful_fol
node src/server.js
```

Open **http://localhost:3210** — allow Node.js through Windows Firewall when prompted.

---

## ⚙️ Configuration

```bash
# Custom port
PORT=8080 node src/server.js

# Development mode (verbose logging)
node src/server.js --dev
```

---

## 🔧 Manage Service (Ubuntu after install)

```bash
sudo systemctl status  nam-desh-ful-fol
sudo systemctl stop    nam-desh-ful-fol
sudo systemctl restart nam-desh-ful-fol
sudo systemctl disable nam-desh-ful-fol  # disable auto-start
```

---

## 📁 Project Structure

```
nam_desh_ful_fol/
├── src/server.js        ← Game server (zero dependencies)
├── public/
│   ├── index.html       ← Complete game UI
│   ├── client.js        ← Browser WebSocket client
│   └── wordlists.js     ← Word validation (Bangla + English)
├── install.sh           ← Ubuntu one-click installer
├── package.json
├── GITHUB_GUIDE.md      ← How to push updates to GitHub
├── README.md
└── LICENSE (MIT)
```

---

## 📝 License

MIT — free to use, share.

---

*Made by Sunny Rabius Sunny*
