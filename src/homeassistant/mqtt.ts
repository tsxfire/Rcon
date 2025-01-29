import mqtt from 'mqtt';
import { broadcast } from '../websocket/server';

const client = mqtt.connect('mqtt://homeassistant.local');

client.on('connect', () => {
  client.subscribe('rcon-monitor/command/+');
});

client.on('message', (topic, message) => {
  const [_, serverHost, command] = topic.split('/');
  broadcast('command', { server: serverHost, command: message.toString() });
});