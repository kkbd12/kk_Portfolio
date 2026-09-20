import { PortfolioItem, ExperienceItem, SkillCategory } from '../types';

export const DEFAULT_PROFILE_IMAGE = "https://i.imgur.com/Ml4A0jp.jpeg";

export const initialPortfolioItems: PortfolioItem[] = [
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

export const experienceData: ExperienceItem[] = [
  {
    id: 1,
    titleKey: "jobTitle1",
    companyKey: "company1",
    durationKey: "duration1",
    tasks: ["task1_1", "task1_2", "task1_3", "task1_4"]
  },
  {
    id: 2,
    titleKey: "jobTitle2",
    companyKey: "company2",
    durationKey: "duration2",
    tasks: ["task2_1", "task2_2", "task2_3", "task2_4"]
  },
  {
    id: 3,
    titleKey: "jobTitle3",
    companyKey: "company3",
    durationKey: "duration3",
    tasks: ["task3_1", "task3_2", "task3_3", "task3_4"]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    id: 1,
    titleKey: "skillCat1Title",
    items: ["skillItem1_1", "skillItem1_2", "skillItem1_3", "skillItem1_4", "skillItem1_5", "skillItem1_6"],
    styleClass: "skill-box-1 p-5 rounded-2xl border border-blue-200 bg-blue-50/60 shadow-sm transition hover:shadow-md"
  },
  {
    id: 2,
    titleKey: "skillCat2Title",
    items: ["skillItem2_1", "skillItem2_2", "skillItem2_3", "skillItem2_4", "skillItem2_5", "skillItem2_6", "skillItem2_7"],
    styleClass: "skill-box-2 p-5 rounded-2xl border border-amber-200 bg-amber-50/60 shadow-sm transition hover:shadow-md"
  },
  {
    id: 3,
    titleKey: "skillCat3Title",
    items: ["skillItem3_1", "skillItem3_2", "skillItem3_3", "skillItem3_4", "skillItem3_5", "skillItem3_6", "skillItem3_7", "skillItem3_8", "skillItem3_9", "skillItem3_10", "skillItem3_11", "skillItem3_12"],
    styleClass: "skill-box-3 p-5 rounded-2xl border border-rose-200 bg-rose-50/60 shadow-sm transition hover:shadow-md"
  }
];
