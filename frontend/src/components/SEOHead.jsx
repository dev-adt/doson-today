import React, { useEffect } from 'react';

/**
 * SEOHead Component
 * Dynamically manages document title, meta tags, Open Graph (FB/Zalo), Twitter Cards, and JSON-LD Structured Data
 */
const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedAt,
  updatedAt,
  author,
  schemaData
}) => {
  useEffect(() => {
    const defaultSiteName = 'Đồ Sơn Today — Cổng thông tin & Kết nối Doanh nghiệp';
    const siteUrl = 'https://doson.today';

    // 1. Set Document Title
    const fullTitle = title ? `${title} | Đồ Sơn Today` : defaultSiteName;
    document.title = fullTitle;

    // Helper function to create or update meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set link canonical
    const setCanonical = (href) => {
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    const pageDesc = description || 'Nền tảng kết nối cơ hội kinh doanh, quảng bá thương hiệu và hỗ trợ hội viên doanh nghiệp tại Đồ Sơn, Hải Phòng.';
    const pageKeywords = keywords || 'Đồ Sơn, Hải Phòng, doanh nghiệp Đồ Sơn, thương mại, kết nối đối tác, kết nối kinh doanh';
    const canonicalUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : window.location.href;
    const ogImage = image || `${siteUrl}/assets/og-image.jpg`;

    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'keywords', pageKeywords);
    setCanonical(canonicalUrl);

    // 3. Open Graph Tags (Facebook, Zalo, LinkedIn)
    setMetaTag('property', 'og:site_name', 'Đồ Sơn Today');
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:locale', 'vi_VN');

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. JSON-LD Schema.org Structured Data
    let schemaElement = document.querySelector('#seo-json-ld');
    if (schemaData) {
      if (!schemaElement) {
        schemaElement = document.createElement('script');
        schemaElement.setAttribute('type', 'application/ld+json');
        schemaElement.setAttribute('id', 'seo-json-ld');
        document.head.appendChild(schemaElement);
      }
      schemaElement.textContent = JSON.stringify(schemaData);
    } else if (schemaElement) {
      schemaElement.remove();
    }

  }, [title, description, keywords, image, url, type, publishedAt, updatedAt, author, schemaData]);

  return null;
};

export default SEOHead;
