rcon-monitor/
├── config/
│   ├── servers.json          # Server configurations
│   └── commands.json         # Game-specific commands
├── src/
│   ├── rcon/                 # RCON logic
│   │   ├── RconClient.ts
│   │   └── types.ts
│   ├── websocket/            # WebSocket server
│   │   └── server.ts
│   ├── homeassistant/        # Home Assistant integration
│   │   ├── mqtt.ts
│   │   └── healthMonitor.ts
│   ├── web/                  # Web dashboard (frontend + backend)
│   │   ├── public/           # Static files (HTML/CSS/JS)
│   │   ├── src/
│   │   │   ├── App.tsx       # React/Vue app
│   │   │   └── ...
│   │   └── server.ts         # Express API
│   ├── utilities/
│   │   └── logger.ts         # Logging utility
│   └── index.ts              # Main entry point
├── scripts/
│   └── install_deps.sh       # Dependency installer (#5)
├── docs/                     # Documentation
├── .env                      # Environment variables
├── package.json
├── tsconfig.json
└── README.md