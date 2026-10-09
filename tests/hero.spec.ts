import { test, expect } from '@playwright/test';

test('rapid seeks back to a cancelled request still settle on the exact frame', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.route('**/frame-*.webp', async route => {
    await new Promise(resolve => setTimeout(resolve, 180));
    await route.continue();
  });
  await page.goto('/');
  const canvas = page.getByTestId('sequence-canvas');
  await expect(canvas).toHaveAttribute('data-frame', '0');
  for (const index of [80, 160, 80, 10, 150, 10]) {
    await page.evaluate(frame => scrollTo({ top: Math.ceil(frame / 179 * 3840), behavior: 'instant' }), index);
    await page.waitForTimeout(40);
  }
  await expect(canvas).toHaveAttribute('data-frame', '10');
});

test('delayed frames never rewind a forward seek or advance a reverse seek', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.route('**/frame-*.webp', async route => {
    const index = Number(route.request().url().match(/frame-(\d+)/)?.[1]);
    await new Promise(resolve => setTimeout(resolve, index % 3 === 0 ? 180 : 20));
    await route.continue();
  });
  await page.goto('/');
  const canvas = page.getByTestId('sequence-canvas');
  await expect(canvas).toHaveAttribute('data-frame', '0');
  for (const [target, direction] of [[110, 1], [25, -1], [179, 1], [0, -1]]) {
    await canvas.evaluate((el) => {
      const frames = [Number((el as HTMLElement).dataset.frame)];
      const observer = new MutationObserver(() => frames.push(Number((el as HTMLElement).dataset.frame)));
      observer.observe(el, { attributes: true, attributeFilter: ['data-frame'] });
      Object.assign(el, { recordedFrames: frames, recorder: observer });
    });
    await page.evaluate(index => scrollTo({ top: Math.ceil(index / 179 * 3840), behavior: 'instant' }), target);
    await expect(canvas).toHaveAttribute('data-frame', String(target));
    const frames = await canvas.evaluate(el => {
      const recorder = el as HTMLCanvasElement & { recordedFrames: number[]; recorder: MutationObserver };
      recorder.recorder.disconnect();
      return recorder.recordedFrames;
    });
    expect(frames.every((frame, i) => i === 0 || (frame - frames[i - 1]) * direction >= 0)).toBe(true);
  }
});

test('resizing a visible canvas never exposes cleared pixels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');
  await expect(page.getByTestId('sequence-canvas')).toHaveAttribute('data-frame', '0');
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas')!;
    const state = { blank: 0, samples: 0, running: true };
    Object.assign(window, { pixelAudit: state });
    function sample() {
      if (!state.running) return;
      const pixel = canvas.getContext('2d')!.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
      if (getComputedStyle(canvas).opacity === '1') {
        state.samples++;
        if (pixel[0] + pixel[1] + pixel[2] === 0) state.blank++;
      }
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  for (const width of [1300, 1100, 1440, 1000, 1400]) {
    await page.setViewportSize({ width, height: 960 });
    await page.waitForTimeout(100);
  }
  const result = await page.evaluate(() => {
    const state = (window as unknown as { pixelAudit: { running: boolean; samples: number; blank: number } }).pixelAudit;
    state.running = false;
    return state;
  });
  expect(result.samples).toBeGreaterThan(10);
  expect(result.blank).toBe(0);
});

test('missing frames are cooled down instead of repeatedly fetched during scrubbing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  let failedRequests = 0;
  await page.route('**/frame-0093.webp', route => {
    failedRequests++;
    return route.fulfill({ status: 404 });
  });
  await page.goto('/');
  const canvas = page.getByTestId('sequence-canvas');
  await expect(canvas).toHaveAttribute('data-frame', '0');
  for (let i = 0; i < 10; i++) {
    await page.evaluate(index => scrollTo({ top: index / 179 * 3840, behavior: 'instant' }), i % 2 ? 92 : 93);
    await page.waitForTimeout(80);
  }
  expect(failedRequests).toBe(1);
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute('data-frame', '92');
});
