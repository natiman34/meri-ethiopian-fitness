import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '../../pages/auth/ResetPassword';
import { AuthProvider } from '../../contexts/AuthContext';
// Mock the AuthContext
const mockResetPassword = vi.fn();
const mockAuthContext = {
    resetPassword: mockResetPassword,
    authError: null,
    isLoading: false,
    user: null,
    session: null,
    isAuthenticated: false,
    isAdmin: false,
    isSuperAdmin: false,
    isContentManager: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn()
};
vi.mock('../../contexts/AuthContext', () => ({
    useAuth: () => mockAuthContext,
    AuthProvider: ({ children }) => _jsx("div", { children: children })
}));
// Mock Supabase
vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            resetPasswordForEmail: vi.fn()
        }
    }
}));
const renderWithRouter = (component) => {
    return render(_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: component }) }));
};
describe('ResetPassword Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('renders reset password form', () => {
        renderWithRouter(_jsx(ResetPassword, {}));
        expect(screen.getByText('Reset your password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument();
    });
    it('validates email format', async () => {
        renderWithRouter(_jsx(ResetPassword, {}));
        const emailInput = screen.getByPlaceholderText('Enter your email address');
        const submitButton = screen.getByRole('button', { name: /send reset email/i });
        // Enter invalid email
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
        });
        expect(mockResetPassword).not.toHaveBeenCalled();
    });
    it('calls resetPassword with valid email', async () => {
        mockResetPassword.mockResolvedValueOnce(undefined);
        renderWithRouter(_jsx(ResetPassword, {}));
        const emailInput = screen.getByPlaceholderText('Enter your email address');
        const submitButton = screen.getByRole('button', { name: /send reset email/i });
        // Enter valid email
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith('test@example.com');
        });
    });
    it('shows success message after successful reset', async () => {
        mockResetPassword.mockResolvedValueOnce(undefined);
        renderWithRouter(_jsx(ResetPassword, {}));
        const emailInput = screen.getByPlaceholderText('Enter your email address');
        const submitButton = screen.getByRole('button', { name: /send reset email/i });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('Check your email')).toBeInTheDocument();
            expect(screen.getByText(/We've sent a password reset link to/)).toBeInTheDocument();
        });
    });
    it('shows error message on reset failure', async () => {
        const errorMessage = 'No account found with this email address';
        mockResetPassword.mockRejectedValueOnce(new Error(errorMessage));
        renderWithRouter(_jsx(ResetPassword, {}));
        const emailInput = screen.getByPlaceholderText('Enter your email address');
        const submitButton = screen.getByRole('button', { name: /send reset email/i });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
