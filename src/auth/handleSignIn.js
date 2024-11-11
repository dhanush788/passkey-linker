// auth/handleSignIn.js
import { getCredentialIdByUsername } from './getCredentialIdByUsername'; // Assuming getCredentialIdByUsername is exported

async function handleSignIn(username, developerId, projectId, platform = false) {
    try {
        console.log(`Attempting to sign in for username: ${username}`);
        const credentialIdEncoded = await getCredentialIdByUsername(username, developerId, projectId);
        console.log(`Encoded Credential ID from DB: ${credentialIdEncoded}`);

        if (!credentialIdEncoded) {
            console.error(`Credential ID not found for username: ${username}`);
            alert(`Credential ID not found for username: ${username}`);
            return null;
        }

        // Decode the credential ID if it's CBOR encoded
        const credentialId = new Uint8Array(credentialIdEncoded);
        console.log(`Decoded Credential ID: ${credentialId}`);

        const transports = platform ? ['hybrid'] : ['internal'];

        const publicKeyCredentialRequestOptions = {
            challenge: Uint8Array.from('UZSL85T9AFC', c => c.charCodeAt(0)),
            allowCredentials: [{
                id: new Uint8Array(credentialId),
                type: 'public-key',
                transports: transports,
            }],
            timeout: 60000,
        };

        console.log('PublicKeyCredentialRequestOptions:', publicKeyCredentialRequestOptions);

        const assertion = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions
        });

        console.log('Assertion:', assertion);

        const authenticatorDataBytes = new Uint8Array(assertion.response.authenticatorData);
        const clientDataHashBytes = new Uint8Array(assertion.response.clientDataJSON);  
        const signedData = new Uint8Array(authenticatorDataBytes.length + clientDataHashBytes.length);
        signedData.set(authenticatorDataBytes, 0);
        signedData.set(clientDataHashBytes, authenticatorDataBytes.length);

        console.log('Signed Data:', signedData);

        // const isSignatureValid = await verifySignature(assertion.response.signature, signedData, credentialId);
        // console.log('Is Signature Valid:', isSignatureValid);

        return assertion;

    } catch (error) {
        console.error('Error during sign-in:', error);
        alert("An error occurred during sign-in. Please try again.");
        throw error;
    }
}

export default handleSignIn;
