export type UserRole = "STUDENT" | "PROFESSOR" | "ADMIN";

export type CaseStatus =
  | "NEW"
  | "TRIAGED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING_USER"
  | "WAITING_SUPERVISION"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export type CaseCategory =
  | "ABERTURA_MEI"
  | "ENQUADRAMENTO"
  | "OCUPACOES_PERMITIDAS"
  | "DAS"
  | "DECLARACAO_ANUAL"
  | "CCMEI"
  | "CONSULTA_CNPJ"
  | "NOTA_FISCAL"
  | "DEBITOS_PARCELAMENTO"
  | "REGULARIZACAO"
  | "BENEFICIOS_PREVIDENCIARIOS"
  | "CONTRATACAO_EMPREGADO"
  | "GOV_BR"
  | "GOLPES_FRAUDES"
  | "OUTROS";

export type ValidationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ValidationTarget = "ATTENDANCE" | "EXTENSION_HOURS";
export type AttendanceChannel = "PRESENCIAL" | "TELEFONE" | "WHATSAPP" | "EMAIL" | "OUTRO";

export type AttendanceInteractionType =
  | "SIMPLE_GUIDANCE"
  | "GUIDANCE_WITH_REFERRAL"
  | "DETAILED_SUPPORT"
  | "ONGOING_CASE";

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: SessionUser;
}

export interface RegisterStudentPayload {
  fullName: string;
  cpf: string;
  email: string;
  enrollment: string;
}

export interface FirstAccessPayload {
  email: string;
  password: string;
}

export interface StudentProfile {
  enrollment: string | null;
  cpf: string | null;
  course: string | null;
  semester: number | null;
}

export interface ProfessorProfile {
  department: string | null;
  title: string | null;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  studentProfile: StudentProfile | null;
  professorProfile: ProfessorProfile | null;
}

