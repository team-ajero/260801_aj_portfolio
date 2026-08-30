import AboutPage from "@/app/components/sections/AboutPage";
import { getAboutContent, getTeamMembers, getCompanyHistory } from "@/lib/actions/about";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "회사소개",
  description:
    "Interior Studio의 디자인 철학과 시공 방식, 함께하는 팀을 소개합니다. 설계부터 시공, 마무리까지 한 팀이 책임지고 진행합니다.",
  path: "/about",
});

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
