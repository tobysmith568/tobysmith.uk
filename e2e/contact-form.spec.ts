import { expect, test } from "@playwright/test";
import { IndexPageObject } from "./page-objects/index.po";
import { stubTurnstile } from "./support/turnstile";

// These exercise the contact-form path end-to-end against the real Astro Action running under
// `wrangler dev`: the browser form, `parseFormData`, the `actions.contact()` RPC, the
// `/_actions/contact` route, the action's own Zod schema, `ActionError` -> HTTP mapping, the
// MIME message construction, and the `#result-message` UI. Only the two calls that would leave
// the machine - Turnstile verification and the email send - are swapped for stubs by the
// `e2e-contact-stubs` plugin (see astro.config.mjs), and only the failure branches are forced;
// the happy path still makes a real Turnstile siteverify call and a real local `SEB` send.
test.describe("Contact form submission", () => {
  const validForm = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hello from the Playwright suite"
  };
  // The happy path still makes a real server-side siteverify round-trip.
  const resultTimeout = 15_000;

  test.beforeEach(async ({ page }) => {
    await stubTurnstile(page);
  });

  test("should post the form and show a success confirmation", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await indexPage.form.fillOut(validForm);
    await indexPage.form.waitUntilReady();

    const requestPromise = page.waitForRequest("**/_actions/contact");
    await indexPage.form.submit();
    const body = (await requestPromise).postDataJSON();

    expect(body.name).toBe(validForm.name);
    expect(body.email).toBe(validForm.email);
    expect(body.message).toBe(validForm.message);
    expect(body.turnstileToken).toBeTruthy();

    await expect(indexPage.form.resultMessage).toBeVisible({ timeout: resultTimeout });
    await expect(indexPage.form.resultMessage).toHaveText("Message sent successfully!");
  });

  test("should show an error when the server fails to send the email", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await indexPage.form.fillOut({
      ...validForm,
      message: "Please fail this one [e2e:send-fail]"
    });
    await indexPage.form.waitUntilReady();
    await indexPage.form.submit();

    await expect(indexPage.form.resultMessage).toBeVisible({ timeout: resultTimeout });
    await expect(indexPage.form.resultMessage).toHaveText("E2E forced email failure");
  });

  test("should show an error when Turnstile rejects the token", async ({ page }) => {
    const indexPage = new IndexPageObject(page);

    // Swap the widget-issued token for the sentinel the E2E stub treats as a hard failure -
    // simulating an expired or forged token without provisioning a second Turnstile secret.
    await page.route("**/_actions/contact", async route => {
      const body = route.request().postDataJSON();
      await route.continue({
        postData: JSON.stringify({ ...body, turnstileToken: "e2e-turnstile-fail" })
      });
    });

    await indexPage.goto();
    await indexPage.form.fillOut(validForm);
    await indexPage.form.waitUntilReady();
    await indexPage.form.submit();

    await expect(indexPage.form.resultMessage).toBeVisible({ timeout: resultTimeout });
    await expect(indexPage.form.resultMessage).toHaveText(
      JSON.stringify({ turnstileErrorCodes: ["e2e-forced-failure"] })
    );
  });

  test("should reject a submission that is missing required fields", async ({ request }) => {
    const response = await request.post("/_actions/contact", {
      data: { name: "", email: "not-an-email", message: "", turnstileToken: "" }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.type).toBe("AstroActionInputError");
    const paths = body.issues.map((issue: { path: string[] }) => issue.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["name", "email", "message", "turnstileToken"]));
  });
});
