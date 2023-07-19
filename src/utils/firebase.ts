import { FIREBASE_DOMAIN, FIREBASE_ADDRESS_BOOK_COLLECTION, FIREBASE_PROJECT_ID, FIREBASE_AUTH_NONCE_URL, FIREBASE_AUTH_VERIFY_URL, FIREBASE_API_KEY } from "./constants";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { AddressBook } from "store/user";
import axios from "axios";
import { getSigningClient } from "./config";

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_DOMAIN,
    projectId: FIREBASE_PROJECT_ID
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export const auth = getAuth(app);

export const authenticate = async (address: string, connectedLedger: string) => {
    try {
        const nonceRes = await axios.post(FIREBASE_AUTH_NONCE_URL, { address });
        const client = await getSigningClient(connectedLedger!);
        const { signature, chainId, sequence, accountNumber } = await client.signNonceMsg(address!, nonceRes.data.nonce);
        const verifyRes = await axios.post(FIREBASE_AUTH_VERIFY_URL, { address, signature, chainId, sequence, accountNumber });
        return verifyRes.data.token;
    } catch {
        throw new Error("Error while getting address book from Firebase")
    }
}

export const getAddressBook = async (address): Promise<AddressBook> => {
    try {
        const addressBookDoc = await getDoc(doc(firestore, FIREBASE_ADDRESS_BOOK_COLLECTION, address));
        return addressBookDoc.data()?.addressBook ?? {};
    } catch {
        throw new Error("Error while getting address book from Firebase")
    }
};

export const saveAddressBook = async (address: string, addressBook: AddressBook): Promise<void> => {
    try {
        const addressBookDoc = doc(firestore, FIREBASE_ADDRESS_BOOK_COLLECTION, address);
        return setDoc(addressBookDoc, { addressBook });
    } catch {
        throw new Error("Error while saving address book to Firebase")
    }
};