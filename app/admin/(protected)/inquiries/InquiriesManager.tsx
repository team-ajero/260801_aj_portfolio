"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { inquiries, type InquiryStatus } from "@/lib/db/schema";
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions/inquiries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DeleteConfirmButton } from "@/app/components/admin/DeleteConfirmButton";

type Inquiry = typeof inquiries.$inferSelect;

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "신규",
  in_progress: "처리중",
  done: "완료",
};

export function InquiriesManager({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [list, setList] = useState(initialInquiries);
  const [detail, setDetail] = useState<Inquiry | null>(null);
  const [, startTransition] = useTransition();

  const handleStatusChange = (inquiry: Inquiry, status: InquiryStatus) => {
    startTransition(async () => {
      try {
        await updateInquiryStatus(inquiry.id, status);
        setList((prev) => prev.map((i) => (i.id === inquiry.id ? { ...i, status } : i)));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "처리에 실패했어요.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>시공 종류</TableHead>
              <TableHead>접수일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  접수된 문의가 없어요.
                </TableCell>
              </TableRow>
            )}
            {list.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="cursor-pointer"
                onClick={() => setDetail(inquiry)}
              >
                <TableCell className="font-medium">{inquiry.name}</TableCell>
                <TableCell>{inquiry.phone}</TableCell>
                <TableCell>{inquiry.type ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {new Date(inquiry.createdAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={inquiry.status}
                    onValueChange={(v) => handleStatusChange(inquiry, v as InquiryStatus)}
                  >
                    <SelectTrigger size="sm" className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DeleteConfirmButton
                    description={`"${inquiry.name}"님의 문의를 삭제할까요?`}
                    onConfirm={async () => {
                      await deleteInquiry(inquiry.id);
                      setList((prev) => prev.filter((i) => i.id !== inquiry.id));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>문의 상세</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="flex flex-col gap-3 text-sm">
              <Row label="이름" value={detail.name} />
              <Row label="연락처" value={detail.phone} />
              <Row label="이메일" value={detail.email ?? "-"} />
              <Row label="시공 종류" value={detail.type ?? "-"} />
              <Row label="평수" value={detail.area ?? "-"} />
              <div>
                <p className="text-muted-foreground mb-1">요청사항</p>
                <p className="whitespace-pre-wrap">{detail.message || "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
