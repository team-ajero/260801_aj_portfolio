"use client";

import { useState, useTransition } from "react";
import { Pencil, Star } from "lucide-react";
import { toast } from "sonner";
import { reviews } from "@/lib/db/schema";
import {
  updateReview,
  updateReviewStatus,
  deleteReview,
  type ReviewEditInput,
} from "@/lib/actions/reviews";
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { DeleteConfirmButton } from "@/app/components/admin/DeleteConfirmButton";

type Review = typeof reviews.$inferSelect;

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [list, setList] = useState(initialReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "published">("all");
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<ReviewEditInput | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = list.filter((r) => filter === "all" || r.status === filter);

  const openEdit = (review: Review) => {
    setEditing(review);
    setForm({
      name: review.name,
      category: review.category,
      area: review.area,
      rating: review.rating,
      content: review.content,
    });
  };

  const handleToggleStatus = (review: Review) => {
    const nextStatus = review.status === "published" ? "pending" : "published";
    startTransition(async () => {
      try {
        await updateReviewStatus(review.id, nextStatus);
        setList((prev) =>
          prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r))
        );
        toast.success(nextStatus === "published" ? "승인해서 노출했어요." : "노출을 중단했어요.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "처리에 실패했어요.");
      }
    });
  };

  const handleSubmit = () => {
    if (!editing || !form) return;
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("이름과 내용을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        await updateReview(editing.id, form);
        setList((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
        toast.success("저장됐어요.");
        setEditing(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "저장에 실패했어요.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">전체 {list.length}</TabsTrigger>
          <TabsTrigger value="pending">
            대기 {list.filter((r) => r.status === "pending").length}
          </TabsTrigger>
          <TabsTrigger value="published">
            게시중 {list.filter((r) => r.status === "published").length}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>작성자</TableHead>
              <TableHead>평점</TableHead>
              <TableHead>내용</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  후기가 없어요.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium whitespace-nowrap">{review.name}</TableCell>
                <TableCell>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${i < review.rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {review.content}
                </TableCell>
                <TableCell>
                  <Badge variant={review.status === "published" ? "default" : "secondary"}>
                    {review.status === "published" ? "게시중" : "대기"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleToggleStatus(review)}
                  >
                    {review.status === "published" ? "노출 중단" : "승인"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(review)}>
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteConfirmButton
                    description={`"${review.name}"님의 후기를 삭제할까요?`}
                    onConfirm={async () => {
                      await deleteReview(review.id);
                      setList((prev) => prev.filter((r) => r.id !== review.id));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>후기 수정</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>이름</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => f && { ...f, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>평점 (1~5)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={form.rating}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, rating: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>카테고리</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm((f) => f && { ...f, category: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>평수</Label>
                  <Input
                    value={form.area}
                    onChange={(e) => setForm((f) => f && { ...f, area: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>내용</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => f && { ...f, content: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
