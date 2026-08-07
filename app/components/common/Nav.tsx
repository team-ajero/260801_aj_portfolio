"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

const navLinks = [
  { href: "/works", label: "시공사례" },
  { href: "/services", label: "서비스" },
  { href: "/contact", label: "견적문의" },
];

export default function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.1]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-10 py-6 flex items-center justify-between"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(255,255,255,${v})`),
        borderBottom: "1px solid black",
        borderColor: useTransform(borderOpacity, (v) => `rgba(0,0,0,${v})`),
        backdropFilter: "blur(10px)",
      }}
    >
      <Link href="/" className="text-sm font-medium tracking-widest uppercase">
        Interior Studio
      </Link>

      <nav>
        <ul className="flex gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm tracking-wide transition-opacity duration-300 hover:opacity-100 ${
                  pathname === link.href ? "opacity-100" : "opacity-40"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}