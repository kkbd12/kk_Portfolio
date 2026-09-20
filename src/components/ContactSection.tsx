import React from 'react';
import { Section } from './Section';
import {
  Mail,
  Phone,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Github,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface ContactSectionProps {
  t: (key: string) => string;
  isRtl?: boolean;
  onOpenAddress: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  t,
  isRtl,
  onOpenAddress,
}) => {
  return (
    <Section id="contact-section" title={t('sectionContact')} isRtl={isRtl}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-700">
        {/* Email */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 hover:bg-white transition group">
          <div className="p-2.5 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0" dir="ltr">
            <p className="text-xs font-semibold text-slate-500 uppercase">{t('emailPrefix') || 'Email'}</p>
            <a
              href="mailto:kkbd12@gmail.com"
              className="text-sm font-semibold text-blue-600 hover:text-red-600 truncate block transition"
            >
              kkbd12@gmail.com
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 hover:bg-white transition group">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
            <Phone className="w-5 h-5" />
          </div>
          <div className="min-w-0" dir="ltr">
            <p className="text-xs font-semibold text-slate-500 uppercase">{t('phonePrefix') || 'Phone'}</p>
            <a
              href="tel:+8801707119260"
              className="text-sm font-semibold text-slate-800 hover:text-red-600 truncate block transition"
            >
              +8801707119260
            </a>
          </div>
        </div>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/kkbd12"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 hover:bg-white hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">LinkedIn</p>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition">
                {t('linkedinText')}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/kkbd12"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500 hover:bg-white hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Facebook</p>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">
                {t('facebookText')}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/kkbd12"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-pink-400 hover:bg-white hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Instagram</p>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-pink-600 transition">
                {t('instagramText')}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition" />
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com/kkbd12"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-800 hover:bg-white hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-200 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">X (Twitter)</p>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition">
                {t('twitterText')}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/kkbd12"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-800 hover:bg-white hover:shadow-xs transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-200 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">GitHub</p>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition">
                {t('githubText')}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
        </a>

        {/* Address Trigger */}
        <div
          id="address-modal-trigger"
          onClick={onOpenAddress}
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-400 hover:bg-white hover:shadow-xs transition group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Location / ঠিকানা</p>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-red-600 transition">
                {t('contactLinkText')}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
        </div>
      </div>
    </Section>
  );
};
