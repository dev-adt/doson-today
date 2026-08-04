/**
 * Cấu hình 6 Chuyên mục chính và các Lĩnh vực con tương ứng
 * dùng chung cho toàn bộ ứng dụng Đồ Sơn Today.
 */

export const CATEGORIES_DATA = [
  {
    id: 'kham-pha-do-son',
    name: 'Khám phá Đồ Sơn',
    name_en: 'Explore Do Son',
    subcategories: [
      'Tổng quan Đồ Sơn',
      'Lịch sử & Di tích',
      'Văn hóa & Lễ hội'
    ]
  },
  {
    id: 'du-lich',
    name: 'Du lịch',
    name_en: 'Tourism',
    subcategories: [
      'Điểm đến nổi bật',
      'Nơi lưu trú & Resort',
      'Ẩm thực & Hải sản',
      'Lịch trình gợi ý'
    ]
  },
  {
    id: 'doanh-nghiep',
    name: 'Doanh nghiệp',
    name_en: 'Enterprises',
    subcategories: [
      'Danh bạ doanh nghiệp',
      'Sản phẩm OCOP tiêu biểu',
      'Nhu cầu mua - bán'
    ]
  },
  {
    id: 'dau-tu',
    name: 'Đầu tư',
    name_en: 'Investment',
    subcategories: [
      'Dự án & Cơ hội hợp tác',
      'Lĩnh vực tiềm năng'
    ]
  },
  {
    id: 'cong-dong',
    name: 'Cộng đồng',
    name_en: 'Community',
    subcategories: [
      'Người Đồ Sơn xa quê',
      'Chuyên gia & Cố vấn',
      'CLB Doanh nhân'
    ]
  },
  {
    id: 'tin-tuc-su-kien',
    name: 'Tin tức - Sự kiện',
    name_en: 'News & Events',
    subcategories: [
      'Tin tức thời sự',
      'Sự kiện & Lễ hội',
      'Thông cáo & Hoạt động'
    ]
  }
];

/**
 * Từ điển dịch tên Chuyên mục & Lĩnh vực sang Tiếng Anh
 */
export const CATEGORY_TRANSLATIONS = {
  // Main Categories
  'Khám phá Đồ Sơn': { vi: 'Khám phá Đồ Sơn', en: 'Explore Do Son' },
  'Du lịch': { vi: 'Du lịch', en: 'Tourism' },
  'Doanh nghiệp': { vi: 'Doanh nghiệp', en: 'Enterprises' },
  'Đầu tư': { vi: 'Đầu tư', en: 'Investment' },
  'Cộng đồng': { vi: 'Cộng đồng', en: 'Community' },
  'Tin tức - Sự kiện': { vi: 'Tin tức - Sự kiện', en: 'News & Events' },

  // Sub Categories
  'Tổng quan Đồ Sơn': { vi: 'Tổng quan Đồ Sơn', en: 'Do Son Overview' },
  'Lịch sử & Di tích': { vi: 'Lịch sử & Di tích', en: 'History & Relics' },
  'Văn hóa & Lễ hội': { vi: 'Văn hóa & Lễ hội', en: 'Culture & Festivals' },
  'Điểm đến nổi bật': { vi: 'Điểm đến nổi bật', en: 'Featured Destinations' },
  'Nơi lưu trú & Resort': { vi: 'Nơi lưu trú & Resort', en: 'Accommodations & Resorts' },
  'Ẩm thực & Hải sản': { vi: 'Ẩm thực & Hải sản', en: 'Cuisine & Seafood' },
  'Lịch trình gợi ý': { vi: 'Lịch trình gợi ý', en: 'Suggested Itineraries' },
  'Danh bạ doanh nghiệp': { vi: 'Danh bạ doanh nghiệp', en: 'Business Directory' },
  'Sản phẩm OCOP tiêu biểu': { vi: 'Sản phẩm OCOP tiêu biểu', en: 'Featured OCOP Products' },
  'Nhu cầu mua - bán': { vi: 'Nhu cầu mua - bán', en: 'Trading Needs' },
  'Dự án & Cơ hội hợp tác': { vi: 'Dự án & Cơ hội hợp tác', en: 'Projects & Opportunities' },
  'Lĩnh vực tiềm năng': { vi: 'Lĩnh vực tiềm năng', en: 'Potential Sectors' },
  'Người Đồ Sơn xa quê': { vi: 'Người Đồ Sơn xa quê', en: 'Do Son Expatriates' },
  'Chuyên gia & Cố vấn': { vi: 'Chuyên gia & Cố vấn', en: 'Experts & Advisors' },
  'CLB Doanh nhân': { vi: 'CLB Doanh nhân', en: 'Entrepreneurs Club' },
  'Tin tức thời sự': { vi: 'Tin tức thời sự', en: 'Current News' },
  'Sự kiện & Lễ hội': { vi: 'Sự kiện & Lễ hội', en: 'Events & Festivals' },
  'Thông cáo & Hoạt động': { vi: 'Thông cáo & Hoạt động', en: 'Press & Activities' }
};

/**
 * Helper lấy nhãn hiển thị đa ngôn ngữ cho Chuyên mục / Lĩnh vực.
 * @param {string|object} item - Tên string hoặc object category ({ name, name_en })
 * @param {string} lang - Mã ngôn ngữ 'vi' hoặc 'en'
 */
export const getCategoryLabel = (item, lang = 'vi') => {
  if (!item) return '';

  if (typeof item === 'object') {
    if (lang === 'en') {
      if (item.name_en && item.name_en.trim()) return item.name_en.trim();
      const trans = CATEGORY_TRANSLATIONS[item.name];
      if (trans && trans.en) return trans.en;
    }
    return item.name || '';
  }

  const strName = String(item).trim();
  if (lang === 'en') {
    const trans = CATEGORY_TRANSLATIONS[strName];
    if (trans && trans.en) return trans.en;
  }
  return strName;
};

// Helper lấy danh sách tên tất cả Chuyên mục (Category lớn)
export const ALL_CATEGORIES = CATEGORIES_DATA.map(c => c.name);

// Helper lấy tất cả Lĩnh vực con theo Chuyên mục
export const getSubcategoriesByCategory = (categoryName) => {
  const cat = CATEGORIES_DATA.find(c => c.name === categoryName);
  return cat ? cat.subcategories : [];
};

// Helper lấy tất cả Lĩnh vực con trên toàn hệ thống
export const ALL_SUBCATEGORIES = CATEGORIES_DATA.flatMap(c => c.subcategories);
