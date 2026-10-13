/**
 * Tiện ích xử lý múi giờ Việt Nam (UTC+7 / Asia/Ho_Chi_Minh)
 * Đảm bảo hiển thị chuẩn xác giờ Việt Nam trên mọi thiết bị và hệ điều hành.
 */

export const parseVNTime = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  let str = String(val).trim();
  // Nếu là chuỗi datetime dạng "YYYY-MM-DD HH:mm:ss" không có đuôi timezone, định danh là +07:00
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(str)) {
    str = str.replace(' ', 'T') + '+07:00';
  }
  return new Date(str);
};

export const formatVNDateTime = (val) => {
  const d = parseVNTime(val);
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatVNTime = (val) => {
  const d = parseVNTime(val);
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatVNDate = (val) => {
  const d = parseVNTime(val);
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatVNDateWithWeekday = (val) => {
  const d = parseVNTime(val);
  if (!d || isNaN(d.getTime())) return '';
  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = weekdays[d.getDay()];
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${hours}:${minutes} ${dayName}, ${day}/${month}/${year}`;
};

