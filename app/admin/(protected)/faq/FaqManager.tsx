"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { faqs } from "@/lib/db/schema";
import { createFaq, updateFaq, deleteFaq, type FaqInput } from "@/lib/actions/faqs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
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

type Faq = typeof faqs.$inferSelect;

const CATEGORIES = ["견적/비용", "시공기간", "진행절차", "AS/보증"];

const emptyForm: FaqInput = {
  category: CATEGORIES[0],
  question: "",
  answer: "",
  order: 0,
};

export function FaqManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [list, setList] = useState(initialFaqs);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<FaqInput>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: list.length });
    setOpen(true);
  };

  const openEdit = (faq: Faq) => {
    setEditing(faq);
    setForm({ category: faq.category, question: faq.question, answer: faq.answer, order: faq.order });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("질문과 답변을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        if (editing) {
          await updateFaq(editing.id, form);
          setList((prev) => prev.map((f) => (f.id === editing.id ? { ...f, ...form } : f)));
        } else {
          await createFaq(form);
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
              FAQ 등록
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "FAQ 수정" : "FAQ 등록"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>카테고리</Label>
                <select
                  className="border rounded-md h-9 px-3 text-sm bg-transparent"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>질문</Label>
                <Input
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>답변</Label>
                <Textarea
                  value={form.answer}
                  onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                  rows={4}
                />
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
              <TableHead>카테고리</TableHead>
              <TableHead>질문</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                  등록된 FAQ가 없어요.
                </TableCell>
              </TableRow>
            )}
            {list.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell>
                  <Badge variant="secondary">{faq.category}</Badge>
                </TableCell>
                <TableCell className="font-medium">{faq.question}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteConfirmButton
                    description={`"${faq.question}" 항목을 삭제할까요?`}
                    onConfirm={async () => {
                      await deleteFaq(faq.id);
                      setList((prev) => prev.filter((f) => f.id !== faq.id));
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
