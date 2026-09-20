import { PortfolioItem } from '../types';
import { initialPortfolioItems, DEFAULT_PROFILE_IMAGE } from '../data/portfolioData';

const PORTFOLIO_STORAGE_KEY = 'ashaduzzaman_portfolio_items_v1';
const PROFILE_IMG_STORAGE_KEY = 'ashaduzzaman_profile_image_v1';
const ADMIN_AUTH_KEY = 'ashaduzzaman_admin_auth_v1';
const ADMIN_PASSWORD_KEY = 'ashaduzzaman_admin_pwd_v1';

export const DEFAULT_ADMIN_PASSWORD = '1234';

export function getAdminPassword(): string {
  try {
    const custom = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (custom && custom.trim().length > 0) {
      return custom;
    }
  } catch (err) {
    console.error('Failed to read admin password:', err);
  }
  return DEFAULT_ADMIN_PASSWORD;
}

export function saveAdminPassword(newPwd: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPwd);
  } catch (err) {
    console.error('Failed to save admin password:', err);
  }
}

export function isAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(isAuth: boolean): void {
  try {
    if (isAuth) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (err) {
    console.error('Failed to update admin auth status:', err);
  }
}

export function verifyAdminPassword(pwd: string): boolean {
  const current = getAdminPassword();
  return pwd.trim() === current.trim();
}

export function getSavedPortfolioItems(): PortfolioItem[] {
  const possibleKeys = [
    PORTFOLIO_STORAGE_KEY,
    'ashaduzzaman_portfolio_items',
    'portfolio_items',
    'portfolio_items_v1',
  ];

  for (const key of possibleKeys) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // try next key
    }
  }
  return initialPortfolioItems;
}

export function savePortfolioItems(items: PortfolioItem[]): void {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save portfolio items to localStorage:', err);
  }
}

export function getSavedProfileImage(): string {
  try {
    const saved = localStorage.getItem(PROFILE_IMG_STORAGE_KEY);
    if (saved) return saved;
  } catch (err) {
    console.error('Failed to load profile image:', err);
  }
  return DEFAULT_PROFILE_IMAGE;
}

export function saveProfileImage(urlOrBase64: string): void {
  try {
    localStorage.setItem(PROFILE_IMG_STORAGE_KEY, urlOrBase64);
  } catch (err) {
    console.error('Failed to save profile image:', err);
  }
}

export function resetToDefaultItems(): PortfolioItem[] {
  try {
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    localStorage.removeItem(PROFILE_IMG_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset storage:', err);
  }
  return initialPortfolioItems;
}

/**
 * Remote API functions to sync photos to the global backend server
 * so any visitor worldwide can view custom uploaded photos.
 */
export async function fetchPortfolioData(): Promise<{ items: PortfolioItem[]; profileImage: string } | null> {
  try {
    const res = await fetch('/api/portfolio');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items)) {
        const local = getSavedPortfolioItems();
        const localCustoms = local.filter(
          (it) =>
            it.isCustom === true ||
            (typeof it.id === 'string' && it.id.startsWith('custom')) ||
            Boolean(it.customTitle) ||
            !initialPortfolioItems.some((init) => init.id === it.id)
        );

        // If local had custom items that aren't yet in server data, keep them merged
        if (localCustoms.length > 0) {
          const merged = [...data.items];
          for (const cIt of localCustoms) {
            if (!merged.some((m) => m.id === cIt.id)) {
              merged.unshift(cIt);
            }
          }
          savePortfolioItems(merged);
        } else {
          savePortfolioItems(data.items);
        }
      }
      if (data.profileImage) {
        saveProfileImage(data.profileImage);
      }
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch from server, using local fallback cache:', err);
  }
  return null;
}

export async function addPortfolioItemRemote(item: PortfolioItem): Promise<PortfolioItem[] | null> {
  try {
    const res = await fetch('/api/portfolio/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.items) {
        savePortfolioItems(data.items);
        return data.items;
      }
    }
  } catch (err) {
    console.error('Error posting item to server:', err);
  }
  return null;
}

export async function deletePortfolioItemRemote(id: string): Promise<PortfolioItem[] | null> {
  try {
    const res = await fetch(`/api/portfolio/item/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.items) {
        savePortfolioItems(data.items);
        return data.items;
      }
    }
  } catch (err) {
    console.error('Error deleting item from server:', err);
  }
  return null;
}

export async function saveProfileImageRemote(imageSrc: string): Promise<string | null> {
  try {
    const res = await fetch('/api/portfolio/profile-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageSrc }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profileImage) {
        saveProfileImage(data.profileImage);
        return data.profileImage;
      }
    }
  } catch (err) {
    console.error('Error saving profile image to server:', err);
  }
  return null;
}

export async function syncLocalToServer(): Promise<{ items: PortfolioItem[]; profileImage: string } | null> {
  try {
    const localItems = getSavedPortfolioItems();
    const localProfileImage = getSavedProfileImage();
    const hasCustom = localItems.some(
      (it) =>
        it.isCustom === true ||
        (typeof it.id === 'string' && it.id.startsWith('custom')) ||
        Boolean(it.customTitle) ||
        !initialPortfolioItems.some((init) => init.id === it.id)
    );
    const hasCustomProfile = localProfileImage !== DEFAULT_PROFILE_IMAGE;

    if (!hasCustom && !hasCustomProfile) {
      return null;
    }

    const res = await fetch('/api/portfolio/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ localItems, localProfileImage }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items)) {
        savePortfolioItems(data.items);
      }
      if (data.profileImage) {
        saveProfileImage(data.profileImage);
      }
      return data;
    }
  } catch (err) {
    console.warn('Error during auto-sync to server:', err);
  }
  return null;
}

export async function resetPortfolioRemote(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch('/api/portfolio/reset', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      if (data.items) {
        savePortfolioItems(data.items);
        saveProfileImage(data.profileImage || DEFAULT_PROFILE_IMAGE);
        return data.items;
      }
    }
  } catch (err) {
    console.error('Error resetting server data:', err);
  }
  return resetToDefaultItems();
}

/**
 * Optimizes and resizes an uploaded image file to max width/height of 1200px
 * and compresses as JPEG so it fits smoothly in local storage.
 */
export async function optimizeImageFile(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image file'));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
