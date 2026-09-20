import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isRtl?: boolean;
  action?: React.ReactNode;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  isRtl = false,
  action,
  id,
}) => {
  return (
    <section
      id={id}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 transition-all hover:shadow-md scroll-mt-6"
    >
      <div
        className={`mb-6 flex flex-wrap items-center justify-between gap-4 ${
          isRtl
            ? 'border-r-6 border-red-600 pr-4'
            : 'border-l-6 border-red-600 pl-4'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
};
