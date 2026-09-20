export type Language = 'bn' | 'en';

export interface PortfolioItem {
  id: string;
  imageSrc: string;
  titleKey?: string;
  customTitle?: string;
  customDescription?: string;
  category?: string;
  date?: string;
  isCustom?: boolean;
  createdAt?: number;
}

export interface ExperienceItem {
  id: number;
  titleKey: string;
  companyKey: string;
  durationKey: string;
  tasks: string[];
}

export interface SkillCategory {
  id: number;
  titleKey: string;
  items: string[];
  styleClass: string;
}

export interface ModalData {
  isOpen: boolean;
  title: string;
  content: string;
  imageSrc?: string;
  date?: string;
  category?: string;
  itemId?: string;
}
