# RCON Monitor Tool

Monitor multiple game servers (Minecraft, Ark, Valheim, etc.) via RCON with real-time updates, Home Assistant integration, and a web dashboard.

## Features
- Event-driven player count tracking
- Game-specific commands (e.g., save, restart)
- Health monitoring and alerts
- MQTT/WebSocket integration with Home Assistant
- RAM-based logging with hourly disk flush

## Installation (Debian Bookworm 12.7)

### 1. Install Node.js and Dependencies
```bash
sudo apt update && sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential

git clone https://github.com/yourusername/rcon-monitor.git
cd rcon-monitor
npm install

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

######what to do first
# Install dependencies
chmod +x scripts/install_deps.sh
./scripts/install_deps.sh

# Start the tool
npm start


in Nginx Proxy manager you will use port 3000 by default for the web dashboard and the web socket uses 8080 these are defined in env 
MQTT_BROKER_URL="mqtt://homeassistant.local"
WEBSOCKET_PORT=8080
DASHBOARD_PORT=3000
