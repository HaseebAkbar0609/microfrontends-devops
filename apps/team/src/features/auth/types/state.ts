export interface AuthState {
	token: string | null;
	user: unknown;
	isAuthenticated: boolean;
}
