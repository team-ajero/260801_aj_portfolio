import Nav from "@/app/components/common/Nav";
import Footer from "@/app/components/common/Footer";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