export interface StudentPerformanceCaseHistoryItem {
  id: string;
  action: "CASE_ASSIGNED" | "CASE_STATUS_CHANGED";
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

export interface StudentPerformanceAttendanceItem {
  id: string;
  channel: AttendanceChannel;
  durationMin: number;
  summary: string;
  nextStep: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface StudentPerformanceCaseItem {
  id: string;
  code: string;
  category: CaseCategory;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  assignedAt: string | null;
  totalAttendances: number;
  totalMinutes: number;
  request: {
    fullName: string;
    phone: string;
  };
  attendances: StudentPerformanceAttendanceItem[];
  history: StudentPerformanceCaseHistoryItem[];
}

export interface StudentPerformanceResponse {
  student: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    active: boolean;
    createdAt: string;
    studentProfile: StudentProfile | null;
  };
  stats: {
    totalCases: number;
    openCases: number;
    concludedCases: number;
    totalMinutes: number;
    totalHours: number;
  };
  cases: StudentPerformanceCaseItem[];
}

export interface CreateRequestPayload {
  fullName: string;
  email?: string;
  phone: string;
  cpf?: string;
  city?: string;
  state?: string;
  category: CaseCategory;
  description: string;
  preferredChannel?: AttendanceChannel;
  consentAccepted: boolean;
}

export interface RequestSubmissionResponse {
  requestId: string;
  message: string;
}

export interface TrackedRequestResponse {
  fullName: string;
  category: CaseCategory;
  preferredChannel: AttendanceChannel | null;
  createdAt: string;
  case: {
    id: string;
    code: string;
    status: CaseStatus;
    category: CaseCategory;
    updatedAt: string;
    assigneeName: string | null;
  } | null;
}

export interface ActiveAssignment {
  id: string;
  caseId: string;
  studentId: string;
  assignedAt: string;
  unassignedAt: string | null;
  active: boolean;
  student: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CaseListItem {
  id: string;
  code: string;
  category: CaseCategory;
  status: CaseStatus;
  priority: number;
  summary: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  request: {
    fullName: string;
    phone: string;
    cpf: string | null;
    city: string | null;
    state: string | null;
  };
  assignments: ActiveAssignment[];
}

export interface CaseListResponse {
  items: CaseListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Validation {
  id: string;
  target: ValidationTarget;
  attendanceId: string | null;
  extensionHoursId: string | null;
  reviewerId: string;
  status: ValidationStatus;
  comment: string | null;
  decidedAt: string | null;
  createdAt: string;
  reviewer?: {
    id: string;
    fullName: string;
  };
  attendance?: {
    id: string;
    caseId: string;
    studentId: string;
  };
}

export interface Attendance {
  id: string;
  caseId: string;
  studentId: string;
  channel: AttendanceChannel;
  interactionType: AttendanceInteractionType;
  demandDescription: string;
  actionTaken: string;
  outcome: string;
  needsFollowUp: boolean;
  internalNotes: string | null;
  durationMin: number;
  summary: string;
  nextStep: string | null;
  occurredAt: string;
  createdAt: string;
  student?: {
    id: string;
    fullName: string;
  };
  validations: Validation[];
}

export interface CaseDetail {
  id: string;
  code: string;
  requestId: string;
  category: CaseCategory;
  status: CaseStatus;
  priority: number;
  summary: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  request: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string;
    cpf: string | null;
    city: string | null;
    state: string | null;
    category: CaseCategory;
    description: string;
    consentAccepted: boolean;
    trackingToken: string;
    createdAt: string;
  };
  assignments: ActiveAssignment[];
  attendances: Attendance[];
}

export interface CreateAttendancePayload {
  channel: AttendanceChannel;
  interactionType: AttendanceInteractionType;
  demandDescription: string;
  actionTaken: string;
  outcome: string;
  needsFollowUp: boolean;
  internalNotes?: string;
  occurredAt?: string;
}

export interface UpdateCaseStatusPayload {
  status: CaseStatus;
  note?: string;
}

export interface PendingValidation {
  id: string;
  target: ValidationTarget;
  attendanceId: string | null;
  extensionHoursId: string | null;
  reviewerId: string;
  status: ValidationStatus;
  comment: string | null;
  decidedAt: string | null;
  createdAt: string;
  attendance: {
    id: string;
    channel: AttendanceChannel;
    durationMin: number;
    summary: string;
    nextStep: string | null;
    occurredAt: string;
    case: {
      id: string;
      code: string;
      category: CaseCategory;
    };
    student: {
      id: string;
      fullName: string;
    };
  } | null;
  extensionHours: {
    id: string;
    referenceDate: string;
    hours: number;
    activity: string;
    status: ValidationStatus;
    student: {
      id: string;
      fullName: string;
    };
  } | null;
}

export interface ValidationDecisionPayload {
  status: Extract<ValidationStatus, "APPROVED" | "REJECTED">;
  comment?: string;
}

export interface ExtensionHoursEntry {
  id: string;
  studentId: string;
  referenceDate: string;
  hours: number;
  activity: string;
  status: ValidationStatus;
  createdAt: string;
  validations: Validation[];
}

export interface CreateExtensionHoursPayload {
  referenceDate: string;
  hours: number;
  activity: string;
}

export interface ExtensionHoursSummary {
  studentId: string;
  APPROVED: number;
  PENDING: number;
  REJECTED: number;
  total: number;
}

export type ExtensionReportStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SIGNED"
  | "COMPLETED"
  | "RETURNED";

export interface EligibleCase {
  id: string;
  code: string;
  category: CaseCategory;
  summary: string;
  status: CaseStatus;
  closedAt: string | null;
  attendances: number;
  totalHours: number;
}

export interface ExtensionReportItem {
  id: string;
  caseId: string;
  attendanceId: string | null;
  snapshotDate: string;
  snapshotChannel: string;
  snapshotCategory: CaseCategory;
  snapshotSummary: string;
  snapshotAction: string;
  snapshotOutcome: string;
  snapshotStatus: string;
  snapshotHours: number;
}

export interface ExtensionReportSummary {
  id: string;
  code: string;
  status: ExtensionReportStatus;
  totalHours: number;
  periodStart: string | null;
  periodEnd: string | null;
  narrative: string;
  reviewerNote: string | null;
  submittedAt: string | null;
  signedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExtensionReportDetail extends ExtensionReportSummary {
  studentId: string;
  reviewerId: string | null;
  signedPdfKey: string | null;
  generatedPdfKey: string | null;
  items: ExtensionReportItem[];
  student?: {
    id: string;
    fullName: string;
    email: string;
    studentProfile: StudentProfile | null;
  };
}

export interface ExtensionReportQueueItem extends ExtensionReportSummary {
  studentId: string;
  reviewerId: string | null;
  student: { id: string; fullName: string; email: string };
  _count: { items: number };
}
