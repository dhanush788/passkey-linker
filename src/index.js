// src/index.js
import handleSignUp from './auth/handleSignup';
import handleSignIn from './auth/handleSignIn';

// Example usage
(async () => {
    try {
        const username = 'exampleUser';
        const platform = 'web'; // Example platform

        // Handle sign up
        await handleSignUp(username, platform);

        // Handle sign in
        const assertion = await handleSignIn(username);
        console.log('Sign in successful:', assertion);

    } catch (error) {
        console.error('Error in main application:', error);
    }
})();
