#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  NCFF BATTLE — One-Click Installer
#  নাম · দেশ · ফুল · ফল
#
#  Usage (one line):
#    curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ncff-battle/main/install.sh | bash
#
#  Or after cloning:
#    bash install.sh
# ═══════════════════════════════════════════════════════════════

set -e

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
RESET="\033[0m"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║   নাম · দেশ · ফুল · ফল  — NCFF BATTLE     ║${RESET}"
echo -e "${CYAN}║         One-Click Installer                  ║${RESET}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${RESET}"
echo ""

# ── Check OS ──────────────────────────────────────────────────
if [[ "$OSTYPE" == "darwin"* ]]; then
  OS="mac"
elif [[ -f /etc/debian_version ]]; then
  OS="debian"
elif [[ -f /etc/redhat-release ]]; then
  OS="redhat"
else
  OS="linux"
fi

echo -e "${BOLD}Detected OS:${RESET} $OS"

# ── Install Node.js if missing ────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "\n${YELLOW}Node.js not found. Installing...${RESET}"
  if [[ "$OS" == "debian" ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif [[ "$OS" == "redhat" ]]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
  elif [[ "$OS" == "mac" ]]; then
    if command -v brew &>/dev/null; then
      brew install node
    else
      echo -e "${RED}Please install Node.js from https://nodejs.org${RESET}"
      exit 1
    fi
  else
    echo -e "${RED}Please install Node.js 18+ from https://nodejs.org${RESET}"
    exit 1
  fi
else
  NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
  if [[ $NODE_VER -lt 16 ]]; then
    echo -e "${RED}Node.js version too old (found v${NODE_VER}, need 16+)${RESET}"
    echo "Update: https://nodejs.org"
    exit 1
  fi
  echo -e "${GREEN}✓ Node.js $(node -v) found${RESET}"
fi

# ── Install dependencies ──────────────────────────────────────
echo ""
echo -e "${BOLD}Installing dependencies...${RESET}"
npm install --prefer-offline 2>/dev/null || npm install
echo -e "${GREEN}✓ Dependencies installed${RESET}"

# ── Create systemd service (optional) ────────────────────────
if command -v systemctl &>/dev/null && [[ "$EUID" -eq 0 ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  SERVICE_FILE="/etc/systemd/system/ncff-battle.service"
  cat > "$SERVICE_FILE" <<SERVICE
[Unit]
Description=NCFF Battle Game Server
After=network.target

[Service]
Type=simple
User=$SUDO_USER
WorkingDirectory=$SCRIPT_DIR
ExecStart=$(which node) src/server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
SERVICE
  systemctl daemon-reload
  echo -e "${GREEN}✓ Systemd service created (ncff-battle)${RESET}"
  echo "  Start on boot: sudo systemctl enable ncff-battle"
  echo "  Start now:     sudo systemctl start ncff-battle"
fi

# ── Done ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║  ✓ NCFF Battle installed successfully!       ║${RESET}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  ${BOLD}Start the game server:${RESET}"
echo -e "  ${CYAN}npm start${RESET}"
echo ""
echo -e "  ${BOLD}Then open in browser:${RESET}"
echo -e "  ${CYAN}http://localhost:3000${RESET}"
echo ""
echo -e "  ${BOLD}Share with players on same WiFi:${RESET}"
echo -e "  ${CYAN}http://$(hostname -I | awk '{print $1}' 2>/dev/null || echo 'YOUR_IP'):3000${RESET}"
echo ""
