import { getServices } from "@/lib/actions/services";
import { ServicesManager } from "./ServicesManager";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">서비스 소개</h1>
        <p className="text-sm text-muted-foreground mt-1">
          제공하는 서비스 항목을 관리합니다.
        </p>
      </div>
      <ServicesManager initialServices={services} />
    </div>
  );
}
