"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/app/components/ui/sheet";

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
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex items-center justify-between"
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

      {/* 데스크톱 네비게이션 */}
      <nav className="hidden md:block">
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

      {/* 모바일: 햄버거 메뉴 (Sheet) */}
      <Sheet>
        <SheetTrigger className="md:hidden" aria-label="메뉴 열기">
          <Menu className="size-6" />
        </SheetTrigger>
        <SheetContent side="right" className="px-8 py-10">
          <SheetTitle className="text-sm font-medium tracking-widest uppercase mb-8">
            Interior Studio
          </SheetTitle>
          <nav>
            <ul className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      className={`text-lg tracking-wide transition-opacity duration-300 ${
                        pathname === link.href ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}