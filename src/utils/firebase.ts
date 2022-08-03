import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID } from "./constants";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, Firestore, doc, updateDoc, arrayUnion, getDoc, setDoc, DocumentData, DocumentReference } from 'firebase/firestore/lite';
import { AddressBook } from "store/user";

export class Firebase {
    static saveAddressBook = (address: string, addressBook: AddressBook): Promise<void> => {
        return setDoc(getAddressBookDoc(address), { addressBook });
    };

    static getAddressBook = (address: string): Promise<AddressBook> => {
        return getDoc(getAddressBookDoc(address)).then(d => d.data()?.addressBook)
    };
}

const getAddressBookDoc = (address: string): DocumentReference<DocumentData> => {
    const db = useFirestore()
    return doc(db, "address-book", address)
}

const useFirestore = (): Firestore => {
    const firebaseConfig = {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID
    };

    const app = initializeApp(firebaseConfig);
    return getFirestore(app)
}