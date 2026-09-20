import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface PortfolioItem {
  id: string;
  imageSrc: string;
  titleKey?: string;
  customTitle?: string;
  customDescription?: string;
  category?: string;
  date?: string;
  isCustom?: boolean;
}

const DEFAULT_PROFILE_IMAGE = 'https://i.imgur.com/Ml4A0jp.jpeg';

const initialPortfolioItems: PortfolioItem[] = [
  { id: 'fish', imageSrc: 'https://i.imgur.com/pwdaI0K.jpeg', titleKey: 'cardFishTitle', category: 'মৎস্য উদ্যোগ', date: '2022 - বর্তমান' },
  { id: 'herdsman', imageSrc: 'https://i.imgur.com/gUf0IdJ.jpeg', titleKey: 'cardHerdsmanTitle', category: 'পশুপালন', date: '২০১৮ - বর্তমান' },
  { id: 'cattle', imageSrc: 'https://i.imgur.com/0BRpQFR.jpeg', titleKey: 'cardCattleTitle', category: 'গরু ব্যবসা', date: '২০১৯ - বর্তমান' },
  { id: 'livestock', imageSrc: 'https://i.imgur.com/7wk32QN.jpeg', titleKey: 'cardLivestockTitle', category: 'গবাদি পশু পালন', date: '২০১৭ - বর্তমান' },
  { id: 'fundraising', imageSrc: 'https://i.imgur.com/UC9VkNC.jpeg', titleKey: 'cardFundraisingTitle', category: 'সমাজসেবা', date: '২০১৫ - বর্তমান' },
  { id: 'phuchka', imageSrc: 'https://i.imgur.com/ZejPDtf.jpeg', titleKey: 'cardPhuchkaTitle', category: 'ব্যবসা ও খাদ্য', date: '২০১৬ - বর্তমান' },
  { id: 'social_participant', imageSrc: 'https://i.imgur.com/L9l8Qv7.jpeg', titleKey: 'cardSocialTitle', category: 'সামাজিক কর্মকাণ্ড', date: '২০১৪ - বর্তমান' },
  { id: 'agricultural_worker', imageSrc: 'https://i.imgur.com/BdDhKLV.jpeg', titleKey: 'cardAgriculturalTitle', category: 'কৃষি কাজ', date: '২০১২ - বর্তমান' },
  { id: 'carpenter', imageSrc: 'https://i.imgur.com/Z4gV5os.jpeg', titleKey: 'cardCarpenterTitle', category: 'কাঠ মিস্ত্রি', date: '২০১৩ - বর্তমান' },
  { id: 'farmer', imageSrc: 'https://i.imgur.com/hhxJcpc.jpeg', titleKey: 'cardFarmerTitle', category: 'কৃষক', date: '২০১০ - বর্তমান' },
  { id: 'construction_labour', imageSrc: 'https://i.imgur.com/bDFzOCF.jpeg', titleKey: 'cardConstructionTitle', category: 'নির্মাণ শ্রমিক', date: '২০১১ - ২০১৬' },
  { id: 'bus_contractor', imageSrc: 'https://i.imgur.com/BXrs4nD.jpeg', titleKey: 'cardBusContractorTitle', category: 'বাস কনট্রাক্টর', date: '২০১৪ - ২০১৮' },
  { id: 'potter', imageSrc: 'https://i.imgur.com/gN2HsMG.jpeg', titleKey: 'cardPotterTitle', category: 'মৃৎশিল্প ও হস্তশিল্প', date: '২০১৬ - বর্তমান' },
  { id: 'egg_seller', imageSrc: 'https://i.imgur.com/SJiM1zw.jpeg', titleKey: 'cardEggSellerTitle', category: 'ডিম বিক্রেতা ও খামার', date: '২০১৮ - বর্তমান' },
  { id: 'writer', imageSrc: 'https://i.imgur.com/3o67pf0.jpeg', titleKey: 'cardWriterTitle', category: 'সাহিত্য ও ব্লগিং', date: '২০১৫ - বর্তমান' },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'portfolio-store.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface DBData {
  items: PortfolioItem[];
  profileImage: string;
}

function readDb(): DBData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.items) && parsed.items.length > 0) {
        return {
          items: parsed.items,
          profileImage: parsed.profileImage || DEFAULT_PROFILE_IMAGE,
        };
      }
    }
  } catch (err) {
    console.error('Error reading DB:', err);
  }

  const initial: DBData = {
    items: initialPortfolioItems,
    profileImage: DEFAULT_PROFILE_IMAGE,
  };
  writeDb(initial);
  return initial;
}

