 //References:
// Vitest (2026). Getting Started.
// https://vitest.dev/guide/
 
//Testing Library (2026). React Testing Library.
// https://testing-library.com/docs/react-testing-library/intro/

// Testing Library (2026). User Event.
// https://testing-library.com/docs/user-event/intro/


import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// Mock the authentication context so that the Login component can be tested independently without requiring a real logged-in user.
vi.mock('../context/useAuth', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn()
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


function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login page', () => {

  // Test 1: Verifies that the main login form elements are rendered correctly for the user.
  it('renders the login form', () => {
    renderLogin();

    expect(
      screen.getByRole('heading', { name: /log in/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /log in/i })
    ).toBeInTheDocument();
  });

  // Test 2: Verifies user interaction by checking that a user can enter an email address and password.
  it('allows the user to enter email and password', async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'iqra@example.com');
    await user.type(passwordInput, 'StrongPass1!');

    expect(emailInput).toHaveValue('iqra@example.com');
    expect(passwordInput).toHaveValue('StrongPass1!');
  });

  // Test 3: Verifies the client-side validation behaviour when the login form is submitted without any input.
  it('shows validation errors when an empty form is submitted', async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.click(
      screen.getByRole('button', { name: /log in/i })
    );

    expect(
      await screen.findByText(/email/i, { selector: '.field-error' })
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/password/i, { selector: '.field-error' })
    ).toBeInTheDocument();
  });

  // Test 4: Verifies that invalid login input is rejected by client-side validation before an API request is made.
  it('does not call the login API when invalid input is submitted', async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.type(
      screen.getByLabelText(/email/i),
      'invalid-email'
    );

    await user.type(
      screen.getByLabelText(/password/i),
      '123'
    );

    await user.click(
      screen.getByRole('button', { name: /log in/i })
    );

    const api = await import('../api/client');

    expect(api.default.post).not.toHaveBeenCalled();
  });

  // Test 5: Verifies that valid input is sent to the login API, with the email trimmed and lowercased.
  it('calls the login API with the cleaned email when valid input is submitted', async () => {
    const user = userEvent.setup();
    const api = await import('../api/client');

    api.default.post.mockClear();
    api.default.post.mockResolvedValueOnce({
      data: { token: 'test-token', email: 'iqra@example.com', role: 'client' }
    });

    renderLogin();

    await user.type(screen.getByLabelText(/email/i), '  Iqra@Example.com ');
    await user.type(screen.getByLabelText(/password/i), 'StrongPass1!');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(api.default.post).toHaveBeenCalledTimes(1);
    expect(api.default.post).toHaveBeenCalledWith('/auth/login', {
      email: 'iqra@example.com',
      password: 'StrongPass1!'
    });
  });
});