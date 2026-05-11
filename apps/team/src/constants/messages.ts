
/**
 * Centralized auth-related user-facing messages.
 * Used so all login/error copy lives in one place: easier to change wording,
 * support i18n later, and keep UX consistent across AuthAction and any UI that shows these messages.
 */
export const authMessages = {
  login: {
    success: 'Login successful',
    failed: 'Login failed. Please try again.',
    invalidResponse: 'Invalid response from server',
    tokenNotReceived: 'Authentication token was not received',
  },
  logout: {
    success: 'Logout successful',
    failed: 'Logout failed. Please try again.',
    invalidResponse: 'Invalid response from server',
  },
  forgotPassword: {
    success:
      "If an account exists for this email, you will receive reset instructions.",
    failed: "Could not send reset email. Please try again.",
  },
  validateOTP: {
		success: "OTP verified successfully.",
		failed: "Invalid OTP. Please try again.",
	},
	resetPassword: {
		success: "Password reset successful.",
		failed: "Could not reset password. Please try again.",
	},
};