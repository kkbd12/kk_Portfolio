import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  QrCode,
  ExternalLink,
  MessageCircle,
  Facebook,
  Linkedin,
  Twitter,
  Send,
  Mail,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface SharePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const SharePublishModal: React.FC<SharePublishModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Compute the current live web URL
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('#')[0]
      : 'https://ais-pre-cb64noovpzejeud4ylfwiy-191745072207.asia-east1.run.app';

  const shareTitle = 'মোঃ আসাদুজ্জামান - ব্যক্তিগত পোর্টফোলিও ও কাজের ফটো গ্যালারি';
  const shareText =
    'মোঃ আসাদুজ্জামানের প্রফেশনাল পোর্টফোলিও ও কাজের ছবির সংগ্রহ দেখুন সারা বিশ্ব থেকে।';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      onNotify('ওয়েবসাইট লিংক কপি করা হয়েছে! এখন সবার মাঝে শেয়ার করতে পারেন।');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onNotify('লিংক কপি করতে ব্যর্থ হয়েছে, অনুগ্রহ করে ম্যানুয়ালি কপি করুন।');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
        onNotify('সফলভাবে শেয়ার করা হয়েছে!');
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n' + currentUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-sky-700 hover:bg-sky-800 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      color: 'bg-slate-900 hover:bg-black text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-slate-700 hover:bg-slate-800 text-white',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`,
    },
  ];

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div
      id="share-publish-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="share-publish-modal-container"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">সবার মাঝে প্রকাশ ও শেয়ার করুন</h3>
              <p className="text-xs text-red-100">
                বিশ্বের যেকোনো প্রান্ত থেকে যে কেউ এই পোর্টফোলিও দেখতে পারবেন
              </p>
            </div>
          </div>
          <button
            id="share-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Live URL box with 1-click Copy */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              ওয়েবসাইটের লাইভ পাবলিক লিংক (Live Public Link)
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-300 rounded-2xl">
              <div className="flex items-center gap-2 px-3 text-slate-400">
                <Globe className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                id="share-public-url-input"
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-slate-800 focus:outline-none select-all"
              />
              <button
                id="share-copy-link-btn"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shrink-0 active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>লিংক কপি</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              এই লিংকটি ভিজিট করতে কোনো লগইন বা পাসওয়ার্ডের প্রয়োজন নেই। যেকোনো ব্রাউজারে এটি সাথে সাথে ওপেন হবে।
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                সরাসরি সোশ্যাল মিডিয়ায় শেয়ার করুন
              </h4>
              <button
                onClick={() => setShowQr(!showQr)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQr ? 'QR কোড লুকান' : 'QR কোড দেখুন'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {shareChannels.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition shadow-2xs text-center cursor-pointer active:scale-95 ${item.color}`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-semibold">{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Mobile native share button */}
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-300 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-slate-600" />
              <span>মোবাইলের মাধ্যমে সরাসরি শেয়ার করুন (Mobile Share)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </button>
          </div>

          {/* Optional QR Code section */}
          {showQr && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2 animate-fadeIn">
              <p className="text-xs font-bold text-slate-700">
                মোবাইল ক্যামেরা দিয়ে স্ক্যান করলেই পোর্টফোলিও ওপেন হবে
              </p>
              <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
                <img
                  src={qrCodeUrl}
                  alt="Portfolio QR Code"
                  className="w-44 h-44 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                ভিজিটিং কার্ড, ব্যানার বা প্রেজেন্টেশনে ব্যবহারের জন্য উপযুক্ত
              </p>
            </div>
          )}

          {/* Worldwide Access & Publishing Guide Cards */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  সারা বিশ্বে উন্মুক্ত ও দৃশ্যমান (24/7 Global Access):
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  এই পোর্টফোলিওটি ক্লাউড সার্ভারে ২৪ ঘণ্টা লাইভ থাকে। বাংলাদেশসহ যুক্তরাষ্ট্র, ইউরোপ, মধ্যপ্রাচ্য কিংবা যেকোনো দেশ থেকে যে কেউ যেকোনো সময় দেখতে পারবেন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200">
              <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  গুগল এআই স্টুডিও পাবলিশ ব্যবস্থা (AI Studio Publish & Share):
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  স্টুডিওর উপরের ডানদিকের <strong>"Share"</strong> বাটন ব্যবহার করে যেকোনো সময় সবার সাথে পাবলিক লিংক শেয়ার করতে পারেন অথবা <strong>Cloud Run</strong>-এ ডেপ্লয় করে নিজের কাস্টম ডোমেইন (.com/.org) যুক্ত করতে পারেন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
