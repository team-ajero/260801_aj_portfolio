"use client";

import { useState, useTransition } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { submitReview } from "@/lib/actions/reviews";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";

const CATEGORIES = ["아파트", "주택", "상업공간"];

const emptyForm = { name: "", category: CATEGORIES[0], area: "", rating: 5, content: "" };

export function ReviewForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("이름과 후기 내용을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        await submitReview(form);
        toast.success("후기가 접수됐어요. 검토 후 게시될 예정입니다.");
        setForm(emptyForm);
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "제출에 실패했어요.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setForm(emptyForm)}>
          <MessageSquarePlus className="size-4" />
          후기 작성
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>후기 작성</DialogTitle>
          <DialogDescription>
            남겨주신 후기는 검토 후 게시돼요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>이름</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="홍O동"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>시공 종류</Label>
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
          </div>
          <div className="flex flex-col gap-2">
            <Label>평점</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  aria-label={`${n}점`}
                >
                  <Star
                    className={`size-6 ${n <= form.rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>후기 내용</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            제출
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
