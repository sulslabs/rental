import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
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