function writeDb(data: DBData): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Convert base64 data to static file in /uploads
function saveBase64Image(dataUri: string, prefix = 'photo'): string {
  if (!dataUri || !dataUri.startsWith('data:image/')) {
    return dataUri;
  }

  try {
    const matches = dataUri.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length < 3) return dataUri;

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to save base64 image:', err);
    return dataUri;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support large base64 uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve static uploaded images
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get portfolio items & profile image
  app.get('/api/portfolio', (req, res) => {
    const db = readDb();
    res.json(db);
  });

  // Add new portfolio item
  app.post('/api/portfolio/item', (req, res) => {
    try {
      const { item } = req.body;
      if (!item) {
        return res.status(400).json({ error: 'Missing item' });
      }

      const db = readDb();
      let processedSrc = item.imageSrc;
      if (processedSrc && processedSrc.startsWith('data:image/')) {
        processedSrc = saveBase64Image(processedSrc, 'portfolio');
      }

      const newItem: PortfolioItem = {
        ...item,
        id: item.id || `custom_${Date.now()}`,
        imageSrc: processedSrc,
        isCustom: true,
      };

      // Put newly uploaded item at the top of the gallery
      db.items = [newItem, ...db.items.filter((it) => it.id !== newItem.id)];
      writeDb(db);

      res.json({ success: true, item: newItem, items: db.items });
    } catch (err) {
      console.error('Error adding item:', err);
      res.status(500).json({ error: 'Failed to save item' });
    }
  });

  // Delete an item
  app.delete('/api/portfolio/item/:id', (req, res) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.items = db.items.filter((it) => it.id !== id);
      writeDb(db);
      res.json({ success: true, items: db.items });
    } catch (err) {
      console.error('Error deleting item:', err);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  // Update profile image
  app.post('/api/portfolio/profile-image', (req, res) => {
    try {
      let { imageSrc } = req.body;
      if (!imageSrc) {
        return res.status(400).json({ error: 'Missing imageSrc' });
      }

      if (imageSrc.startsWith('data:image/')) {
        imageSrc = saveBase64Image(imageSrc, 'profile');
      }

      const db = readDb();
      db.profileImage = imageSrc;
      writeDb(db);

      res.json({ success: true, profileImage: imageSrc });
    } catch (err) {
      console.error('Error saving profile image:', err);
      res.status(500).json({ error: 'Failed to save profile image' });
    }
  });

  // Auto-sync client items from localStorage (ensures previous uploads are published globally)
  app.post('/api/portfolio/sync', (req, res) => {
    try {
      const { localItems, localProfileImage } = req.body;
      const db = readDb();
      let modified = false;

      if (Array.isArray(localItems)) {
        for (const it of localItems) {
          if (it.isCustom && !db.items.some((existing) => existing.id === it.id)) {
            let processedSrc = it.imageSrc;
            if (processedSrc && processedSrc.startsWith('data:image/')) {
              processedSrc = saveBase64Image(processedSrc, 'sync_photo');
            }
            db.items.unshift({
              ...it,
              imageSrc: processedSrc,
            });
            modified = true;
          }
        }
      }

      if (
        localProfileImage &&
        localProfileImage !== DEFAULT_PROFILE_IMAGE &&
        localProfileImage !== db.profileImage
      ) {
        let processedProfile = localProfileImage;
        if (processedProfile.startsWith('data:image/')) {
          processedProfile = saveBase64Image(processedProfile, 'sync_profile');
        }
        db.profileImage = processedProfile;
        modified = true;
      }

      if (modified) {
        writeDb(db);
      }

      res.json({ success: true, items: db.items, profileImage: db.profileImage });
    } catch (err) {
      console.error('Error syncing items:', err);
      res.status(500).json({ error: 'Failed to sync items' });
    }
  });

  // Reset to default
  app.post('/api/portfolio/reset', (req, res) => {
    try {
      const resetData: DBData = {
        items: initialPortfolioItems,
        profileImage: DEFAULT_PROFILE_IMAGE,
      };
      writeDb(resetData);
      res.json({ success: true, items: resetData.items, profileImage: resetData.profileImage });
    } catch (err) {
      console.error('Error resetting:', err);
      res.status(500).json({ error: 'Failed to reset' });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
