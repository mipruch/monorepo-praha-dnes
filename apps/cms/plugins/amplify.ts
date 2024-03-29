import {Amplify} from "aws-amplify";
import {signIn, signOut, type SignInInput} from "aws-amplify/auth";
import awsExports from "../src/aws-exports";

export default defineNuxtPlugin((nuxtApp) => {
	Amplify.configure(awsExports);
	return {
		provide: {
			signIn: signIn,
			signOut: signOut as () => Promise<void>,
		},
	};
});
