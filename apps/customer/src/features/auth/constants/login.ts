import { LoginFormValues } from "../types";

export const DUMMY_LOGIN_CREDENTIALS: LoginFormValues = {
	email: "",
	password: "",
};

export const LOGIN_DEFAULT_VALUES: LoginFormValues = {
	email: DUMMY_LOGIN_CREDENTIALS.email,
	password: DUMMY_LOGIN_CREDENTIALS.password,
};
