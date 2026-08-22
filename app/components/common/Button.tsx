// "use client" 불필요: 인터랙션은 onClick props으로 부모에서 처리
import Link from "next/link";
import { Button as ShadcnButton } from "@/app/components/ui/button";

// 버튼이 가질 수 있는 props 타입 정의
interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
}

// primary/secondary → shadcn Button 기본 variant로 매핑
const variantMap = {
  primary: "default",
  secondary: "outline",
} as const;

export default function Button({
  label,
  href,
  onClick,
  variant = "primary",
  type = "button",
  className,
}: ButtonProps) {
  const shadcnVariant = variantMap[variant];

  if (href) {
    return (
      <ShadcnButton asChild variant={shadcnVariant} className={className}>
        <Link href={href}>{label}</Link>
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton type={type} onClick={onClick} variant={shadcnVariant} className={className}>
      {label}
    </ShadcnButton>
  );
}