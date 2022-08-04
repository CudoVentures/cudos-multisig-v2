import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD, FIREBASE_COLLECTION_NAME, FIREBASE_PROJECT_ID } from "./constants";
import { initializeApp } from 'firebase/app';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { AddressBook } from "store/user";

export class Firebase {
    static saveAddressBook = async (address: string, addressBook: AddressBook): Promise<void> => {
        const db = await useFirestore();
        const addressBookDoc = doc(db, FIREBASE_COLLECTION_NAME, address);
        return setDoc(addressBookDoc, { addressBook });
    };

    static getAddressBook = async (address: string): Promise<AddressBook> => {
        const db = await useFirestore();
        const addressBookDoc = await getDoc(doc(db, FIREBASE_COLLECTION_NAME, address));
        return addressBookDoc.data()?.addressBook ?? {};
    };
}

const useFirestore = async (): Promise<Firestore> => {
    const firebaseConfig = {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD);
    return getFirestore(app);
}