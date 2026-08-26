"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { submitInquiry } from "@/lib/actions/inquiries";
import Button from "@/app/components/common/Button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Container } from "@/app/components/common/Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// 폼 데이터 타입 정의
interface FormData {
  name: string;
  phone: string;
  email: string;
  type: string;      // 시공 종류
  area: string;      // 평수
  message: string;   // 요청사항
}

export default function ContactPage() {
  // 폼 상태 관리
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    type: "",
    area: "",
    message: "",
  });

  // input/textarea 변경 시 상태 업데이트
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // shadcn Select는 onValueChange 콜백으로 값을 전달 (네이티브 onChange와 다름)
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  // 개인정보 수집 및 이용 동의 여부 (필수, 미동의 시 제출 불가)
  const [agreed, setAgreed] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      toast.error("이름과 연락처는 필수 입력 항목이에요.");
      return;
    }

    if (!agreed) {
      toast.error("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        await submitInquiry(formData);
        toast.success("문의가 접수됐어요. 빠르게 연락드릴게요.");
        setFormData({ name: "", phone: "", email: "", type: "", area: "", message: "" });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "제출에 실패했어요.");
      }
    });
  };

  return (
    <section className="pt-28 md:pt-40 pb-20 md:pb-32">
      <Container>

      {/* 페이지 헤더 */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Contact</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">견적 문의</h1>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-12 md:gap-24">

        {/* 왼쪽: 연락처 정보 */}
        <motion.div
          className="md:w-1/3 order-2 md:order-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <div className="flex flex-col gap-10">
            {[
              { label: "전화", value: "02-0000-0000" },
              { label: "이메일", value: "hello@interior.kr" },
              { label: "운영시간", value: "평일 09:00 - 18:00" },
              { label: "주소", value: "서울시 강남구 테헤란로 000" },
            ].map((info) => (
              <div key={info.label}>
                <p className="text-xs tracking-widest uppercase text-black/40 mb-2">{info.label}</p>
                <p className="text-sm">{info.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 오른쪽: 문의 폼 */}
        <motion.div
          className="md:w-2/3 flex flex-col gap-8 order-1 md:order-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {/* 이름 + 연락처 */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              <Label htmlFor="name" className="text-xs tracking-widest uppercase text-black/40">
                <span className="text-red-500">*</span> 이름
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름"
              />
            </div>
            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              <Label htmlFor="phone" className="text-xs tracking-widest uppercase text-black/40">
                <span className="text-red-500">*</span> 연락처
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="연락처"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xs tracking-widest uppercase text-black/40">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
            />
          </div>

          {/* 시공 종류 + 평수 */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              <Label htmlFor="type" className="text-xs tracking-widest uppercase text-black/40">
                <span className="text-red-500">*</span> 시공 종류
              </Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="시공 종류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="아파트">아파트 인테리어</SelectItem>
                  <SelectItem value="상업공간">상업공간 설계</SelectItem>
                  <SelectItem value="부분시공">부분 시공</SelectItem>
                  <SelectItem value="상담">3D 설계 상담</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              <Label htmlFor="area" className="text-xs tracking-widest uppercase text-black/40">
                <span className="text-red-500">*</span> 평수
              </Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="평수 (예: 30평)"
              />
            </div>
          </div>

          {/* 요청사항 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="message" className="text-xs tracking-widest uppercase text-black/40">요청사항</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="요청사항을 자유롭게 작성해주세요"
              rows={5}
            />
          </div>

          {/* 개인정보 수집 및 이용안내 */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-black/40">개인정보 수집 및 이용안내</p>
            <div className="h-32 overflow-y-auto border border-black/10 bg-black/[0.02] p-4 text-xs leading-relaxed text-black/50">
              <p className="mb-3">
                (주)Interior Studio는 견적 문의 접수 및 상담을 위해 아래와 같이 개인정보를 수집·이용합니다.
              </p>
              <p className="mb-1 font-medium text-black/60">1. 수집 목적</p>
              <p className="mb-3">견적 상담 및 문의 응대, 시공 계약 체결 및 이행, 고객 상담 이력 관리</p>
              <p className="mb-1 font-medium text-black/60">2. 수집 항목</p>
              <p className="mb-3">이름, 연락처, 이메일, 시공 종류, 평수, 요청사항</p>
              <p className="mb-1 font-medium text-black/60">3. 보유 및 이용 기간</p>
              <p className="mb-3">
                수집일로부터 3년간 보관 후 파기하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안
                보관합니다.
              </p>
              <p>
                위 동의를 거부할 권리가 있으며, 동의하지 않을 경우 견적 문의 접수가 제한될 수 있습니다.
              </p>
            </div>

            <label htmlFor="privacy-agree" className="flex items-start gap-3 cursor-pointer select-none">
              <Checkbox
                id="privacy-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <span className="text-sm text-black/60">
                (필수) 개인정보 수집 및 이용에 동의합니다.
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end">
            <Button label="문의 보내기" onClick={handleSubmit} variant="primary" disabled={isPending || !agreed} />
          </div>
        </motion.div>
      </div>
      </Container>
    </section>
  );
}