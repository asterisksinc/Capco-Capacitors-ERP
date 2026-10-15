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

    // Target OEM
    const target = await send('Target.createTarget', { url: 'http://localhost:3000/solutions/oem' });
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
    await sendSession('Runtime.enable');
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await wait(3000);

    // Scroll to Success Stories
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('[data-story-card]');
        if (el) el.scrollIntoView({ block: 'center' });
      `,
    });
    await wait(1000);
    const storyShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.tmp/oem_story_section.png', Buffer.from(storyShot.data, 'base64'));
    console.log('Saved .tmp/oem_story_section.png');

    // Scroll to Journey
    await sendSession('Runtime.evaluate', {
      expression: `
        const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Start Your OEM Journey'));
        if (heading) heading.scrollIntoView({ block: 'start' });
      `,
    });
    await wait(1000);
    const journeyShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.tmp/oem_journey_section.png', Buffer.from(journeyShot.data, 'base64'));
    console.log('Saved .tmp/oem_journey_section.png');

    await send('Target.closeTarget', { targetId });
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

run();
