import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 flex items-center justify-between text-sm text-black/40">
      <p>© {new Date().getFullYear()} Interior Studio. All rights reserved.</p>

      <ul className="flex gap-8">
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
          <Link href="/contact" className="hover:text-black transition-colors duration-300">
            견적문의
          </Link>
        </li>
      </ul>
    </footer>
  );
}