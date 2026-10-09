import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("desktop renders supplied assets and captures the design", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Extraordinary",
  );
  await expect(page.getByTestId("sequence-canvas")).toHaveAttribute(
    "data-frame",
    /\d+/,
  );
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  for (const section of [
    "overview",
    "explore",
    "interiors",
    "amenities",
    "location",
    "contact",
  ]) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${section}`)).toBeVisible();
  }
  await page.locator("#interiors").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/desktop-interiors.png" });
  await expect(
    page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter(
            (img) =>
              !(img as HTMLImageElement).complete ||
              !(img as HTMLImageElement).naturalWidth,
          )
          .map((img) => img.getAttribute("src")),
      ),
  ).resolves.toEqual([]);
  expect(errors).toEqual([]);
});
test("canvas follows scroll, stops, reverses and bounds decoded cache", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  const canvas = page.getByTestId("sequence-canvas");
  await expect(canvas).toHaveAttribute("data-frame", "0");
  await page.evaluate(() =>
    window.scrollTo({ top: 2200, behavior: "instant" }),
  );
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-frame")))
    .toBeGreaterThan(80);
  const current = await canvas.getAttribute("data-frame");
  await page.waitForTimeout(350);
  expect(await canvas.getAttribute("data-frame")).toBe(current);
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-frame")))
    .toBeLessThan(50);
  expect(
    Number(await canvas.getAttribute("data-cache-size")),
  ).toBeLessThanOrEqual(18);
});
test("keyboard floor selection is carried into enquiry", async ({ page }) => {
  await page.goto("/");
  await page.locator("#explore").scrollIntoViewIfNeeded();
  const selected = page.getByRole("tab", { name: "1", exact: true });
  await selected.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "2", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Second floor");
  await page.getByRole("link", { name: "Enquire about this floor" }).click();
  await expect(page.getByLabel("Interested floor")).toHaveValue("2");
  await expect(page.getByRole("tabpanel")).toContainText(
    "Available on request",
  );
});
test("form validates input and does not fake an unconfigured submission", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await expect(
    page.getByText("Please agree so the project team can respond."),
  ).toBeVisible();
  await page.getByLabel("Full name").fill("Test Visitor");
  await page.getByLabel("Mobile number").fill("+91 9000000000");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("I agree to be contacted").check();
  await page.waitForTimeout(1600); // Exercise the actual timing-based spam gate.
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Your enquiry has not been sent" }),
  ).toBeVisible();
  await expect(page.getByLabel("Full name")).toHaveValue("Test Visitor");
});
test("server rejects malformed, cross-origin, oversized and bot submissions", async ({
  request,
}) => {
  const headers = { Origin: "http://127.0.0.1:3000" };
  const base = {
    name: "Test Visitor",
    phone: "+919000000000",
    email: "test@example.com",
    floor: "1",
    message: "Test only",
    consent: true,
    website: "",
    startedAt: Date.now() - 5000,
  };
  expect(
    (await request.post("/api/enquiry", { headers, data: {} })).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/enquiry", {
        headers: { Origin: "https://unrelated.example" },
        data: base,
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/enquiry", {
        headers,
        data: { ...base, website: "spam" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/enquiry", {
        headers,
        data: { ...base, consent: false },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/enquiry", {
        headers,
        data: { ...base, message: "x".repeat(20000) },
      })
    ).status(),
  ).toBe(413);
  expect(
    (await request.post("/api/enquiry", { headers, data: base })).status(),
  ).toBe(503);
});
test("success and failure messages match the delivery response (mocked UI only)", async ({
  page,
}) => {
  await page.route("**/api/enquiry", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        message:
          "Your enquiry has been accepted for delivery to the project team.",
      }),
    }),
  );
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByLabel("Full name").fill("Test Visitor");
  await page.getByLabel("Mobile number").fill("+919000000000");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("I agree to be contacted").check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "accepted for delivery" }),
  ).toBeVisible();
  await expect(page.getByLabel("Full name")).toHaveValue("");
});
for (const width of [360, 375, 390, 430, 768, 1024, 1440, 1920]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (width === 390) {
      await page.screenshot({ path: "test-results/mobile-contact.png" });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: "test-results/mobile-hero.png" });
    }
  });
}
test("mobile menu works, closes with Escape and respects focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Interiors" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/#interiors$/);
  await expect.poll(() => page.locator('#interiors').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(92);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 667 }, { width: 844, height: 390 }]) {
  test(`direct section links and back to top at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/#contact');
    const offset = viewport.width <= 760 ? 92 : 110;
    await expect.poll(() => page.locator('#contact').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(offset);
    await page.getByRole('link', { name: 'Back to top', exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    if (viewport.height >= 760) {
      await expect(page.getByTestId('sequence-canvas')).toHaveAttribute('data-frame', '0');
    } else {
      await expect(page.locator('.pin-spacer')).toHaveCount(0);
      await expect(page.getByTestId('sequence-canvas')).toBeHidden();
      await page.locator('.hero-bottom').scrollIntoViewIfNeeded();
      await expect(page.locator('.hero-bottom')).toBeInViewport();
    }
  });
}

test('rotating a phone releases the pin and restores animation in portrait', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByTestId('sequence-canvas')).toHaveAttribute('data-frame', '0');
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.getByTestId('sequence-canvas')).toBeHidden();
  await expect(page.locator('.hero-poster')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await expect(page.getByTestId('sequence-canvas')).toBeVisible();
});
test("reduced motion keeps a static poster and no pinned canvas", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("sequence-canvas")).toBeHidden();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".hero-poster")).toBeVisible();
  await page.getByRole("tab", { name: "2", exact: true }).click();
  expect(errors).toEqual([]);
});
test("mobile sequence uses smaller frames and reverses", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const frames: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/sequence/")) frames.push(request.url());
  });
  await page.goto("/");
  const canvas = page.getByTestId("sequence-canvas");
  await expect(canvas).toHaveAttribute("data-frame", "0");
  await page.evaluate(() =>
    window.scrollTo({ top: 1200, behavior: "instant" }),
  );
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-frame")))
    .toBeGreaterThan(40);
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-frame")))
    .toBeLessThan(25);
  expect(frames.some((url) => url.includes("/mobile/"))).toBe(true);
  expect(
    Number(await canvas.getAttribute("data-cache-size")),
  ).toBeLessThanOrEqual(12);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("a missing requested frame preserves a visible architectural image", async ({
  page,
}) => {
  await page.route("**/frame-0093.webp", (route) =>
    route.fulfill({ status: 404 }),
  );
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  const canvas = page.getByTestId("sequence-canvas");
  await expect(canvas).toHaveAttribute("data-frame", "0");
  await page.evaluate(() =>
    window.scrollTo({ top: 2000, behavior: "instant" }),
  );
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-frame")))
    .toBeGreaterThan(85);
  await expect(canvas).toBeVisible();
});
test("metadata, privacy and indexing protections are present", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/RADIAN by V Venturez/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Privacy & enquiries",
  );
});
test("automated WCAG A/AA scan at desktop and phone", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
