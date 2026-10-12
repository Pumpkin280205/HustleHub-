// @ts-check
import { test, expect } from '@playwright/test';

test('HustleHub API is running', async ({ request }) => {
const response = await request.get('https://localhost:5000/', {
  ignoreHTTPSErrors: true
});
  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.success).toBe(true);
  expect(body.message).toBe('HustleHub API is running');
});
