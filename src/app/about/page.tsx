import AboutPage from "@/app/components/sections/AboutPage";
import { getAboutContent, getTeamMembers, getCompanyHistory } from "@/lib/actions/about";

export default async function About() {
    const [content, team, history] = await Promise.all([
        getAboutContent(),
        getTeamMembers(),
        getCompanyHistory(),
    ]);

    return (
        <div>
            <AboutPage content={content} team={team} history={history} />
        </div>
    );
}
