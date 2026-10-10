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
import BookingPanel from './BookingPanel';
import api, { getErrorMessage } from '../api/client';

// Mock the API client to prevent the automated tests from sending real HTTP requests to the backend.
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn()
  },
  getErrorMessage: vi.fn()
}));

const gig = {
  _id: '64b7f0c2a1b2c3d4e5f60718',
  title: 'Logo Design',
  price: 500
};

function renderPanel() {
  return render(
    <MemoryRouter>
      <BookingPanel gig={gig} />
    </MemoryRouter>
  );
}

describe('BookingPanel component', () => {

  beforeEach(() => {
    api.post.mockReset();
    getErrorMessage.mockReset();
  });

  // Test 1: Verifies that clicking Book shows the confirmation step, and Cancel returns to the Book button without booking.
  it('shows a confirmation step and can be cancelled', async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByRole('button', { name: /book this gig/i }));

    expect(screen.getByRole('heading', { name: /confirm booking/i })).toBeInTheDocument();
    expect(screen.getByText(/simulated payment/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByRole('button', { name: /book this gig/i })).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test 2: Verifies that confirming sends only the gig id (never a price) and shows the transaction reference.
  it('books the gig with only its id and shows the transaction reference', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({
      data: { transaction: { amount: 500, reference: 'TXN-test-123' } }
    });
    renderPanel();

    await user.click(screen.getByRole('button', { name: /book this gig/i }));
    await user.click(screen.getByRole('button', { name: /confirm and pay/i }));

    expect(api.post).toHaveBeenCalledWith('/bookings', { gigId: gig._id });
    expect(await screen.findByRole('heading', { name: /booking confirmed/i })).toBeInTheDocument();
    expect(screen.getByText('TXN-test-123')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view my bookings/i })).toHaveAttribute('href', '/bookings');
  });

  // Test 3: Verifies that a failed booking shows a safe error message and lets the user try again.
  it('shows an error and stays on the confirm step when booking fails', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValueOnce(new Error('Request failed'));
    getErrorMessage.mockReturnValueOnce('Too many booking requests. Please try again in 15 minutes.');
    renderPanel();

    await user.click(screen.getByRole('button', { name: /book this gig/i }));
    await user.click(screen.getByRole('button', { name: /confirm and pay/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/too many booking requests/i);
    expect(screen.getByRole('button', { name: /confirm and pay/i })).toBeEnabled();
  });
});
