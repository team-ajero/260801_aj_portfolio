// "use client" 불필요: 인터랙션은 onClick props으로 부모에서 처리
import Link from "next/link";

// 버튼이 가질 수 있는 props 타입 정의
interface ButtonProps {
  label: string;                        
  href?: string;                        
  onClick?: () => void;                 
  variant?: "primary" | "secondary";   
  type?: "button" | "submit";         
}

export default function Button({
  label,
  href,
  onClick,
  variant = "primary", 
  type = "button",
}: ButtonProps) {

  const baseStyle = "inline-block text-sm tracking-widest uppercase transition-all duration-300 px-8 py-4";
  const styles = {
    primary: `${baseStyle} bg-black text-white hover:bg-white hover:text-black border border-black`,
    secondary: `${baseStyle} bg-transparent text-black border border-black hover:bg-black hover:text-white`,
  };

  if (href) {
    return (
      <Link href={href} className={styles[variant]}>
        {label}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles[variant]}>
      {label}
    </button>
  );
}