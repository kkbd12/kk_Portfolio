import React from 'react';
import { Section } from './Section';
import { SkillCategory } from '../types';
import { Award } from 'lucide-react';

interface SkillsSectionProps {
  categories: SkillCategory[];
  t: (key: string) => string;
  isRtl?: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  categories,
  t,
  isRtl,
}) => {
  return (
    <Section id="skills-section" title={t('sectionSkills')} isRtl={isRtl}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            id={`skill-category-${category.id}`}
            className={category.styleClass}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-current">
              <Award className="w-5 h-5 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">
                {t(category.titleKey)}
              </h3>
            </div>
            <ul className="text-sm text-slate-700 space-y-2">
              {category.items.map((itemKey) => (
                <li
                  key={itemKey}
                  className="leading-relaxed flex items-start gap-1.5"
                >
                  <span className="text-red-500 font-bold">•</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(itemKey).replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>'),
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};
