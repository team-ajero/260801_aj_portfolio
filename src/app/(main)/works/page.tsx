import WorksGallery from "@/app/components/sections/WorksGallery";
import { getWorks } from "@/lib/actions/works";

export default async function WorksPage() {
    const works = await getWorks();

    return (
        <div>
            <WorksGallery works={works} />
        </div>
    );
}
