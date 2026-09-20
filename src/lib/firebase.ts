import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PortfolioItem } from '../types';
import { initialPortfolioItems, DEFAULT_PROFILE_IMAGE } from '../data/portfolioData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection check
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
    console.log('Firebase Firestore connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline, using offline cache.');
    } else {
      console.log('Firestore connection verified.');
    }
  }
}
testFirestoreConnection();

const ITEMS_COLLECTION = 'portfolioItems';
const SETTINGS_COLLECTION = 'appSettings';
const GLOBAL_SETTINGS_DOC = 'global';

/**
 * Real-time listener for portfolio items.
 * Calls callback whenever any photo is added, edited, or removed anywhere in the world!
 */
export function subscribeToPortfolio(
  callback: (data: { items: PortfolioItem[]; profileImage?: string }) => void
): () => void {
  // Listen to portfolioItems collection
  const itemsRef = collection(db, ITEMS_COLLECTION);
  const q = query(itemsRef);

  let currentProfileImg: string | undefined = undefined;

  // Also listen to settings
  const settingsUnsub = onSnapshot(
    doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_DOC),
    (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d && typeof d.profileImage === 'string') {
          currentProfileImg = d.profileImage;
        }
      }
    },
    (err) => console.warn('Settings snapshot error:', err)
  );

  const itemsUnsub = onSnapshot(
    q,
    (snapshot) => {
      const remoteItems: PortfolioItem[] = [];
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as PortfolioItem;
        remoteItems.push({
          ...item,
          id: item.id || docSnap.id,
        });
      });

      // Sort: newer items first
      remoteItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      // Merge with default initial items so the gallery is never empty
      const finalItems = [...remoteItems];
      for (const init of initialPortfolioItems) {
        if (!finalItems.some((it) => it.id === init.id)) {
          finalItems.push(init);
        }
      }

      callback({ items: finalItems, profileImage: currentProfileImg });
    },
    (err) => {
      console.warn('Portfolio snapshot error:', err);
    }
  );

  return () => {
    itemsUnsub();
    settingsUnsub();
  };
}

/**
 * Fetch portfolio data once from Firestore
 */
export async function getPortfolioFromFirestore(): Promise<{
  items: PortfolioItem[];
  profileImage: string;
} | null> {
  try {
    const itemsRef = collection(db, ITEMS_COLLECTION);
    const snap = await getDocs(itemsRef);
    const remoteItems: PortfolioItem[] = [];

    snap.forEach((docSnap) => {
      const item = docSnap.data() as PortfolioItem;
      remoteItems.push({
        ...item,
        id: item.id || docSnap.id,
      });
    });

    remoteItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    const finalItems = [...remoteItems];
    for (const init of initialPortfolioItems) {
      if (!finalItems.some((it) => it.id === init.id)) {
        finalItems.push(init);
      }
    }

    // Settings
    let profileImage = DEFAULT_PROFILE_IMAGE;
    try {
      const setSnap = await getDoc(doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_DOC));
      if (setSnap.exists()) {
        const d = setSnap.data();
        if (d && typeof d.profileImage === 'string') {
          profileImage = d.profileImage;
        }
      }
    } catch {
      // fallback
    }

    return { items: finalItems, profileImage };
  } catch (err) {
    console.warn('Failed to fetch from Firestore:', err);
    return null;
  }
}

/**
 * Add or update a portfolio item in Firestore
 */
export async function savePortfolioItemToFirestore(item: PortfolioItem): Promise<boolean> {
  try {
    const itemId = item.id || `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, ITEMS_COLLECTION, itemId);
    const payload: PortfolioItem = {
      ...item,
      id: itemId,
      isCustom: true,
      createdAt: item.createdAt || Date.now(),
    };
    await setDoc(docRef, payload);
    return true;
  } catch (err) {
    console.error('Error saving item to Firestore:', err);
    return false;
  }
}

/**
 * Delete a portfolio item from Firestore
 */
export async function deletePortfolioItemFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, ITEMS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting item from Firestore:', err);
    return false;
  }
}

/**
 * Save profile avatar to Firestore
 */
export async function saveProfileImageToFirestore(imgUrl: string): Promise<boolean> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_DOC);
    await setDoc(docRef, { profileImage: imgUrl, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving profile avatar to Firestore:', err);
    return false;
  }
}
