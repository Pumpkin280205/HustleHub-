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
import GigForm from './GigForm';
import api from '../api/client';

// Mock the API client to prevent the automated tests from sending real HTTP requests to the backend.
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn()
  },
  getErrorMessage: vi.fn(),
  getFieldErrors: vi.fn()
}));

const existingGig = {
  _id: '64b7f0c2a1b2c3d4e5f60718',
  title: 'Logo Design',
  description: 'I will design a professional logo for your brand',
  category: 'Design',
  price: 500
};

describe('GigForm component', () => {

  beforeEach(() => {
    api.post.mockReset();
    api.put.mockReset();
  });

  // Test 1: Verifies that submitting an empty form shows an error for every field and sends nothing.
  it('shows an error for all four fields when submitted empty', async () => {
    const user = userEvent.setup();
    render(<GigForm onSaved={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /create gig/i }));

    expect(await screen.findByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/choose a category/i, { selector: '.field-error' })).toBeInTheDocument();
    expect(screen.getByText(/enter a price/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test 2: Verifies that prices below the R1 minimum are rejected on the client.
  it('rejects a price below R1', async () => {
    const user = userEvent.setup();
    render(<GigForm onSaved={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'Logo Design');
    await user.type(screen.getByLabelText(/description/i), 'I will design a professional logo');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Design');
    await user.type(screen.getByLabelText(/price/i), '0.5');
    await user.click(screen.getByRole('button', { name: /create gig/i }));

    expect(await screen.findByText(/price must be at least r1/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  // Test 3: Verifies that edit mode is pre-filled with the existing gig's values.
  it('pre-fills the form when editing an existing gig', () => {
    render(<GigForm gig={existingGig} onSaved={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /edit gig/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('Logo Design');
    expect(screen.getByLabelText(/description/i)).toHaveValue(existingGig.description);
    expect(screen.getByLabelText(/category/i)).toHaveValue('Design');
    expect(screen.getByLabelText(/price/i)).toHaveValue(500);
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  // Test 4: Verifies that saving an edit sends a PUT for that gig and passes the saved gig back to the parent.
  it('updates the gig and calls onSaved with the result', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    const updatedGig = { ...existingGig, price: 750 };
    api.put.mockResolvedValueOnce({ data: { gig: updatedGig } });

    render(<GigForm gig={existingGig} onSaved={onSaved} onCancel={vi.fn()} />);

    const price = screen.getByLabelText(/price/i);
    await user.clear(price);
    await user.type(price, '750');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(api.put).toHaveBeenCalledWith(`/gigs/${existingGig._id}`, {
      title: 'Logo Design',
      description: existingGig.description,
      category: 'Design',
      price: 750
    });
    expect(onSaved).toHaveBeenCalledWith(updatedGig);
  });

  // Test 5: Verifies that the Cancel button calls onCancel without submitting the form.
  it('calls onCancel without saving when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<GigForm gig={existingGig} onSaved={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(api.put).not.toHaveBeenCalled();
  });
});
