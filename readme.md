# WebAuthn Authentication Module

`WebAuthn Authentication Module` is a JavaScript module designed to handle the WebAuthn sign-in and sign-up processes for users. It facilitates secure authentication by interacting with the browser's WebAuthn API and storing credentials in Firestore.

## Installation

Install the package via npm:

```bash
npm install passkey_linker
```

# Usage
## Importing Functions
First, import the handleSignIn and handleSignUp functions from the package:

```bash
import handleSignIn from 'passkey_linker/src/auth/handleSignIn';
import handleSignUp from 'passkey_linker/src/auth/handleSignUp';
```

handleSignIn
Description
The handleSignIn function is an asynchronous function that handles the WebAuthn sign-in process for a user.

Parameters
username (string): The username of the user attempting to sign in.
developerId (string): The developer ID associated with the user.
projectId (string): The project ID associated with the user.
Returns
Returns the assertion object if the sign-in process is successful.
Returns null if the credential ID is not found.
Throws an error if an exception occurs during the process.
Example Usage

```bash
async function signInUser() {
    try {
        const assertion = await handleSignIn('username', 'developerId', 'projectId');
        if (assertion) {
            console.log('Sign-in successful:', assertion);
        } else {
            console.log('Sign-in failed.');
        }
    } catch (error) {
        console.error('Error during sign-in process:', error);
    }
}

signInUser();
```

handleSignUp
Description
The handleSignUp function is an asynchronous function that handles the WebAuthn sign-up process for a user.

Parameters
username (string): The username of the user attempting to sign up.
platform (boolean): Indicates whether the platform is cross-platform (true) or platform (false).
developerId (string): The developer ID associated with the user.
projectId (string): The project ID associated with the user.
Example Usage

```bash
async function signUpUser() {
    try {
        await handleSignUp('username', true, 'developerId', 'projectId');
        console.log('Sign-up successful.');
    } catch (error) {
        console.error('Error during sign-up process:', error);
    }
}

signUpUser();
```
