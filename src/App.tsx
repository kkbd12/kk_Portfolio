import { useState, useCallback, useEffect, useMemo } from 'react';
import { Language, PortfolioItem, ModalData } from './types';
import { translations } from './data/translations';
import { experienceData, skillCategories } from './data/portfolioData';
import {
  getSavedPortfolioItems,
  savePortfolioItems,
  getSavedProfileImage,
  saveProfileImage,
  resetToDefaultItems,
  isAdminAuthenticated,
  setAdminAuthenticated,
  fetchPortfolioData,
  addPortfolioItemRemote,
  deletePortfolioItemRemote,
  saveProfileImageRemote,
  syncLocalToServer,
  resetPortfolioRemote,
} from './utils/storage';

import { LanguageSelector } from './components/LanguageSelector';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { PortfolioCard } from './components/PortfolioCard';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { PortfolioDetailModal } from './components/PortfolioDetailModal';
import { ProfilePhotoModal } from './components/ProfilePhotoModal';
import { AddressModal } from './components/AddressModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { AdminBar } from './components/AdminBar';

import {
  Camera,
  RotateCcw,
  Sparkles,
  Filter,
  CheckCircle,
  Lock,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [profileImage, setProfileImage] = useState<string>(() => getSavedProfileImage());
  const [items, setItems] = useState<PortfolioItem[]>(() => getSavedPortfolioItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminAuthenticated());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    title: '',
    content: '',
  });

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations['bn']?.[key] || key;
    },
    [language]
  );

  const isRtl = false;

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.dir = 'ltr';
    document.title = t('appTitle') || 'Md. Ashaduzzaman Portfolio';
  }, [language, t]);

  // Load from remote server and auto-sync any photos previously saved in localStorage
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // First, check if this browser has any custom photos in localStorage and auto-sync them to server
        const synced = await syncLocalToServer();
        if (synced && isMounted && Array.isArray(synced.items) && synced.items.length > 0) {
          setItems(synced.items);
          if (synced.profileImage) setProfileImage(synced.profileImage);
          return;
        }

        // Otherwise fetch latest data from server
        const remoteData = await fetchPortfolioData();
        if (remoteData && isMounted && Array.isArray(remoteData.items) && remoteData.items.length > 0) {
          setItems(remoteData.items);
          if (remoteData.profileImage) setProfileImage(remoteData.profileImage);
        }
      } catch (err) {
        console.warn('Backend sync note:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Show auto-expiring notification
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  // Require admin login for protected actions
  const requireAdmin = (action: () => void) => {
    if (isAdmin) {
      action();
    } else {
      setPendingAction(() => action);
      setIsAdminLoginOpen(true);
    }
  };

  // On successful admin login
  const handleLoginSuccess = () => {
    setAdminAuthenticated(true);
    setIsAdmin(true);
    setIsAdminLoginOpen(false);
    showToast('অ্যাডমিন হিসেবে লগইন সফল হয়েছে!');

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Logout admin
  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setIsAdmin(false);
    showToast('অ্যাডমিন প্যানেল থেকে লগআউট করা হয়েছে।');
  };

  // Profile photo change handler
  const handleSaveProfilePhoto = async (newUrl: string) => {
    setProfileImage(newUrl);
    saveProfileImage(newUrl);
    showToast(t('profilePhotoSaved') || 'প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!');

    // Persist to server so other devices see the new profile photo
    const serverPhoto = await saveProfileImageRemote(newUrl);
    if (serverPhoto) {
      setProfileImage(serverPhoto);
    }
  };

  // Add new portfolio photo
  const handleSaveNewPhoto = async (newItem: PortfolioItem) => {
    // 1. Optimistically update local view immediately
    const updated = [newItem, ...items];
    setItems(updated);
    savePortfolioItems(updated);
    showToast(t('photoSavedSuccess') || 'নতুন কাজের ছবি সফলভাবে যুক্ত হয়েছে!');

    // 2. Persist to server backend so it is permanently visible from ANY device/browser
    const serverItems = await addPortfolioItemRemote(newItem);
    if (serverItems) {
      setItems(serverItems);
      showToast('ছবিটি ক্লাউড সার্ভারে সংরক্ষিত হয়েছে, এখন সারা বিশ্ব থেকে দৃশ্যমান!');
    }
  };

  // Delete custom photo (Admin only)
  const handleDeletePhoto = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) {
      requireAdmin(() => handleDeletePhoto(id));
      return;
    }

    const confirmed = window.confirm(
      t('photoDeleteConfirm') || 'আপনি কি নিশ্চিতভাবে এই ছবিটি মুছে ফেলতে চান?'
    );
    if (!confirmed) return;

    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    savePortfolioItems(updated);
    showToast('ছবি মুছে ফেলা হয়েছে।');

    // Delete on server
    const serverItems = await deletePortfolioItemRemote(id);
    if (serverItems) {
      setItems(serverItems);
    }
  };

  // Reset to default gallery
  const handleResetDefaults = () => {
    requireAdmin(async () => {
      const confirmed = window.confirm(
        t('resetConfirm') ||
          'আপনি কি আগের ডিফল্ট গ্যালারিতে ফিরে যেতে চান? আপনার যোগ করা ছবিগুলো মুছে যাবে।'
      );
      if (!confirmed) return;

      const defaults = await resetPortfolioRemote();
      setItems(defaults);
      setProfileImage(getSavedProfileImage());
      showToast('গ্যালারি ডিফল্ট অবস্থায় রিস্টোর করা হয়েছে।');
    });
  };

  // Open detail modal for any card
  const handleCardClick = (item: PortfolioItem) => {
    const title = item.isCustom ? item.customTitle || 'কাজের ছবি' : t(item.titleKey || '');
    const content = item.isCustom
      ? item.customDescription || 'বিস্তারিত বিবরণ শীঘ্রই যুক্ত হবে।'
      : t(`modal_${item.id}_text`);

    setModalData({
      isOpen: true,
      title,
      content,
      imageSrc: item.imageSrc,
      category: item.category,
      date: item.date,
      itemId: item.id,
    });
  };

  // Unique categories for filtering
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.category) set.add(it.category);
    });
    return Array.from(set);
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') return items;
    return items.filter((it) => it.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased font-sans pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
        {/* Top bar with Language Switcher & Admin State */}
        <div className="space-y-3">
          <LanguageSelector
            currentLang={language}
            onChange={setLanguage}
            onOpenUpload={() => requireAdmin(() => setIsUploadOpen(true))}
            uploadButtonText={t('uploadPhotoBtn') || 'নতুন ছবি আপলোড করুন'}
            isAdmin={isAdmin}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />

          {/* Admin Bar (Shows status & quick actions) */}
          <AdminBar
            isAdmin={isAdmin}
            onOpenLogin={() => setIsAdminLoginOpen(true)}
            onLogout={handleAdminLogout}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenSettings={() => setIsAdminSettingsOpen(true)}
          />
        </div>

        {/* Header Profile Section */}
        <Header
          name={t('headerTitle')}
          subtitle={t('headerSubtitle')}
          motto={t('headerMotto')}
          profileImage={profileImage}
          onChangeProfilePhoto={() => requireAdmin(() => setIsProfileModalOpen(true))}
          onOpenUpload={() => requireAdmin(() => setIsUploadOpen(true))}
          totalPhotos={items.length}
          uploadButtonText={t('uploadPhotoBtn') || 'নতুন ছবি আপলোড করুন'}
          isAdmin={isAdmin}
        />

        {/* About Section */}
        <Section title={t('sectionAbout')} isRtl={isRtl} id="about-section">
          <div
            className="text-slate-700 text-base sm:text-lg leading-relaxed text-justify space-y-4"
            dangerouslySetInnerHTML={{
              __html: t('aboutText')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                .replace(/\\n/g, '<br />')
                .replace(/\n\n/g, '<br /><br />'),
            }}
          />
        </Section>

        {/* Experience Section */}
        <ExperienceSection items={experienceData} t={t} isRtl={isRtl} />

        {/* Portfolio Gallery Section */}
        <Section
          id="portfolio-section"
          title={t('sectionPortfolio') || 'পোর্টফোলিও'}
          isRtl={isRtl}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="gallery-add-photo-btn"
                onClick={() => requireAdmin(() => setIsUploadOpen(true))}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs transition cursor-pointer active:scale-95 ${
                  isAdmin
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-slate-800 hover:bg-slate-900'
                }`}
                title={isAdmin ? 'নতুন ছবি আপলোড করুন' : 'অ্যাডমিন পাসওয়ার্ড দিয়ে আপলোড করুন'}
              >
                {isAdmin ? (
                  <Camera className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-300" />
                )}
                <span>{t('uploadPhotoBtn') || 'ছবি আপলোড করুন'}</span>
              </button>

              <button
                onClick={handleResetDefaults}
                title="ডিফল্ট গ্যালারিতে রিস্টোর করুন (অ্যাডমিন অনুমোদিত)"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">রিসেট</span>
              </button>
            </div>
          }
        >
          {/* Category Filter Pills */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('filterAll') || 'সকল ছবি'} ({items.length})
            </button>

            {categoriesList.map((cat) => {
              const count = items.filter((it) => it.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Photos Grid: 4 photos per row on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredItems.map((item) => {
              const title = item.isCustom
                ? item.customTitle || 'কাজের ছবি'
                : t(item.titleKey || '');

              return (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  title={title}
                  onClick={() => handleCardClick(item)}
                  onDelete={isAdmin ? handleDeletePhoto : undefined}
                />
              );
            })}
          </div>

          {/* Quick upload banner at bottom of portfolio */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-3 bg-red-600 text-white rounded-2xl shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {isAdmin
                    ? 'নতুন কাজের ছবি গ্যালারিতে যোগ করুন'
                    : 'শুধু অ্যাডমিন নতুন কাজের ছবি আপলোড করতে পারবেন'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  {isAdmin
                    ? 'তারিখ ও বিস্তারিত গল্প সহ যেকোনো কাজের ছবি সহজে আপলোড করুন।'
                    : 'ছবি আপলোড করতে অ্যাডমিন পাসওয়ার্ড দিয়ে লগইন করুন।'}
                </p>
              </div>
            </div>

            <button
              onClick={() => requireAdmin(() => setIsUploadOpen(true))}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition cursor-pointer shrink-0 active:scale-95 ${
                isAdmin
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-slate-900 hover:bg-black'
              }`}
            >
              {isAdmin ? (
                <Camera className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4 text-amber-300" />
              )}
              <span>{t('uploadPhotoBtn') || 'নতুন ছবি আপলোড করুন'}</span>
            </button>
          </div>
        </Section>

        {/* Skills Section */}
        <SkillsSection categories={skillCategories} t={t} isRtl={isRtl} />

        {/* Contact Section */}
        <ContactSection
          t={t}
          isRtl={isRtl}
          onOpenAddress={() => setIsAddressModalOpen(true)}
        />

        {/* Footer */}
        <footer className="text-center py-6 text-slate-500 text-xs sm:text-sm border-t border-slate-200/60">
          <p>{t('footerText')}</p>
        </footer>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => {
          setIsAdminLoginOpen(false);
          setPendingAction(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Settings Modal (Change Password) */}
      <AdminSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
        onSuccess={showToast}
      />

      {/* Detail Modal */}
      <PortfolioDetailModal
        data={modalData}
        onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
        closeButtonText={t('modalClose') || 'বন্ধ করুন'}
        onDeleteCustom={isAdmin ? handleDeletePhoto : undefined}
      />

      {/* Upload Photo Modal (Admin Protected) */}
      <PhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSavePhoto={handleSaveNewPhoto}
        onSetProfilePhoto={handleSaveProfilePhoto}
      />

      {/* Profile Photo Modal (Admin Protected) */}
      <ProfilePhotoModal
        isOpen={isProfileModalOpen}
        currentPhoto={profileImage}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfilePhoto}
        title={t('changePhotoModalTitle') || 'প্রোফাইল ছবি পরিবর্তন করুন'}
        saveBtnText={t('saveProfileBtn') || 'সেভ করুন'}
        cancelBtnText={t('cancelBtn') || 'বাতিল'}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={t('modal_address_title') || 'বর্তমান ও স্থায়ী ঠিকানা'}
        addressText={
          t('modal_address_text') ||
          'হাউস-১৭, রোড-৫, নন্দীপাড়া, খিলগাঁও, ঢাকা-১২১৯, বাংলাদেশ।'
        }
        closeText={t('modalClose') || 'বন্ধ করুন'}
      />
    </div>
  );
}

