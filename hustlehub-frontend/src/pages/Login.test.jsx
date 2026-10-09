import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

vi.mock('../context/useAuth', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn()
  })
}));

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
});