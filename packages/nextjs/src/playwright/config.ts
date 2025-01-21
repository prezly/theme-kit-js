import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

interface Configuration {
    testDir: string;
    baseUrl?: string;
    ci?: boolean;
}

const DEFAULT_BASE_URL = 'http://localhost:3000';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export function createPlaywrightConfig({
    testDir,
    baseUrl = DEFAULT_BASE_URL,
    ci = false,
}: Configuration): PlaywrightTestConfig {
    return {
        testDir,
        /* Maximum time one test can run for. */
        timeout: 30 * 1000,
        expect: {
            /**
             * Maximum time expect() should wait for the condition to be met.
             * For example in `await expect(locator).toHaveText();`
             */
            timeout: 5000,
        },
        /* Run tests in files in parallel */
        fullyParallel: true,
        /* Fail the build on CI if you accidentally left test.only in the source code. */
        forbidOnly: ci,
        /* Retry on CI only */
        retries: ci ? 2 : 0,
        /* Opt out of parallel tests on CI. */
        workers: ci ? 1 : undefined,
        /* Reporter to use. See https://playwright.dev/docs/test-reporters */
        reporter: 'html',
        /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
        use: {
            /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
            actionTimeout: 0,
            /* Base URL to use in actions like `await page.goto('/')`. */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            baseURL: baseUrl,

            /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
            trace: 'on-first-retry',
            video: ci ? 'retain-on-failure' : 'on',
        },

        /* Configure projects for major browsers */
        projects: [
            {
                name: 'chromium',
                use: {
                    ...devices['Desktop Chrome'],
                },
            },

            {
                name: 'firefox',
                use: {
                    ...devices['Desktop Firefox'],
                },
            },

            // Safari fails to load localhost pages due to SSL error. We'll only test Webkit on CI, where have an HTTPS server.
            ...(ci
                ? [
                      {
                          name: 'webkit',
                          use: {
                              ...devices['Desktop Safari'],
                          },
                      },
                  ]
                : []),
        ],
    };
}
