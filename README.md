# RCON Monitor Tool

Monitor multiple game servers (Minecraft, Ark, Valheim, etc.) via RCON with real-time updates, Home Assistant integration, and a web dashboard.

## Features
- Event-driven player count tracking
- Game-specific commands (e.g., save, restart)
- Health monitoring and alerts
- MQTT/WebSocket integration with Home Assistant
- RAM-based logging with hourly disk flush

## Installation (Debian Bookworm 12.7)

  ```bash
  git clone https://github.com/tsxfire/Rcon.git
  cd Rcon
  ```
# Install dependencies
  ```bash
  chmod +x ./scripts/install_deps.sh
  ./scripts/install_deps.sh
  npm install
  ```
# Start the tool
  ```bash
  npm start
  ```

In Nginx Proxy manager you will use port 3000 by default for the web dashboard and the web socket uses 8080 these are defined in env 
MQTT_BROKER_URL="mqtt://homeassistant.local"
WEBSOCKET_PORT=8080
DASHBOARD_PORT=3000
