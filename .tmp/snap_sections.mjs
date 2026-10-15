import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9222;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1920,1080',
]);

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await wait(1500);
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/version`);
    const data = await res.json();
    const wsUrl = data.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise((r) => (ws.onopen = r));

    async function snapPage(url, prefix) {
      const target = await send('Target.createTarget', { url });
      const targetId = target.targetId;
      const attached = await send('Target.attachToTarget', { targetId, flatten: true });
      const sessionId = attached.sessionId;

      function sendSession(method, params = {}) {
        return new Promise((resolve) => {
          const msgId = id++;
          callbacks.set(msgId, resolve);
          ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
        });
      }

      await sendSession('Page.enable');
      await sendSession('DOM.enable');
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false,
      });

      await wait(3000);

      // 1. Hero viewport shot
      const heroShot = await sendSession('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
        fromSurface: true,
      });
      fs.writeFileSync(`.tmp/${prefix}_hero.png`, Buffer.from(heroShot.data, 'base64'));
      console.log(`Saved .tmp/${prefix}_hero.png`);

      await send('Target.closeTarget', { targetId });
    }

    await snapPage('http://localhost:3000/solutions/oem', 'oem');
    await snapPage('http://localhost:3000/solutions/dealership', 'dealership');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

run();
