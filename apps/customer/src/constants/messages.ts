/**
 * Centralized auth-related user-facing messages.
 * Used so all login/error copy lives in one place: easier to change wording,
 * support i18n later, and keep UX consistent across AuthAction and any UI that shows these messages.
 */
export const authMessages = {
	login: {
		success: "Login successful",
		failed: "Login failed. Please try again.",
		invalidResponse: "Invalid response from server",
		tokenNotReceived: "Authentication token was not received",
	},
	logout: {
		success: "Logout successful",
		failed: "Logout failed. Please try again.",
		invalidResponse: "Invalid response from server",
	},
	register: {
		success: "Registration successful. You can now log in.",
		failed: "Registration failed. Please try again.",
		invalidResponse: "Invalid response from server",
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
	verifyEmail: {
		success: "Email verified successfully.",
		failed: "Email verification failed. Please try again.",
	},
};

export const projectMessages = {
	save: {
		success: "Project saved successfully",
		failed: "Failed to save project. Please try again.",
		invalidResponse: "Invalid response from server",
	},
	archive: {
		success: "Project archived successfully",
		failed: "Failed to archive project. Please try again.",
	},
	delete: {
		success: "Project deleted successfully",
		failed: "Failed to delete project. Please try again.",
	},
};
