import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-24 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-sm text-black/40">
      <p className="text-center md:text-left">© {new Date().getFullYear()} Interior Studio. All rights reserved.</p>

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-8">
        <li>
          <Link href="/works" className="hover:text-black transition-colors duration-300">
            시공사례
          </Link>
        </li>
        <li>
          <Link href="/services" className="hover:text-black transition-colors duration-300">
            서비스
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-black transition-colors duration-300">
            회사소개
          </Link>
        </li>
        <li>
          <Link href="/reviews" className="hover:text-black transition-colors duration-300">
            고객후기
          </Link>
        </li>
        <li>
          <Link href="/faq" className="hover:text-black transition-colors duration-300">
            FAQ
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-black transition-colors duration-300">
            견적문의
          </Link>
        </li>
      </ul>
    </footer>
  );
} 