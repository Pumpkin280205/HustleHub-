
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FreelancerDashboard from './FreelancerDashboard';
import api, { getErrorMessage } from '../api/client';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn()
  },
  getErrorMessage: vi.fn(() => 'Something went wrong. Please try again.')
}));

vi.mock('../components/GigForm', () => ({
  default: ({ gig, onCancel }) => (
    <div data-testid="gig-form">
      {gig ? `Editing ${gig.title}` : 'Creating new gig'}
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

const mockIncome = {
  totalIncome: 5000,
  thisMonth: 1500,
  bookingCount: 4,
  averagePerBooking: 1250,
  monthly: [
    { year: 2026, month: 9, total: 2000, count: 2 },
    { year: 2026, month: 10, total: 3000, count: 2 }
  ]
};

const mockGigs = [{
  _id: 'gig-1',
  title: 'Website Development',
  category: 'Development',
  price: 2500,
  createdAt: '2026-09-01T10:00:00.000Z'
}];

const mockBookings = [{
  _id: 'booking-1',
  gigTitle: 'Website Development',
  client: { email: 'client@example.com' },
  amount: 2500,
  createdAt: '2026-10-01T10:00:00.000Z'
}];

const renderDashboard = () => render(
  <MemoryRouter>
    <FreelancerDashboard />
  </MemoryRouter>
);

const mockSuccessfulRequests = () => {
  api.get.mockImplementation((url) => {
    if (url === '/income') {
      return Promise.resolve({ data: { income: mockIncome } });
    }
    if (url === '/gigs/mine') {
      return Promise.resolve({ data: { gigs: mockGigs } });
    }
    if (url === '/bookings/mine') {
      return Promise.resolve({ data: { bookings: mockBookings } });
    }
    return Promise.reject(new Error(`Unexpected API request: ${url}`));
  });
};

describe('FreelancerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSuccessfulRequests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays a loading message while dashboard data is being fetched', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderDashboard();
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it('loads income, gigs and bookings successfully', async () => {
    renderDashboard();

    expect(await screen.findByRole('heading', { name: 'Dashboard' }))
      .toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith('/income');
    expect(api.get).toHaveBeenCalledWith('/gigs/mine');
    expect(api.get).toHaveBeenCalledWith('/bookings/mine');
  });

  it('displays the income summary', async () => {
    renderDashboard();

    expect(await screen.findByText('Total income')).toBeInTheDocument();
    expect(screen.getByText('This month')).toBeInTheDocument();
    expect(screen.getByText('Paid bookings')).toBeInTheDocument();
    expect(screen.getByText('Average per booking')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('displays monthly income records', async () => {
    renderDashboard();

    expect(await screen.findByText('September 2026')).toBeInTheDocument();
    expect(screen.getByText('October 2026')).toBeInTheDocument();
  });

  it('displays the freelancer gigs', async () => {
    renderDashboard();

    expect(await screen.findByRole('link', { name: 'Website Development' }))
      .toBeInTheDocument();

    expect(screen.getByText('Development')).toBeInTheDocument();
  });

  it('opens the form when New gig is clicked', async () => {
    renderDashboard();

    await screen.findByRole('heading', { name: 'My gigs' });
    fireEvent.click(screen.getByRole('button', { name: /new gig/i }));

    expect(screen.getByTestId('gig-form'))
      .toHaveTextContent('Creating new gig');
  });

  it('opens the form with the selected gig when Edit is clicked', async () => {
    renderDashboard();

    await screen.findByRole('link', { name: 'Website Development' });
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByTestId('gig-form'))
      .toHaveTextContent('Editing Website Development');
  });

  it('closes the gig form when Cancel is clicked', async () => {
    renderDashboard();

    await screen.findByRole('heading', { name: 'My gigs' });
    fireEvent.click(screen.getByRole('button', { name: /new gig/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByTestId('gig-form')).not.toBeInTheDocument();
  });

  it('deletes a gig after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    api.delete.mockResolvedValue({ data: { success: true } });

    renderDashboard();

    await screen.findByRole('link', { name: 'Website Development' });
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/gigs/gig-1');
    });

    expect(await screen.findByRole('status'))
      .toHaveTextContent('Gig deleted.');

    expect(screen.queryByRole('link', { name: 'Website Development' }))
      .not.toBeInTheDocument();

    // Existing booking history must remain visible.
    expect(screen.getByText('Website Development')).toBeInTheDocument();
  });

  it('does not delete a gig when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderDashboard();

    await screen.findByRole('link', { name: 'Website Development' });
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(api.delete).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Website Development' }))
      .toBeInTheDocument();
  });

  it('displays recent bookings', async () => {
    renderDashboard();

    expect(await screen.findByText('Recent bookings')).toBeInTheDocument();
    expect(screen.getByText('client@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Website Development')).toHaveLength(2);
  });

  it('displays an error when dashboard requests fail', async () => {
    api.get.mockRejectedValue(new Error('Network failure'));
    getErrorMessage.mockReturnValue('Cannot reach the server. Please try again.');

    renderDashboard();

    expect(await screen.findByRole('alert'))
      .toHaveTextContent('Cannot reach the server. Please try again.');
  });

  it('displays an error when deleting a gig fails', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    api.delete.mockRejectedValue(new Error('Delete failed'));
    getErrorMessage.mockReturnValue('Something went wrong. Please try again.');

    renderDashboard();

    await screen.findByRole('link', { name: 'Website Development' });
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByRole('alert'))
      .toHaveTextContent('Something went wrong. Please try again.');

    expect(screen.getByRole('link', { name: 'Website Development' }))
      .toBeInTheDocument();
  });
});
