import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, doc, collection, getDocs, addDoc, getDoc} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAYERkcl18zIg4vzH1wF-M6bVp9myq71Tk",
    authDomain: "mitrak-7.firebaseapp.com",
    projectId: "mitrak-7",
    storageBucket: "mitrak-7.appspot.com",
    messagingSenderId: "970631936656",
    appId: "1:970631936656:web:17f6d7cdbfbff4e87ab615"
};

initializeApp(firebaseConfig);
const db = getFirestore();

export async function setInvigilators(rows) {
    const batch = writeBatch(db);

    for (const row of rows) {
        const rowRef = doc(db, "invigilators", String(row.sequence));
        batch.set(rowRef, row);
    }

    await batch.commit();
}

export async function getInvigilators() {
    const querySnapshot = await getDocs(collection(db, "invigilators"));
    const data = [];
    querySnapshot.forEach((doc) => data.push(doc.data()));
    return data;
}

export async function addArrangement(data) {
    const docRef = await addDoc(collection(db, "arrangements"), data);
    return docRef.id;
}

export async function getArrangement(id) {
    const docRef = doc(db, "arrangements", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        throw new Error('No such document!')
    }
}

export async function getArrangements() {
    const querySnapshot = await getDocs(collection(db, "arrangements"));
    const data = [];
    querySnapshot.forEach((doc) => data.push({id: doc.id, ...doc.data()}));
    return data;
}
