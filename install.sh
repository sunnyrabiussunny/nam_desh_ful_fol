#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
#  Nam Desh Ful Fol — One-Click Installer for Ubuntu/Debian
#  by Sunny Rabius Sunny
#  https://github.com/sunnyrabiussunny/nam_desh_ful_fol
# ════════════════════════════════════════════════════════════════

set -e
GREEN="\033[0;32m"; YELLOW="\033[1;33m"; CYAN="\033[0;36m"; BOLD="\033[1m"; RESET="\033[0m"
PORT=3210
SERVICE=nam-desh-ful-fol
INSTALL_DIR="/opt/nam-desh-ful-fol"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║    Nam Desh Ful Fol — নাম দেশ ফুল ফল       ║${RESET}"
echo -e "${CYAN}║         by Sunny Rabius Sunny                ║${RESET}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${RESET}"
echo ""

# ── Detect OS ──────────────────────────────────────────────────
if [[ ! -f /etc/debian_version ]]; then
  echo -e "${YELLOW}Warning: This installer is designed for Ubuntu/Debian.${RESET}"
  echo "Continuing anyway..."
fi

# ── Install Node.js if missing ─────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${BOLD}Installing Node.js 20...${RESET}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
  if [[ $NODE_VER -lt 16 ]]; then
    echo "Node.js too old (v${NODE_VER}). Installing v20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  else
    echo -e "${GREEN}✓ Node.js $(node -v)${RESET}"
  fi
fi

# ── Copy files to install dir ──────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ "$SCRIPT_DIR" != "$INSTALL_DIR" ]]; then
  echo -e "${BOLD}Installing to ${INSTALL_DIR}...${RESET}"
  mkdir -p "$INSTALL_DIR"
  cp -r "$SCRIPT_DIR"/src "$INSTALL_DIR/"
  cp -r "$SCRIPT_DIR"/public "$INSTALL_DIR/"
  cp "$SCRIPT_DIR/package.json" "$INSTALL_DIR/"
  INSTALL_DIR="$INSTALL_DIR"
else
  INSTALL_DIR="$SCRIPT_DIR"
fi

# ── Open firewall port ─────────────────────────────────────────
if command -v ufw &>/dev/null; then
  ufw allow ${PORT}/tcp 2>/dev/null || true
  echo -e "${GREEN}✓ Firewall: port ${PORT} open${RESET}"
fi

# ── Create systemd service ─────────────────────────────────────
SERVICE_FILE="/etc/systemd/system/${SERVICE}.service"
RUN_USER="${SUDO_USER:-root}"
NODE_PATH=$(which node)

cat > "$SERVICE_FILE" << SERVICE
[Unit]
Description=Nam Desh Ful Fol Game Server
Documentation=https://github.com/sunnyrabiussunny/nam_desh_ful_fol
After=network.target

[Service]
Type=simple
User=${RUN_USER}
WorkingDirectory=${INSTALL_DIR}
ExecStart=${NODE_PATH} src/server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=${PORT}

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable "$SERVICE"
systemctl restart "$SERVICE"

# ── Get IP ─────────────────────────────────────────────────────
SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR-IP")

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║  ✅  Nam Desh Ful Fol is now running!        ║${RESET}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  ${BOLD}🖥  Host opens:${RESET}    ${CYAN}http://localhost:${PORT}${RESET}"
echo -e "  ${BOLD}📱  Players join:${RESET}  ${CYAN}http://${SERVER_IP}:${PORT}${RESET}"
echo ""
echo -e "  ${BOLD}Auto-starts on reboot:${RESET} ${GREEN}✓ enabled${RESET}"
echo ""
echo -e "  ${BOLD}Manage service:${RESET}"
echo "    sudo systemctl status  $SERVICE"
echo "    sudo systemctl stop    $SERVICE"
echo "    sudo systemctl restart $SERVICE"
echo ""
