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
  try {
    const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load portfolio items from localStorage:', err);
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
