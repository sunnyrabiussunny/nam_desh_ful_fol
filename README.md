# Nam Desh Ful Fol — নাম দেশ ফুল ফল 🎮

**by Sunny Rabius Sunny**

Real-time multiplayer word game inspired by the classic Bangla game নাম-দেশ-ফুল-ফল.
Players race to fill categories starting with a letter before the timer runs out.

🔗 **https://github.com/sunnyrabiussunny/nam_desh_ful_fol**

---

## ⚡ Quick Start

```bash
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
cd nam_desh_ful_fol
node src/server.js
```

Open **http://localhost:3000** — share the network IP with players on same WiFi.

---

## 📋 Requirements

- **Node.js 16+** — zero npm dependencies, uses only built-in modules
- Any modern browser (Chrome, Firefox, Edge, Safari)
- All players on the same WiFi network

**Install Node.js:**
- Ubuntu/Debian: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - && sudo apt install nodejs`
- Windows: https://nodejs.org → Download LTS
- macOS: `brew install node`

---

## 🎮 How to Play

### Host
1. Open `http://localhost:3000`
2. Click **Host Game** → set rounds → share Room Code + your IP
3. Wait for players → click **Start Game**

### Join
1. Open `http://HOST_IP:3000` (e.g. `http://192.168.1.5:3000`)
2. Click **Join Game** → enter name + Room Code

### Rules
| Situation | Points |
|-----------|--------|
| Unique valid answer starting with the letter | **+10** |
| Duplicate answer (same/phonetically similar as another player) | **0** |
| Invalid word / gibberish | **0** |
| Blank answer | **0** |
| Max per round (4 categories) | **40** |

- First player to submit starts a **30-second countdown**
- Letter is picked by players in rotation each round

---

## ✨ Features

- **Zero dependencies** — pure Node.js built-ins only
- **Real-time WebSocket** — RFC 6455 from scratch, no libraries
- **3–50+ players** on same WiFi
- **Fuzzy phonetic matching** — Aparajita = Aporajita, Golap = Golaap, Litchi = Lichu
- **Bangla + English** word validation — 778 names, 307 countries, 171 flowers, 134 fruits
- **Gibberish detection** — AHGGKHKJ scores 0
- **Custom categories** — replace any category before the game
- **Demo mode** — play alone with AI bots
- **Works on** Ubuntu, Debian, macOS, Windows

---

## 🪟 Windows

```bat
:: Install Node.js from https://nodejs.org first, then:
git clone https://github.com/sunnyrabiussunny/nam_desh_ful_fol.git
cd nam_desh_ful_fol
node src/server.js
```

Then open http://localhost:3000 in your browser.

**Firewall:** Allow Node.js through Windows Firewall when prompted, so other devices can connect.

---

## 🐧 Run as Linux Service (auto-start on boot)

```bash
# Run the installer which sets up systemd service
bash install.sh

# Enable auto-start
sudo systemctl enable nam-desh-ful-fol
sudo systemctl start nam-desh-ful-fol
```

**Firewall:**
```bash
sudo ufw allow 3000/tcp
```

---

## 📁 Project Structure

```
nam_desh_ful_fol/
├── src/
│   └── server.js        # Node.js server — zero dependencies
├── public/
│   ├── index.html       # Complete game UI
│   ├── client.js        # Browser WebSocket client
│   └── wordlists.js     # Word validation lists
├── install.sh           # One-click Ubuntu/Linux installer
├── package.json
├── README.md
├── GITHUB_GUIDE.md      # Step-by-step GitHub push guide
└── LICENSE (MIT)
```

---

## 📝 License

MIT — free to use, share, and modify.

---

*Made with ❤️ by Sunny Rabius Sunny*
