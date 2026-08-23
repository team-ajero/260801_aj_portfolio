import FAQPage from "@/app/components/sections/FAQPage";
import { getFaqs } from "@/lib/actions/faqs";

export default async function FAQ() {
    const faqs = await getFaqs();

    return (
        <div>
            <FAQPage faqs={faqs} />
        </div>
    );
}
