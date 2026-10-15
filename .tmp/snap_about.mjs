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

    const target = await send('Target.createTarget', { url: 'http://localhost:3000/about' });
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

    // 1. Hero shot
    const heroShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.tmp/about_hero_new.png', Buffer.from(heroShot.data, 'base64'));
    console.log('Saved .tmp/about_hero_new.png');

    // 2. Journey shot
    await sendSession('Runtime.evaluate', {
      expression: `
        const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('500+ Dealers'));
        if (heading) heading.scrollIntoView({ block: 'start' });
      `,
    });
    await wait(1200);
    const journeyShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.tmp/about_journey_animated.png', Buffer.from(journeyShot.data, 'base64'));
    console.log('Saved .tmp/about_journey_animated.png');

    // 3. Timeline shot with bar filling
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('company-timeline');
        if (el) el.scrollIntoView({ block: 'start' });
      `,
    });
    await wait(1600);
    const timelineShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.tmp/about_timeline_animated.png', Buffer.from(timelineShot.data, 'base64'));
    console.log('Saved .tmp/about_timeline_animated.png');

    // 4. Compliance shot
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('compliance');
        if (el) el.scrollIntoView({ block: 'start' });
      `,
    });
    await wait(1600);
    const complianceShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.tmp/about_compliance_animated.png', Buffer.from(complianceShot.data, 'base64'));
    console.log('Saved .tmp/about_compliance_animated.png');

    // 5. Export markets shot
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('export-markets');
        if (el) el.scrollIntoView({ block: 'start' });
      `,
    });
    await wait(1600);
    const exportShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('.tmp/about_export_animated.png', Buffer.from(exportShot.data, 'base64'));
    console.log('Saved .tmp/about_export_animated.png');

    await send('Target.closeTarget', { targetId });
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

run();
