// auth/handleSignUp.js
import { decode } from "cbor-x";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

async function handleSignUp(username, platform, developerId, projectId ,siteURL) {
    try {
        console.log(`Starting sign-up process for username: ${username}, platform: ${platform}`);
        
        // Generate challenge
        const challenge = Uint8Array.from("UZSL85T9AFC", c => c.charCodeAt(0));
        console.log('Generated challenge:', challenge);

        // Registration options for WebAuthn
        const registrationOptions = {
            publicKey: {
                challenge: challenge,
                rp: {
                    name: "Duo Security",
                    id: siteURL,
                },
                user: {
                    id: Uint8Array.from("UZSL85T9AFC", c => c.charCodeAt(0)),
                    name: username,
                    displayName: username,
                },
                pubKeyCredParams: [
                    { type: 'public-key', alg: -7 },
                    { type: 'public-key', alg: -257 }
                ],
                authenticatorSelection: {
                    authenticatorAttachment: platform ? 'cross-platform' : 'platform',
                    requireResidentKey: false,
                    userVerification: 'preferred',
                },
                timeout: 60000,
                attestation: 'direct'
            }
        };
        console.log('Registration options:', registrationOptions);

        // Create public key credential
        const credential = await navigator.credentials.create({
            publicKey: registrationOptions.publicKey
        });
        console.log('Created credential:', credential);

        // Decode client data and attestation object
        const utf8Decoder = new TextDecoder('utf-8');
        const decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON);
        console.log('Decoded client data:', decodedClientData);
        
        const clientDataObj = JSON.parse(decodedClientData);
        console.log('Client data object:', clientDataObj);
        
        const uint8Array = new Uint8Array(credential.response.attestationObject);
        const decodedAttestationObj = decode(uint8Array);
        console.log('Decoded attestation object:', decodedAttestationObj);
        
        const { authData } = decodedAttestationObj;

        const dataView = new DataView(new ArrayBuffer(2));
        const idLenBytes = authData.slice(53, 55);
        idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
        const credentialIdLength = dataView.getUint16();
    
        // get the credential ID
        const credentialId = authData.slice(55, 55 + credentialIdLength);
    
        // get the public key object
        const publicKeyBytes = authData.slice(55 + credentialIdLength);
        const publicKeyArray = new Uint8Array(publicKeyBytes); // Convert to Uint8Array
    
        const publicKeyObject = decode(publicKeyArray);
    
        console.log("publicKeyObject : ",publicKeyObject);
        console.log("credentialId : ", credentialId)
        console.log("publicKeyBytes : ", publicKeyBytes)

        // Prepare data for Firestore
        const data = {
            credentialId: Array.from(credentialId),
            publicKeyBytes: Array.from(publicKeyBytes),
            username: username,
            id: credential.id
        };
        console.log('Data to be pushed to Firestore:', data);

        // Push data to Firestore
        await pushData(data, developerId, projectId);

    } catch (error) {
        console.error('Error during registration:', error);
        alert("An error occurred during registration. Please try again.");
    }
}

async function pushData(data, developerId, projectId) {
    try {
        const docRef = await addDoc(collection(db, `devs/${developerId}/projects/${projectId}/users`), {
            ...data,
            createdAt: new Date()
        });
        console.log("Document written with ID:", docRef.id);
    } catch (error) {
        console.error('Error pushing data to Firestore:', error);
        alert("An error occurred while saving your data. Please try again.");
    }
}

export default handleSignUp;
