import ServicesPage from "@/app/components/sections/ServicesPage";
import { getServices } from "@/lib/actions/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "서비스",
  description:
    "아파트 리모델링, 상업공간 인테리어, 부분시공, 3D 설계 컨설팅까지. 공간 상황에 맞는 시공 범위와 진행 방식을 안내합니다.",
  path: "/services",
});

export default async function Services() {
    const services = await getServices();

    return (
        <div>
            <ServicesPage services={services} />
        </div>
    );
}
