"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { services } from "@/lib/db/schema";
import {
  createService,
  updateService,
  deleteService,
  type ServiceInput,
} from "@/lib/actions/services";
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
import { ImageUploadField } from "@/app/components/admin/ImageUploadField";
import { DeleteConfirmButton } from "@/app/components/admin/DeleteConfirmButton";

type Service = typeof services.$inferSelect;

const emptyForm: ServiceInput = {
  title: "",
  description: "",
  details: [],
  price: "",
  imageUrl: "",
  order: 0,
};

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [list, setList] = useState(initialServices);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [detailsText, setDetailsText] = useState("");
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: list.length });
    setDetailsText("");
    setOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description,
      details: service.details,
      price: service.price,
      imageUrl: service.imageUrl,
      order: service.order,
    });
    setDetailsText(service.details.join("\n"));
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.imageUrl) {
      toast.error("제목과 이미지는 필수예요.");
      return;
    }

    const input: ServiceInput = {
      ...form,
      details: detailsText.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    startTransition(async () => {
      try {
        if (editing) {
          await updateService(editing.id, input);
          setList((prev) =>
            prev.map((s) => (s.id === editing.id ? { ...s, ...input } : s))
          );
        } else {
          await createService(input);
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
              서비스 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "서비스 수정" : "서비스 등록"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <ImageUploadField
                folder="services"
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              />
              <div className="flex flex-col gap-2">
                <Label>제목</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="예: 아파트 인테리어"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>설명</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>상세 항목 (줄바꿈으로 구분)</Label>
                <Textarea
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  placeholder={"설계 및 3D 렌더링\n전체 철거 및 시공"}
                  rows={4}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>가격</Label>
                <Input
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="예: 평당 150만원~"
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
              <TableHead>제목</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>상세 항목</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                  등록된 서비스가 없어요.
                </TableCell>
              </TableRow>
            )}
            {list.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {service.details.length}개 항목
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteConfirmButton
                    description={`"${service.title}" 서비스를 삭제할까요?`}
                    onConfirm={async () => {
                      await deleteService(service.id);
                      setList((prev) => prev.filter((s) => s.id !== service.id));
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
