"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { works } from "@/lib/db/schema";
import { createWork, updateWork, deleteWork, type WorkInput } from "@/lib/actions/works";
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
import { ImageUploadField } from "@/app/components/admin/ImageUploadField";
import { DeleteConfirmButton } from "@/app/components/admin/DeleteConfirmButton";

type Work = typeof works.$inferSelect;

const CATEGORIES = ["아파트", "주택", "상업공간"];

const emptyForm: WorkInput = {
  title: "",
  category: CATEGORIES[0],
  area: "",
  year: String(new Date().getFullYear()),
  imageUrl: "",
  order: 0,
};

export function WorksManager({ initialWorks }: { initialWorks: Work[] }) {
  const [list, setList] = useState(initialWorks);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Work | null>(null);
  const [form, setForm] = useState<WorkInput>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: list.length });
    setOpen(true);
  };

  const openEdit = (work: Work) => {
    setEditing(work);
    setForm({
      title: work.title,
      category: work.category,
      area: work.area,
      year: work.year,
      imageUrl: work.imageUrl,
      order: work.order,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.imageUrl) {
      toast.error("제목과 이미지는 필수예요.");
      return;
    }

    startTransition(async () => {
      try {
        if (editing) {
          await updateWork(editing.id, form);
          setList((prev) =>
            prev.map((w) => (w.id === editing.id ? { ...w, ...form } : w))
          );
        } else {
          await createWork(form);
          // 서버에서 재조회하지 않고 낙관적으로만 반영하기엔 id가 없으므로 새로고침
          window.location.reload();
          return;
        }
        toast.success("저장됐어요.");
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "저장에 실패했어요.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              포트폴리오 등록
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "포트폴리오 수정" : "포트폴리오 등록"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <ImageUploadField
                folder="works"
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              />
              <div className="flex flex-col gap-2">
                <Label>제목</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="예: 강남 아파트"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>카테고리</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>평수</Label>
                  <Input
                    value={form.area}
                    onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                    placeholder="예: 84㎡"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>연도</Label>
                  <Input
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    placeholder="예: 2024"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>평수</TableHead>
              <TableHead>연도</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  등록된 포트폴리오가 없어요.
                </TableCell>
              </TableRow>
            )}
            {list.map((work) => (
              <TableRow key={work.id}>
                <TableCell className="font-medium">{work.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{work.category}</Badge>
                </TableCell>
                <TableCell>{work.area}</TableCell>
                <TableCell>{work.year}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(work)}>
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteConfirmButton
                    description={`"${work.title}" 포트폴리오를 삭제할까요?`}
                    onConfirm={async () => {
                      await deleteWork(work.id);
                      setList((prev) => prev.filter((w) => w.id !== work.id));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
