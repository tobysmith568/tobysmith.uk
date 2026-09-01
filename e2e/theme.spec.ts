import { expect, test } from "@playwright/test";
import { ThemePageObject } from "./page-objects/theme.po";

const LIGHT_BG = "rgb(246, 247, 249)";
const DARK_BG = "rgb(16, 19, 26)";

test.describe("Theme toggle", () => {
  test("defaults to following the system, with no explicit override", async ({ page }) => {
    const theme = new ThemePageObject(page);
    await page.goto("/");

    expect(await theme.dataChoice()).toBe("system");
    expect(await theme.dataTheme()).toBeNull();
    await expect(theme.toggle).toHaveAttribute("aria-label", "Theme: follow system");
  });

  test("first click flips the appearance - system -> dark -> light -> system on a light OS", async ({
    browser
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    const theme = new ThemePageObject(page);
    await page.goto("/");

    await theme.toggle.click(); // straight to the opposite of the OS
    expect(await theme.dataChoice()).toBe("dark");
    expect(await theme.dataTheme()).toBe("dark");
    expect(await theme.bodyBackground()).toBe(DARK_BG);

    await theme.toggle.click(); // then the OS's own theme, now pinned
    expect(await theme.dataChoice()).toBe("light");
    expect(await theme.dataTheme()).toBe("light");
    expect(await theme.bodyBackground()).toBe(LIGHT_BG);

    await theme.toggle.click(); // back to following the OS
    expect(await theme.dataChoice()).toBe("system");
    expect(await theme.dataTheme()).toBeNull();

    await context.close();
  });

  test("the direction reverses on a dark OS - system -> light -> dark -> system", async ({
    browser
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    const theme = new ThemePageObject(page);
    await page.goto("/");

    await theme.toggle.click();
    expect(await theme.dataChoice()).toBe("light");
    expect(await theme.bodyBackground()).toBe(LIGHT_BG);

    await theme.toggle.click();
    expect(await theme.dataChoice()).toBe("dark");
    expect(await theme.bodyBackground()).toBe(DARK_BG);

    await theme.toggle.click();
    expect(await theme.dataChoice()).toBe("system");
    expect(await theme.dataTheme()).toBeNull();

    await context.close();
  });

  test("remembers the choice across navigation", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    const theme = new ThemePageObject(page);
    await page.goto("/");

    await theme.toggle.click(); // -> dark
    expect(await theme.storedChoice()).toBe("dark");

    await page.goto("/blog");
    expect(await theme.dataTheme()).toBe("dark");
    expect(await theme.bodyBackground()).toBe(DARK_BG);

    await context.close();
  });

  test("follows a dark OS when no choice has been made", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    const theme = new ThemePageObject(page);

    await page.goto("/");
    expect(await theme.dataChoice()).toBe("system");
    expect(await theme.dataTheme()).toBeNull();
    expect(await theme.bodyBackground()).toBe(DARK_BG);

    await context.close();
  });
});
