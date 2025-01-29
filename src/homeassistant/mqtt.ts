// src/homeassistant/mqtt.ts
client.subscribe('rcon-monitor/+/command');

client.on('message', (topic, message) => {
  const [_, host] = topic.split('/');
  const server = healthMonitor.servers.get(host);
  
  if (!server) return;
  
  server.sendCommand(message.toString())
    .then(response => client.publish(`rcon-monitor/${host}/response`, response))
    .catch(err => client.publish(`rcon-monitor/${host}/error`, err.message));
});