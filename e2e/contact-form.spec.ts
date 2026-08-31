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
    // The action maps any send failure to a generic message - the stub's real error string
    // ("E2E forced email failure") is logged server-side, never shown to the browser.
    await expect(indexPage.form.resultMessage).toHaveText(
      "Something went wrong while sending your message. Please try again later."
    );
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
    // The action maps any Turnstile failure to a generic message - the stub's raw error-code
    // payload (`{"turnstileErrorCodes":["e2e-forced-failure"]}`) is logged server-side, never
    // shown to the browser (this used to leak straight into the UI - see redesign.md).
    await expect(indexPage.form.resultMessage).toHaveText(
      "Something went wrong verifying your submission. Please try again."
    );
  });

  test("should show a specific error for an invalid email, client-side", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    // "a@b" is deliberately chosen over something like "not-an-email": the <input type="email">
    // itself blocks a value with no "@" via native browser validation before our JS ever runs
    // (no submit event at all), but a domain with no dot satisfies that native check while
    // still failing Zod's stricter .email() - so this is the realistic way to reach
    // `parseFormData`, which now surfaces its actual Zod message instead of a generic
    // "Invalid field data" (see redesign.md). This never reaches the server: `parseFormData`
    // throws before `sendContactEmail` makes any request.
    await indexPage.form.fillOut({ ...validForm, email: "a@b" });
    await indexPage.form.waitUntilReady();
    await indexPage.form.submit();

    await expect(indexPage.form.resultMessage).toBeVisible({ timeout: resultTimeout });
    await expect(indexPage.form.resultMessage).toHaveText(
      "The email field must be a valid email address"
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
