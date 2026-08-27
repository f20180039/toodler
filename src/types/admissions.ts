/** The school's own vocabulary, as enums.
 *
 *  These are the values a school administrator picks from — grades, roles,
 *  admission stages, statuses. They are enums rather than string unions so a
 *  typo is a compile error and every option list has one source of truth. The
 *  enum *value* is what a user sees, so it doubles as the display label. */

/** The six journey stages from the brief, plus anything added beyond them.
 *  Declaration order is the order the stage tabs appear in. */
export enum WorkflowStage {
  Enquiry = 'Enquiry',
  Application = 'Application',
  Review = 'Review',
  Decision = 'Decision',
  Enrolment = 'Enrolment',
  Payment = 'Payment',
  Transfer = 'Transfer',
}

/** Pre-primary through to school-leaving, in journey order. */
export enum Grade {
  AllGrades = 'All grades',
  Nursery = 'Nursery',
  LKG = 'LKG',
  UKG = 'UKG',
  Grade1 = 'Grade 1',
  Grade2 = 'Grade 2',
  Grade3 = 'Grade 3',
  Grade4 = 'Grade 4',
  Grade5 = 'Grade 5',
  Grade6 = 'Grade 6',
  Grade7 = 'Grade 7',
  Grade8 = 'Grade 8',
  Grade9 = 'Grade 9',
  Grade10 = 'Grade 10',
  Grade11 = 'Grade 11',
  Grade12 = 'Grade 12',
}

/** Written with an en dash, once, so a filter cannot silently miss a match. */
export enum AcademicYear {
  Y2026 = '2026–27',
  Y2027 = '2027–28',
}

/** Everyone a workflow can write to or assign work to. Roles, never addresses:
 *  they resolve per applicant at send time and survive staff turnover. */
export enum Role {
  Parent = 'Parent / Guardian',
  Applicant = 'Applicant',
  AdmissionsOfficer = 'Admissions officer',
  Counsellor = 'Assigned counsellor',
  ClassTeacher = 'Class teacher',
  FinanceTeam = 'Finance team',
  AdmissionsTeam = 'Admissions team',
  AdmissionsHead = 'Admissions head',
  InterviewPanel = 'Interview panel',
  Principal = 'Principal',
  RecordsTeam = 'Records team',
  DestinationOfficer = 'Destination admissions officer',
  DestinationCoordinator = 'Destination coordinator',
  HouseCaptain = 'House captain',
}

/** Events that can start a workflow. */
export enum TriggerEvent {
  EnquirySubmitted = 'Enquiry submitted',
  ApplicationSubmitted = 'Application submitted',
  DocumentsSubmitted = 'Documents submitted',
  InterviewScheduled = 'Interview scheduled',
  InterviewCompleted = 'Interview completed',
  OfferAccepted = 'Offer accepted',
  ApplicantEnrolled = 'Applicant enrolled',
  PaymentReceived = 'Payment received',
  TransferRequestRaised = 'Transfer request raised',
}

/** The fields a branch can test and an update-status node can set. */
export enum AdmissionField {
  ApplicationStatus = 'Application status',
  DocumentStatus = 'Document status',
  InterviewStatus = 'Interview status',
  Decision = 'Decision',
  PaymentStatus = 'Payment status',
  DuesStatus = 'Dues status',
  SeatAvailability = 'Seat availability',
  TransferStatus = 'Transfer status',
  OfferStatus = 'Offer status',
  EnrolmentStatus = 'Enrolment status',
  House = 'House',
}

/* ---- the values each field can hold ------------------------------------- */

export enum ApplicationStatus {
  Submitted = 'Submitted',
  UnderReview = 'Under review',
  Shortlisted = 'Shortlisted',
  NeedsSecondLook = 'Needs a second look',
  Waitlisted = 'Waitlisted',
  Rejected = 'Rejected',
}

export enum DocumentStatus {
  Complete = 'Complete',
  Incomplete = 'Incomplete',
  Rejected = 'Rejected',
}

export enum InterviewStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  NoShow = 'No show',
  Rescheduled = 'Rescheduled',
}

export enum DecisionOutcome {
  Offered = 'Offered',
  Waitlisted = 'Waitlisted',
  Rejected = 'Rejected',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Partial = 'Partial',
  Paid = 'Paid',
}

export enum DuesStatus {
  Cleared = 'Cleared',
  Pending = 'Pending',
}

export enum SeatAvailability {
  Available = 'Available',
  Waitlist = 'Waitlist',
  NoSeat = 'No seat',
}

export enum TransferStatus {
  Requested = 'Requested',
  Approved = 'Approved',
  Waitlisted = 'Waitlisted',
  Declined = 'Declined',
  Completed = 'Completed',
}

export enum OfferStatus {
  Accepted = 'Accepted',
  Declined = 'Declined',
  Expired = 'Expired',
}

export enum EnrolmentStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Withdrawn = 'Withdrawn',
}

export enum House {
  Red = 'Red',
  Yellow = 'Yellow',
  Blue = 'Blue',
  Green = 'Green',
}

/** Anything an AdmissionField can be set to or compared against. */
export type FieldValue =
  | ApplicationStatus
  | DocumentStatus
  | InterviewStatus
  | DecisionOutcome
  | PaymentStatus
  | DuesStatus
  | SeatAvailability
  | TransferStatus
  | OfferStatus
  | EnrolmentStatus
  | House

/* ---- node parameter vocabularies ---------------------------------------- */

export enum Operator {
  Equals = '=',
  IsNot = 'is not',
  IsEmpty = 'is empty',
  IsNotEmpty = 'is not empty',
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum NotifyChannel {
  InApp = 'In-app',
  InAppAndEmail = 'In-app + email',
}

export enum NotifyPriority {
  Normal = 'Normal',
  Urgent = 'Urgent',
}

export enum AllocateTarget {
  House = 'House',
  ClassSection = 'Class & section',
}

export enum AllocateMethod {
  Balance = 'Balance across options',
  MatchSibling = 'Match a sibling',
  PickOne = 'Pick one option',
}
