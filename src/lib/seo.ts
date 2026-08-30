import type { Metadata } from "next";

/**
 * 사이트 전역 SEO 상수.
 * 커스텀 도메인을 연결하면 SITE_URL 한 줄만 교체하면 된다.
 */
export const SITE_URL = "https://ajero-interior.vercel.app";
export const SITE_NAME = "Interior Studio";
export const OG_IMAGE = "/images/og-image.jpg";

export const DEFAULT_TITLE = "Interior Studio | 인테리어 시공사례 & 포트폴리오";
export const DEFAULT_DESCRIPTION =
  "아파트, 상업공간, 부분시공 등 다양한 인테리어 시공사례를 소개합니다. 3D 설계 상담부터 무료 견적 문의까지 한 곳에서 확인하세요.";

export const ROUTES = [
  "/",
  "/works",
  "/services",
  "/about",
  "/reviews",
  "/faq",
  "/contact",
] as const;

type PageMetadataInput = {
  /** 템플릿("%s | Interior Studio")에 채워질 페이지 제목 */
  title: string;
  description: string;
  /** 선행 슬래시를 포함한 경로 (예: "/works") */
  path: string;
};

/**
 * 페이지별 metadata 헬퍼.
 * Next.js는 openGraph/twitter 같은 중첩 객체를 병합하지 않고 통째로 교체하므로,
 * 하위 라우트에서도 이미지·locale 등이 유지되도록 여기서 전체를 재구성한다.
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
