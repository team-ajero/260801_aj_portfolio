import ServicesPage from "@/app/components/sections/ServicesPage";
import { getServices } from "@/lib/actions/services";

export default async function Services() {
    const services = await getServices();

    return (
        <div>
            <ServicesPage services={services} />
        </div>
    );
}
