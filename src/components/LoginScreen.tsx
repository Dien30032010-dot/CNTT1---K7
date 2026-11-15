import { useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, ClipboardList, GraduationCap, ShieldCheck } from "lucide-react";
import type { ClassDatabase, Role, SessionState } from "../types";
import { ClassLogo } from "./ClassLogo";

interface LoginScreenProps {
  db: ClassDatabase;
  onLogin: (session: SessionState) => void;
}

const ROLE_OPTIONS: {
  id: Role;
  label: string;
  desc: string;
  icon: typeof GraduationCap;
}[] = [
  { id: "student", label: "Sinh viên", desc: "Không cần mật khẩu", icon: GraduationCap },
  { id: "teacher", label: "Giáo viên", desc: "Chọn tên & mật khẩu", icon: BookOpenCheck },
  { id: "admin", label: "Quản lý", desc: "Toàn quyền hệ thống", icon: ShieldCheck },
  { id: "officer", label: "Ban cán sự lớp", desc: "Chọn tên & mật khẩu", icon: ClipboardList },
];

export function LoginScreen({ db, onLogin }: LoginScreenProps) {
  const [role, setRole] = useState<Role>("student");
  const [studentIdx, setStudentIdx] = useState<string>("0");

  const [teacherChoice, setTeacherChoice] = useState<string>(() =>
    db.teachers.length > 0 ? "0" : "__custom__"
  );
  const [customTeacherName, setCustomTeacherName] = useState<string>("");

  const [officerIdx, setOfficerIdx] = useState<string>("0");

  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (db.teachers.length > 0 && teacherChoice === "__custom__" && !customTeacherName) {
      setTeacherChoice("0");
    } else if (db.teachers.length === 0) {
      setTeacherChoice("__custom__");
    } else if (
      teacherChoice !== "__custom__" &&
      Number(teacherChoice) >= db.teachers.length
    ) {
      setTeacherChoice("0");
    }
  }, [db.teachers.length, teacherChoice, customTeacherName]);

  useEffect(() => {
    if (db.officers.length > 0 && Number(officerIdx) >= db.officers.length) {
      setOfficerIdx("0");
    }
  }, [db.officers.length, officerIdx]);

  const handleSelectRole = (nextRole: Role) => {
    setRole(nextRole);
    setError("");
    setPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "student") {
      const idx = Number(studentIdx);
      const student = db.students[idx];
      if (!student) {
        setError("Chưa có sinh viên. Hãy liên hệ quản lý lớp.");
        return;
      }
      onLogin({
        role: "student",
        currentStudent: student.id,
        currentTeacher: "",
        currentTeacherSubject: "",
        currentOfficer: "",
        currentOfficerPosition: "",
      });
      return;
    }

    let chosenTeacherName = "";
    let chosenTeacherSubject = "";
    let chosenOfficerName = "";
    let chosenOfficerPosition = "";

    if (role === "teacher") {
      if (teacherChoice === "__custom__" || db.teachers.length === 0) {
        chosenTeacherName = customTeacherName.trim();
        if (!chosenTeacherName) {
          setError("Vui lòng chọn hoặc nhập tên giáo viên trước khi đăng nhập.");
          return;
        }
      } else {
        const t = db.teachers[Number(teacherChoice)];
        if (!t) {
          setError("Vui lòng chọn tên giáo viên hợp lệ.");
          return;
        }
        chosenTeacherName = t.name;
        chosenTeacherSubject = t.subject || "";
      }
    }

    if (role === "officer") {
      const o = db.officers[Number(officerIdx)];
      if (!o) {
        setError("Chưa có ban cán sự lớp. Hãy liên hệ quản lý để thêm.");
        return;
      }
      chosenOfficerName = o.name;
      chosenOfficerPosition = o.position || "";
    }

    const expected =
      role === "teacher"
        ? db.teacherPass
        : role === "admin"
        ? db.adminPass
        : db.officerPass;

    if (password !== expected) {
      setError("Mật khẩu không đúng.");
      return;
    }

    onLogin({
      role,
      currentStudent: "",
      currentTeacher: role === "teacher" ? chosenTeacherName : "",
      currentTeacherSubject: role === "teacher" ? chosenTeacherSubject : "",
      currentOfficer: role === "officer" ? chosenOfficerName : "",
      currentOfficerPosition: role === "officer" ? chosenOfficerPosition : "",
    });
  };

  const passwordLabel =
    role === "teacher"
      ? "Mật khẩu giáo viên"
      : role === "admin"
      ? "Mật khẩu quản lý"
      : "Mật khẩu ban cán sự lớp";

  const showCustomTeacherInput =
    role === "teacher" && (teacherChoice === "__custom__" || db.teachers.length === 0);

  return (
    <div
      className="min-h-screen grid place-items-center p-4 md:p-6"
      style={{
        background:
          "radial-gradient(circle at 15% 15%, #1c5eaa 0%, transparent 34%), linear-gradient(135deg, #07172f, #102b55 60%, #06152d)",
      }}
    >
      <div className="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-[#4773ad] rounded-3xl bg-[#10264a] shadow-2xl">
        <section className="p-7 md:p-9 text-white flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#102d5b] to-[#06162f]">
          <ClassLogo size="lg" />
          <h1 className="text-2xl md:text-[32px] font-extrabold tracking-tight mt-4 mb-1">
            {db.className}
          </h1>
          <p className="text-[#b8d2ff] text-sm font-medium tracking-wide">
            HỆ THỐNG QUẢN LÝ LỚP
          </p>
          <p className="mt-6 text-sm text-[#b8d2ff]/90 italic max-w-xs">
            Cùng học tập · Cùng tiến bộ · Cùng phát triển
          </p>
        </section>

        <section className="p-6 md:p-8 bg-[var(--panel)] text-[var(--ink)] flex flex-col justify-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Đăng nhập hệ thống</h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              Chọn đúng vai trò để tiếp tục.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-5" role="radiogroup" aria-label="Vai trò đăng nhập">
            {ROLE_OPTIONS.map((item) => {
              const Icon = item.icon;
              const active = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleSelectRole(item.id)}
                  className={`text-left p-3 rounded-xl border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                    active
                      ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--line)] bg-[var(--panel-subtle)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-[var(--ink)]">
                    <Icon className="w-4 h-4 shrink-0 text-[var(--primary)]" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5 truncate">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {role === "student" && (
              <div>
                <label
                  htmlFor="studentSelect"
                  className="block text-[13px] font-semibold mb-1.5"
                >
                  Chọn tên sinh viên
                </label>
                <select
                  id="studentSelect"
                  value={studentIdx}
                  onChange={(e) => setStudentIdx(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                >
                  {db.students.length > 0 ? (
                    db.students.map((s, idx) => (
                      <option key={s.id} value={String(idx)}>
                        {s.name} · {s.id}
                      </option>
                    ))
                  ) : (
                    <option value="">Chưa có sinh viên</option>
                  )}
                </select>
              </div>
            )}

            {role === "teacher" && (
              <>
                <div>
                  <label
                    htmlFor="teacherSelect"
                    className="block text-[13px] font-semibold mb-1.5"
                  >
                    Chọn tên giáo viên
                  </label>
                  <select
                    id="teacherSelect"
                    value={teacherChoice}
                    onChange={(e) => {
                      setTeacherChoice(e.target.value);
                      setError("");
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  >
                    {db.teachers.map((t, idx) => (
                      <option key={`${t.name}-${idx}`} value={String(idx)}>
                        {t.name}
                        {t.subject ? ` · ${t.subject}` : ""}
                      </option>
                    ))}
                    <option value="__custom__">
                      {db.teachers.length > 0
                        ? "+ Nhập tên giáo viên khác..."
                        : "Tự nhập tên giáo viên"}
                    </option>
                  </select>
                </div>

                {showCustomTeacherInput && (
                  <div>
                    <label
                      htmlFor="customTeacherInput"
                      className="block text-[13px] font-semibold mb-1.5"
                    >
                      Họ và tên giáo viên
                    </label>
                    <input
                      id="customTeacherInput"
                      type="text"
                      value={customTeacherName}
                      onChange={(e) => {
                        setCustomTeacherName(e.target.value);
                        setError("");
                      }}
                      placeholder="VD: Nguyễn Thị Minh"
                      autoComplete="name"
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                    {db.teachers.length === 0 && (
                      <p className="text-xs text-[var(--muted)] mt-1">
                        Quản lý có thể thêm danh sách giáo viên cố định trong mục Quản lý giáo viên.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {role === "officer" && (
              <div>
                <label
                  htmlFor="officerSelect"
                  className="block text-[13px] font-semibold mb-1.5"
                >
                  Chọn tên ban cán sự lớp
                </label>
                <select
                  id="officerSelect"
                  value={officerIdx}
                  onChange={(e) => {
                    setOfficerIdx(e.target.value);
                    setError("");
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                >
                  {db.officers.length > 0 ? (
                    db.officers.map((o, idx) => (
                      <option key={`${o.name}-${idx}`} value={String(idx)}>
                        {o.name}
                        {o.position ? ` · ${o.position}` : ""}
                      </option>
                    ))
                  ) : (
                    <option value="">Chưa có ban cán sự lớp</option>
                  )}
                </select>
              </div>
            )}

            {role !== "student" && (
              <div>
                <label
                  htmlFor="loginPassword"
                  className="block text-[13px] font-semibold mb-1.5"
                >
                  {passwordLabel}
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
            )}

            {error && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Đăng nhập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-[var(--muted)] mt-6">
            {db.className} · {db.school}
          </p>
        </section>
      </div>
    </div>
  );
}
