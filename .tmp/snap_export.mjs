import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1920,1080',
]);

await new Promise((r) => setTimeout(r, 1500));
const res = await fetch('http://127.0.0.1:9222/json/version');
const { webSocketDebuggerUrl } = await res.json();
const ws = new WebSocket(webSocketDebuggerUrl);
let id = 1;
const callbacks = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && callbacks.has(m.id)) callbacks.get(m.id)(m.result);
};
const send = (method, params = {}) =>
  new Promise((r) => {
    const msgId = id++;
    callbacks.set(msgId, r);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
await new Promise((r) => (ws.onopen = r));
const { targetId } = await send('Target.createTarget', { url: 'http://localhost:3000/about' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const sendSession = (method, params = {}) =>
  new Promise((r) => {
    const msgId = id++;
    callbacks.set(msgId, r);
    ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
  });
await sendSession('Page.enable');
await sendSession('Runtime.enable');
await new Promise((r) => setTimeout(r, 2500));

const found = await sendSession('Runtime.evaluate', {
  expression: `Boolean(document.getElementById('export-markets'))`,
});
console.log('Found element:', found.result.value);

await sendSession('Runtime.evaluate', {
  expression: `document.getElementById('export-markets').scrollIntoView({ block: 'start' })`,
});
await new Promise((r) => setTimeout(r, 1500));

const shot = await sendSession('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('.tmp/export_direct_shot.png', Buffer.from(shot.data, 'base64'));
console.log('Saved .tmp/export_direct_shot.png');

await send('Target.closeTarget', { targetId });
ws.close();
chrome.kill();
