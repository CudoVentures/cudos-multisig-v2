import { FIREBASE_DOMAIN, FIREBASE_ADDRESS_BOOK_COLLECTION, FIREBASE_PROJECT_ID, FIREBASE_AUTH_NONCE_URL, FIREBASE_AUTH_VERIFY_URL, FIREBASE_API_KEY, MY_OWN_ADDRESS_NAME } from "./constants";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { AddressBook } from "store/user";
import axios from "axios";
import { SUPPORTED_WALLET } from "cudosjs";
import { signArbitrary } from "./helpers";

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_DOMAIN,
    projectId: FIREBASE_PROJECT_ID
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export const auth = getAuth(app);

export const authenticate = async (address: string, collection: string, connectedWallet: SUPPORTED_WALLET) => {
    try {
        const nonceRes = await axios.post(FIREBASE_AUTH_NONCE_URL, { address, collection });
        const { signature } = await signArbitrary(connectedWallet, address, nonceRes.data.nonce);
        const verifyRes = await axios.post(FIREBASE_AUTH_VERIFY_URL, { address, signature, collection });
        return verifyRes.data.token;
    } catch (error) {
        throw new Error("Firebase authentication error")
    }
}

export const getAddressBook = async (addressBookOwnerAddress: string): Promise<AddressBook> => {
    try {
        const addressBookDoc = await getDoc(doc(firestore, FIREBASE_ADDRESS_BOOK_COLLECTION, addressBookOwnerAddress));
        let addressBook = addressBookDoc.data()?.addressBook ?? {};
        // Check if owner is already inside the addressbook
        if (
            !addressBook[addressBookOwnerAddress] ||
            addressBook[addressBookOwnerAddress] !== MY_OWN_ADDRESS_NAME
        ) {
            //And automatically add it if not
            addressBook[addressBookOwnerAddress] = MY_OWN_ADDRESS_NAME
            await saveAddressBook(addressBookOwnerAddress, addressBook)
        }
        return addressBook
    } catch (error) {
        throw new Error("Error while getting address book from Firebase")
    }
};

export const saveAddressBook = async (addressBookOwnerAddress: string, addressBook: AddressBook): Promise<void> => {
    try {
        const addressBookDoc = doc(firestore, FIREBASE_ADDRESS_BOOK_COLLECTION, addressBookOwnerAddress);
        return setDoc(addressBookDoc, { addressBook }, { merge: true });
    } catch {
        throw new Error("Error while saving address book to Firebase")
    }
};