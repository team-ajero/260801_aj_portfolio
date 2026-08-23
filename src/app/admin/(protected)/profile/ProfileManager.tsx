"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateMyProfile, changeMyPassword } from "@/lib/actions/profile";
import type { Session } from "@/lib/auth";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ImageUploadField } from "@/app/components/admin/ImageUploadField";

type SessionUser = Session["user"];

export function ProfileManager({ user }: { user: SessionUser }) {
  return (
    <div className="flex flex-col gap-6">
      <BasicInfoSection user={user} />
      <PasswordSection />
    </div>
  );
}

// ---------- 기본 정보 ----------

function BasicInfoSection({ user }: { user: SessionUser }) {
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        await updateMyProfile({ name, image: image || null });
        toast.success("내 정보를 저장했어요.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "저장에 실패했어요.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          기본 정보
          <Badge variant="outline">{user.role === "admin" ? "관리자" : "직원"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ImageUploadField label="프로필 사진" folder="avatars" value={image} onChange={setImage} />
        <div className="flex flex-col gap-2">
          <Label>이름</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>이메일</Label>
          <Input value={user.email} disabled readOnly />
          <p className="text-xs text-muted-foreground">
            이메일은 여기서 바꿀 수 없어요. 변경이 필요하면 다른 관리자에게 요청해주세요.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isPending}>
            저장
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- 비밀번호 변경 ----------

const emptyPasswordForm = { currentPassword: "", newPassword: "", newPasswordConfirm: "" };

function PasswordSection() {
  const [form, setForm] = useState(emptyPasswordForm);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!form.currentPassword) {
      toast.error("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("새 비밀번호는 8자 이상이어야 해요.");
      return;
    }
    if (form.newPassword !== form.newPasswordConfirm) {
      toast.error("새 비밀번호와 비밀번호 확인이 일치하지 않아요.");
      return;
    }
    startTransition(async () => {
      try {
        await changeMyPassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
        toast.success("비밀번호를 변경했어요.");
        setForm(emptyPasswordForm);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "변경에 실패했어요.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">비밀번호 변경</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>현재 비밀번호</Label>
          <Input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>새 비밀번호 (8자 이상)</Label>
          <Input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>새 비밀번호 확인</Label>
          <Input
            type="password"
            value={form.newPasswordConfirm}
            onChange={(e) => setForm((f) => ({ ...f, newPasswordConfirm: e.target.value }))}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isPending}>
            비밀번호 변경
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
