"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { aboutContent, teamMembers, companyHistory } from "@/lib/db/schema";
import {
  saveAboutContent,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  createCompanyHistory,
  updateCompanyHistory,
  deleteCompanyHistory,
  type AboutContentInput,
  type TeamMemberInput,
  type CompanyHistoryInput,
} from "@/lib/actions/about";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
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

type AboutContent = typeof aboutContent.$inferSelect;
type TeamMember = typeof teamMembers.$inferSelect;
type CompanyHistory = typeof companyHistory.$inferSelect;

const emptyContent: AboutContentInput = {
  eyebrow: "Our Story",
  title: "",
  body: "",
  imageUrl: "",
  stats: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
};

export function AboutManager({
  initialContent,
  initialTeam,
  initialHistory,
}: {
  initialContent: AboutContent | null;
  initialTeam: TeamMember[];
  initialHistory: CompanyHistory[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <StorySection initialContent={initialContent} />
      <TeamSection initialTeam={initialTeam} />
      <HistorySection initialHistory={initialHistory} />
    </div>
  );
}

// ---------- 스토리 + 통계 ----------

function StorySection({ initialContent }: { initialContent: AboutContent | null }) {
  const [content, setContent] = useState<AboutContentInput>(
    initialContent
      ? {
          eyebrow: initialContent.eyebrow,
          title: initialContent.title,
          body: initialContent.body,
          imageUrl: initialContent.imageUrl,
          stats: initialContent.stats,
        }
      : emptyContent
  );
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!content.title.trim() || !content.body.trim() || !content.imageUrl) {
      toast.error("제목, 본문, 이미지를 모두 입력해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        await saveAboutContent(content);
        toast.success("저장됐어요.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "저장에 실패했어요.");
      }
    });
  };

  const updateStat = (index: number, key: "title" | "description", value: string) => {
    setContent((c) => ({
      ...c,
      stats: c.stats.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">스토리 &amp; 통계</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ImageUploadField
          folder="about"
          value={content.imageUrl}
          onChange={(url) => setContent((c) => ({ ...c, imageUrl: url }))}
        />
        <div className="flex flex-col gap-2">
          <Label>eyebrow</Label>
          <Input
            value={content.eyebrow}
            onChange={(e) => setContent((c) => ({ ...c, eyebrow: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>제목</Label>
          <Input
            value={content.title}
            onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
            placeholder="예: 공간을 바꾸면 일상이 달라집니다"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>본문</Label>
          <Textarea
            value={content.body}
            onChange={(e) => setContent((c) => ({ ...c, body: e.target.value }))}
            rows={4}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>강점 (제목 / 설명)</Label>
          <div className="grid grid-cols-3 gap-4">
            {content.stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Input
                  value={stat.title}
                  onChange={(e) => updateStat(i, "title", e.target.value)}
                  placeholder="체계적 프로세스"
                />
                <Input
                  value={stat.description}
                  onChange={(e) => updateStat(i, "description", e.target.value)}
                  placeholder="상담부터 준공, 사후관리까지"
                />
              </div>
            ))}
          </div>
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

// ---------- 팀 소개 ----------

const emptyMember: TeamMemberInput = { name: "", role: "", imageUrl: null, order: 0 };

function TeamSection({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [list, setList] = useState(initialTeam);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamMemberInput>(emptyMember);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyMember, order: list.length });
    setOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    setForm({ name: member.name, role: member.role, imageUrl: member.imageUrl, order: member.order });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("이름과 역할을 입력해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        if (editing) {
          await updateTeamMember(editing.id, form);
          setList((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...form } : m)));
        } else {
          await createTeamMember(form);
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">함께하는 사람들</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              팀원 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "팀원 수정" : "팀원 추가"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <ImageUploadField
                label="프로필 사진 (선택)"
                folder="team"
                value={form.imageUrl ?? ""}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              />
              <div className="flex flex-col gap-2">
                <Label>이름</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>역할</Label>
                <Input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>역할</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  등록된 팀원이 없어요.
                </TableCell>
              </TableRow>
            )}
            {list.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteConfirmButton
                    description={`"${member.name}"님을 삭제할까요?`}
                    onConfirm={async () => {
                      await deleteTeamMember(member.id);
                      setList((prev) => prev.filter((m) => m.id !== member.id));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ---------- 연혁 ----------

const emptyHistory: CompanyHistoryInput = { year: "", event: "", order: 0 };

function HistorySection({ initialHistory }: { initialHistory: CompanyHistory[] }) {
  const [list, setList] = useState(initialHistory);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyHistory | null>(null);
  const [form, setForm] = useState<CompanyHistoryInput>(emptyHistory);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyHistory, order: list.length });
    setOpen(true);
  };

  const openEdit = (item: CompanyHistory) => {
    setEditing(item);
    setForm({ year: item.year, event: item.event, order: item.order });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.year.trim() || !form.event.trim()) {
      toast.error("연도와 내용을 입력해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        if (editing) {
          await updateCompanyHistory(editing.id, form);
          setList((prev) => prev.map((h) => (h.id === editing.id ? { ...h, ...form } : h)));
        } else {
          await createCompanyHistory(form);
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">걸어온 길</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              연혁 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "연혁 수정" : "연혁 추가"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>연도</Label>
                <Input value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} placeholder="2024" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>내용</Label>
                <Input value={form.event} onChange={(e) => setForm((f) => ({ ...f, event: e.target.value }))} />
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>연도</TableHead>
              <TableHead>내용</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  등록된 연혁이 없어요.
                </TableCell>
              </TableRow>
            )}
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.year}</TableCell>
                <TableCell>{item.event}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteConfirmButton
                    description="이 연혁 항목을 삭제할까요?"
                    onConfirm={async () => {
                      await deleteCompanyHistory(item.id);
                      setList((prev) => prev.filter((h) => h.id !== item.id));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
