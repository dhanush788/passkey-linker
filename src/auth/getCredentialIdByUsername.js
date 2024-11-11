// auth/getCredentialIdByUsername.js
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

async function getCredentialIdByUsername(username , developerId , projectId) {
    try {
        // const developerId = "UlLgFDWFvUUvL8A3b9pH";
        // const projectId = "TqxMGwBYdsdEGImsR3lr";
        const q = query(collection(db, 'devs', developerId, 'projects', projectId, 'users'), where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0];
            const userData = docSnapshot.data();
            const credentialId = userData.credentialId;
            return credentialId;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export { getCredentialIdByUsername };
