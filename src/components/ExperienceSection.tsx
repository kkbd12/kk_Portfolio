import React from 'react';
import { Briefcase, Building, Clock, CheckCircle2 } from 'lucide-react';
import { Section } from './Section';
import { ExperienceItem } from '../types';

interface ExperienceSectionProps {
  items: ExperienceItem[];
  t: (key: string) => string;
  isRtl?: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  items,
  t,
  isRtl,
}) => {
  return (
    <Section id="experience-section" title={t('sectionExperience')} isRtl={isRtl}>
      <div className="space-y-6">
        {items.map((job, index) => (
          <div
            key={job.id}
            id={`experience-item-${job.id}`}
            className="rounded-2xl p-5 sm:p-6 bg-slate-50/80 border border-slate-200/80 transition-all hover:bg-white hover:shadow-md hover:border-red-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{t(job.titleKey)}</span>
                </h3>
                <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{t(job.companyKey)}</span>
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/70 text-red-700 text-xs font-bold border border-red-200/60 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>{t(job.durationKey)}</span>
              </span>
            </div>

            <ul className="space-y-2 text-sm sm:text-base text-slate-700">
              {job.tasks.map((taskKey, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                  <span className="leading-relaxed">{t(taskKey)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};
