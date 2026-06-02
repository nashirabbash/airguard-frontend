import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthCard } from '../../src/components/organisms/AuthCard';

const apiFetchMock = vi.fn();

vi.mock('../../src/utils/api', () => ({
  apiFetch: (...args: unknown[]) => apiFetchMock(...args),
}));

describe('AuthCard integration', () => {
  it('submits credentials and calls onSuccess', async () => {
    const onSuccess = vi.fn();
    apiFetchMock.mockResolvedValueOnce({
      success: true,
      data: { token: 'token-123' },
    });

    render(<AuthCard onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText('USERNAME'), { target: { value: 'demo' } });
    fireEvent.change(screen.getByLabelText('PASSWORD'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'MASUK' }));

    await waitFor(() => expect(apiFetchMock).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { username: 'demo', password: 'secret' },
    }));
    expect(onSuccess).toHaveBeenCalledWith('token-123');
  });
});
