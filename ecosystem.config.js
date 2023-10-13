module.exports = {
  apps: [
    {
      script: "backend/server.js",
      watch: false,
      instances: "1",
      exec_mode: "cluster",
      autorestart: true,
      max_memory_restart: "400M",
    },
  ],
};
