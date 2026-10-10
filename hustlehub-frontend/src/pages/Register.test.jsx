// References:
// Vitest (2026). Getting Started.
// https://vitest.dev/guide/

// Testing Library (2026). React Testing Library.
// https://testing-library.com/docs/react-testing-library/intro/

// Testing Library (2026). User Event.
// https://testing-library.com/docs/user-event/intro/


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import api from '../api/client';

// Mock the authentication context so the Register page renders as a logged-out visitor.
vi.mock('../context/useAuth', () => ({
  useAuth: () => ({
    user: null
  })
}));

// Mock the API client to prevent the automated tests from sending real HTTP requests to the backend.
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn()
  },
  getErrorMessage: vi.fn(),
  getFieldErrors: vi.fn()
}));


function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

// Fills in the form; any field can be overridden to test a specific invalid value.
async function fillForm(user, overrides = {}) {
  const values = {
    email: 'iqra@example.com',
    password: 'StrongPass1!',
    confirmPassword: 'StrongPass1!',
    ...overrides
  };

  await user.type(screen.getByLabelText(/^email/i), values.email);
  await user.type(screen.getByLabelText(/^password/i), values.password);
  await user.type(screen.getByLabelText(/confirm password/i), values.confirmPassword);
}

describe('Register page', () => {

  beforeEach(() => {
    api.post.mockReset();
  });

  // Test 1: Verifies that the registration form and both role options are rendered.
  it('renders the registration form with client and freelancer options', () => {
    renderRegister();

    expect(screen.getByRole('heading', { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /\(client\)/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /\(freelancer\)/i })).not.toBeChecked();
  });

  // Test 2: Verifies that the password strength rule is enforced before anything is sent to the server.
  it('rejects a weak password without calling the API', async () => {
    const user = userEvent.setup();
    renderRegister();

    await fillForm(user, { password: 'password', confirmPassword: 'password' });
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(
      await screen.findByText(/must include uppercase, lowercase, a number and a special character/i)
    ).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test 3: Verifies that mismatched passwords are caught on the client.
  it('shows an error when the passwords do not match', async () => {
    const user = userEvent.setup();
    renderRegister();

    await fillForm(user, { confirmPassword: 'Different1!' });
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test 4: Verifies that valid input is sent with the chosen role, and that confirmPassword never leaves the browser.
  it('sends only email, password and the chosen role when the form is valid', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({ data: { success: true } });
    renderRegister();

    await fillForm(user, { email: '  Iqra@Example.com ' });
    await user.click(screen.getByRole('radio', { name: /\(freelancer\)/i }));
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'iqra@example.com',
      password: 'StrongPass1!',
      role: 'freelancer'
    });
  });
});
