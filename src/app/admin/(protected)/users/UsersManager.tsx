"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createAdminUser,
  setAdminUserRole,
  banAdminUser,
  unbanAdminUser,
  removeAdminUser,
  listAdminUsers,
} from "@/lib/actions/users";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { DeleteConfirmButton } from "@/app/components/admin/DeleteConfirmButton";

type AdminUser = Awaited<ReturnType<typeof listAdminUsers>>[number];

const emptyForm = { name: "", email: "", password: "", passwordConfirm: "", role: "user" as "admin" | "user" };

export function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  currentUserId: string;
}) {
  const [list, setList] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8) {
      toast.error("이름, 이메일을 입력하고 비밀번호는 8자 이상이어야 해요.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      toast.error("비밀번호와 비밀번호 확인이 일치하지 않아요.")
      return
    }

    startTransition(async () => {
      try {
        await createAdminUser(form);
        toast.success("계정을 생성했어요.");
        setOpen(false);
        setForm(emptyForm);
        window.location.reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "생성에 실패했어요.");
      }
    });
  };

  const handleRoleChange = (user: AdminUser, role: "admin" | "user") => {
    startTransition(async () => {
      try {
        await setAdminUserRole(user.id, role);
        setList((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "변경에 실패했어요.");
      }
    });
  };

  const handleToggleBan = (user: AdminUser) => {
    startTransition(async () => {
      try {
        if (user.banned) {
          await unbanAdminUser(user.id);
        } else {
          await banAdminUser(user.id);
        }
        setList((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, banned: !u.banned } : u))
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "처리에 실패했어요.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(emptyForm)}>
              <Plus className="size-4" />
              계정 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>관리자 계정 추가</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>이름</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>이메일</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>임시 비밀번호 (8자 이상)</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>비밀번호 확인</Label>
                <Input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>권한</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as "admin" | "user" }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">직원 (user)</SelectItem>
                    <SelectItem value="admin">관리자 (admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreate} disabled={isPending}>
                생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                  {user.id === currentUserId && (
                    <Badge variant="outline" className="ml-2">
                      나
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role ?? "user"}
                    onValueChange={(v) => handleRoleChange(user, v as "admin" | "user")}
                    disabled={user.id === currentUserId}
                  >
                    <SelectTrigger size="sm" className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">직원</SelectItem>
                      <SelectItem value="admin">관리자</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={user.banned ? "destructive" : "secondary"}>
                    {user.banned ? "정지됨" : "활성"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending || user.id === currentUserId}
                    onClick={() => handleToggleBan(user)}
                  >
                    {user.banned ? "정지 해제" : "정지"}
                  </Button>
                  {user.id !== currentUserId && (
                    <DeleteConfirmButton
                      description={`"${user.name}" 계정을 삭제할까요?`}
                      onConfirm={async () => {
                        await removeAdminUser(user.id);
                        setList((prev) => prev.filter((u) => u.id !== user.id));
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
