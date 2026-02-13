import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBy1Alm4T10vtKM_IIAVcoPs1knWzbPFSc",
    authDomain: "rond-point-rental-487018.firebaseapp.com",
    projectId: "rond-point-rental-487018",
    storageBucket: "rond-point-rental-487018.appspot.com",
    messagingSenderId: "549090464338",
    appId: "1:549090464338:web:49f6c316f0b9ca64cb458b"
};

// Singleton pattern to avoid re-initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadToStorage = async (file: File, folder: string = 'properties'): Promise<string> => {
    // Create a unique filename (timestamp + random string) to avoid collisions
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = `${folder}/${filename}`;

    const storageRef = ref(storage, path);

    // Set metadata
    const metadata = {
        contentType: file.type,
    };

    await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
};

export { storage };
