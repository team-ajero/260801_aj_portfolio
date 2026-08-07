"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/app/components/common/Button";

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

  // input 변경 시 상태 업데이트
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 (나중에 API 연결 예정)
  const handleSubmit = () => {
    console.log("제출된 데이터:", formData);
  };

  return (
    <section className="pt-40 pb-32">

      {/* 페이지 헤더 */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm tracking-widest uppercase text-black/40 mb-4">Contact</p>
        <h1 className="text-5xl font-light tracking-tight">견적 문의</h1>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-24">

        {/* 왼쪽: 연락처 정보 */}
        <motion.div
          className="md:w-1/3"
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
          className="md:w-2/3 flex flex-col gap-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {/* 이름 + 연락처 */}
          <div className="flex gap-6">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름"
              className="w-1/2 border-b border-black/20 pb-4 text-sm outline-none placeholder:text-black/30 focus:border-black transition-colors duration-300"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="연락처"
              className="w-1/2 border-b border-black/20 pb-4 text-sm outline-none placeholder:text-black/30 focus:border-black transition-colors duration-300"
            />
          </div>

          {/* 이메일 */}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            className="border-b border-black/20 pb-4 text-sm outline-none placeholder:text-black/30 focus:border-black transition-colors duration-300"
          />

          {/* 시공 종류 + 평수 */}
          <div className="flex gap-6">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-1/2 border-b border-black/20 pb-4 text-sm outline-none text-black/50 focus:border-black transition-colors duration-300 bg-transparent"
            >
              <option value="">시공 종류 선택</option>
              <option value="아파트">아파트 인테리어</option>
              <option value="상업공간">상업공간 설계</option>
              <option value="부분시공">부분 시공</option>
              <option value="상담">3D 설계 상담</option>
            </select>
            <input
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="평수 (예: 30평)"
              className="w-1/2 border-b border-black/20 pb-4 text-sm outline-none placeholder:text-black/30 focus:border-black transition-colors duration-300"
            />
          </div>

          {/* 요청사항 */}
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="요청사항을 자유롭게 작성해주세요"
            rows={5}
            className="border-b border-black/20 pb-4 text-sm outline-none placeholder:text-black/30 focus:border-black transition-colors duration-300 resize-none"
          />

          {/* 제출 버튼 */}
          <div className="flex justify-end">
            <Button label="문의 보내기" onClick={handleSubmit} variant="primary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}