import type { ClassDatabase, Officer, Student, ThemeMode } from "../types";

export const STORAGE_KEY = "cntt1_data";

export const CLASS_ROSTER: Student[] = [
  { name: "Châu Hoàng Đăng", id: "IT26CN3105" },
  { name: "Chung Triệu Mẫn", id: "IT26CN3121" },
  { name: "Danh Chí Thiện", id: "IT26CN3150" },
  { name: "Danh Hữu Trọng", id: "IT26CN3142" },
  { name: "Danh Nguyễn Anh Thư", id: "IT26CN3137" },
  { name: "Dương Duy Đạt", id: "IT26CN3106" },
  { name: "Dương Hồng Đức", id: "IT26CN3207" },
  { name: "Dương Huỳnh Chí Hiếu", id: "IT26CN3149" },
  { name: "Đỗ Hoàng Song Trà", id: "IT26CN3140" },
  { name: "Đỗ Mỹ Hương", id: "IT26CN3115" },
  { name: "Đỗ Ngọc Khánh Nhi", id: "IT26CN3126" },
  { name: "Huỳnh Ngọc Gia Ân", id: "IT26CN3146" },
  { name: "Lâm Minh Đức", id: "IT26CN3108" },
  { name: "Lê Đào Minh Phúc", id: "IT26CN3128" },
  { name: "Lê Phạm Minh Khôi", id: "IT26CN3119" },
  { name: "Lê Tấn Hoàng", id: "IT26CN3114" },
  { name: "Lê Thảo My", id: "IT26CN3123" },
  { name: "Lê Trọng Tình", id: "IT26CN3139" },
  { name: "Lê Vĩnh Phát", id: "IT26CN3127" },
  { name: "Lương Nguyễn Phi Hổ", id: "IT26CN3213" },
  { name: "Lương Thanh Thảo", id: "IT26CN3148" },
  { name: "Lý Anh Tuấn", id: "IT26CN3143" },
  { name: "Mai Minh Nhất", id: "IT26CN3125" },
  { name: "Nguyễn Hoàng Yến Linh", id: "IT26CN3147" },
  { name: "Nguyễn Lê Huy", id: "IT26CN3116" },
  { name: "Nguyễn Minh Quân", id: "IT26CN3130" },
  { name: "Nguyễn Minh Thi", id: "IT26CN3135" },
  { name: "Nguyễn Ngọc Thanh Nhã", id: "IT26CN3124" },
  { name: "Nguyễn Thành Đạt", id: "DL26KS3107" },
  { name: "Nguyễn Thanh Thúy Hiền", id: "IT26CN3113" },
  { name: "Nguyễn Thị Mỹ Trân", id: "IT26CN3141" },
  { name: "Nguyễn Trần Gia Bảo", id: "IT26CN3103" },
  { name: "Nguyễn Văn Điền", id: "IT26CN3107" },
  { name: "Nguyễn Viên Hải Yến", id: "IT26CN3145" },
  { name: "Phạm Quốc Anh", id: "IT26CN3101" },
  { name: "Phan Nguyễn Hoàng Giang", id: "IT26CN3110" },
  { name: "Tạ Võ Kim Hân", id: "IT26CN3111" },
  { name: "Tăng Ngọc Thiện", id: "IT26CN3136" },
  { name: "Tống Quang Minh", id: "IT26CN3122" },
  { name: "Trầm Ngọc Quỳnh", id: "IT26CN3131" },
  { name: "Trần Khánh Lâm", id: "IT26CN3120" },
  { name: "Trần Quỳnh Gia Bảo", id: "IT26CN3203" },
  { name: "Trần Trọng Khang", id: "IT26CN3117" },
  { name: "Trần Văn Vĩ", id: "IT26CN3144" },
  { name: "Trần Võ Thành Tài", id: "IT26CN3133" },
  { name: "Văn Thanh Hạo", id: "IT26CN3112" },
  { name: "Võ Chí Khang", id: "IT26CN3118" },
];

export const CLASS_OFFICERS: Officer[] = [
  { name: "Nguyễn Ngọc Thanh Nhã", position: "Lớp phó học tập" },
  { name: "Nguyễn Viên Hải Yến", position: "Lớp trưởng" },
  { name: "Lê Thảo My", position: "Quỹ lớp" },
];

export const DEFAULTS: ClassDatabase = {
  teacherPass: "kgc20262030",
  adminPass: "kgc2010",
  officerPass: "kgc6868",
  theme: "default",
  className: "CNTT1 - 9+K7",
  school: "Trường Cao đẳng Kiên Giang",
  students: [],
  teachers: [],
  officers: [],
  announcements: [],
  fundRecords: [],
  grades: [],
  evaluations: [],
  violations: [],
  requests: [],
};

export const VIOLATION_TYPES = [
  "Nói chuyện",
  "Sử dụng điện thoại",
  "Vắng không phép",
  "Vắng có phép",
  "Vào trễ",
  "Khác",
] as const;

export const EVALUATION_LEVELS = ["Tốt", "Khá", "Đạt", "Cần cố gắng"] as const;

export function cloneDefaults(): ClassDatabase {
  return JSON.parse(JSON.stringify(DEFAULTS)) as ClassDatabase;
}

export function loadDatabase(): ClassDatabase {
  let parsed: Partial<ClassDatabase> | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      parsed = JSON.parse(raw) as Partial<ClassDatabase>;
    }
  } catch {
    parsed = null;
  }

  const db: ClassDatabase = {
    ...cloneDefaults(),
    ...(parsed ?? {}),
    students: Array.isArray(parsed?.students) ? [...parsed.students] : [],
    teachers: Array.isArray(parsed?.teachers) ? [...parsed.teachers] : [],
    officers: Array.isArray(parsed?.officers) ? [...parsed.officers] : [],
    announcements: Array.isArray(parsed?.announcements)
      ? [...parsed.announcements]
      : [],
    fundRecords: Array.isArray(parsed?.fundRecords)
      ? [...parsed.fundRecords]
      : [],
    grades: Array.isArray(parsed?.grades) ? [...parsed.grades] : [],
    evaluations: Array.isArray(parsed?.evaluations) ? [...parsed.evaluations] : [],
    violations: Array.isArray(parsed?.violations) ? [...parsed.violations] : [],
    requests: Array.isArray(parsed?.requests) ? [...parsed.requests] : [],
  };

  const existingIds = new Set(db.students.map((s) => s.id));
  for (const s of CLASS_ROSTER) {
    if (!existingIds.has(s.id)) {
      db.students.push({ ...s });
    }
  }

  // Migrate typo in existing localStorage if present
  db.students = db.students.map((s) =>
    s.id === "IT26CN3131" && s.name === "Trâm Ngọc Quỳnh"
      ? { ...s, name: "Trầm Ngọc Quỳnh" }
      : s
  );

  if (!db.officersSeeded) {
    const existingOfficerNames = new Set(
      db.officers.map((o) => o.name.trim().toLowerCase())
    );
    for (const officer of CLASS_OFFICERS) {
      if (!existingOfficerNames.has(officer.name.trim().toLowerCase())) {
        db.officers.push({ ...officer });
      }
    }
    db.officersSeeded = true;
  }

  saveDatabase(db);
  return db;
}

export function saveDatabase(db: ClassDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function applyThemeClass(theme: ThemeMode): void {
  const root = document.documentElement;
  root.classList.remove("dark", "theme-sakura", "theme-green");
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "sakura") {
    root.classList.add("theme-sakura");
  } else if (theme === "green") {
    root.classList.add("theme-green");
  }
}
