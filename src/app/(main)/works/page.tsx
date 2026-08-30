import WorksGallery from "@/app/components/sections/WorksGallery";
import { getWorks } from "@/lib/actions/works";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "시공사례",
  description:
    "아파트, 주택, 상업공간까지 실제 시공 프로젝트를 사진과 함께 소개합니다. 공간별 스타일과 마감을 살펴보고 우리 집에 맞는 인테리어를 찾아보세요.",
  path: "/works",
});

export default async function WorksPage() {
    const works = await getWorks();

    return (
        <div>
            <WorksGallery works={works} />
        </div>
    );
}
