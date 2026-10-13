/**
 * API Helpers & Fallback Data for doson.today
 */

export const DEFAULT_TIMEOUT_MS = 12000;

export async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Yêu cầu mạng hết thời gian chờ (${timeoutMs}ms): ${url}`);
    }
    throw error;
  }
}

export async function fetchJsonWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const res = await fetchWithTimeout(url, options, timeoutMs);
  if (!res.ok) {
    let errMsg = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.error) errMsg = errJson.error;
    } catch (_) {}
    throw new Error(errMsg);
  }
  return await res.json();
}

/**
 * Fallback Events Data cho doson.today
 */
export const FALLBACK_EVENTS = [
  {
    id: 'fb-evt-1',
    title: 'Lễ hội Du lịch Biển Đồ Sơn 2026 — Khám phá Kỳ quan Bán đảo & Kết nối Giao thương',
    slug: 'le-hoi-du-lich-bien-do-son-2026',
    short_desc: 'Sự kiện văn hóa du lịch tầm vóc quy tụ hàng trăm doanh nghiệp lữ hành, dịch vụ nghỉ dưỡng và ẩm thực biển Đồ Sơn.',
    event_date: new Date(Date.now() + 86400000 * 18).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 20).toISOString(),
    location: 'Quảng trường Bãi biển Đồ Sơn & Khu du lịch Quốc tế Đồi Rồng, Hải Phòng',
    organizer: 'UBND Quận Đồ Sơn & Đồ Sơn Today',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    is_paid: 0,
    price: 0,
    remaining_tickets: 500,
    registered_count: 320
  },
  {
    id: 'fb-evt-2',
    title: 'Diễn đàn Xúc tiến Đầu tư Du lịch Nghỉ dưỡng & Kinh tế Biển Đồ Sơn 2026',
    slug: 'dien-dan-xuc-tien-dau-tu-du-lich-nghi-duong-do-son',
    short_desc: 'Đối thoại giữa cơ quan quản lý, quỹ đầu tư bất động sản nghỉ dưỡng và cộng đồng doanh nghiệp địa phương.',
    event_date: new Date(Date.now() + 86400000 * 28).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 29).toISOString(),
    location: 'Trung tâm Hội nghị Đồi Rồng Resort, Vạn Hương, Đồ Sơn, Hải Phòng',
    organizer: 'Cổng thông tin Đồ Sơn Today & ADT Group',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    is_paid: 0,
    price: 0,
    remaining_tickets: 200,
    registered_count: 140
  }
];
