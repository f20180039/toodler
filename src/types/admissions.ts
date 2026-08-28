/** The school's own vocabulary, as enums.
 *
 *  These are the values a school administrator picks from — grades, roles,
 *  admission stages, statuses. They are enums rather than string unions so a
 *  typo is a compile error and every option list has one source of truth. The
 *  enum *value* is what a user sees, so it doubles as the display label. */

/** The journey stages, plus anything added beyond them. Declaration order is
 *  the order the stage tabs appear in. Registration sits between Decision and
 *  Enrolment: the admission-fee checkpoint is its own milestone, and where a
 *  school puts the fee is the school's choice (→ D-30). */
export enum WorkflowStage {
  Enquiry = 'Enquiry',
  Application = 'Application',
  Review = 'Review',
  Decision = 'Decision',
  Registration = 'Registration',
  Enrolment = 'Enrolment',
  Payment = 'Payment',
  Transfer = 'Transfer',
}

/** Draft while it is being built, Active once someone has reviewed it, Paused
 *  when an incident means "stop it now". Activation is a deliberate step
 *  because a misconfigured fee reminder to three hundred families cannot be
 *  recalled (→ D-10). */
export enum WorkflowState {
  Draft = 'Draft',
  Active = 'Active',
  Paused = 'Paused',
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

/** How often one applicant can enter the same workflow. Once only is the safe
 *  default; the waitlist promotion needs Every time, because a released seat
 *  re-fires the trigger for the next family (→ D-14, D-28). */
export enum ReentryRule {
  Once = 'Once only',
  OncePerYear = 'Once per academic year',
  EveryTime = 'Every time',
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

/** Events that can start a workflow. Most are ways a journey begins; *Seat
 *  released* is how it resumes for somebody else, and a **failed** payment is
 *  separate from an **unpaid** one because they call for opposite responses
 *  (→ D-32). */
export enum TriggerEvent {
  EnquirySubmitted = 'Enquiry submitted',
  ApplicationSubmitted = 'Application submitted',
  DocumentsSubmitted = 'Documents submitted',
  InterviewScheduled = 'Interview scheduled',
  InterviewCompleted = 'Interview completed',
  OfferAccepted = 'Offer accepted',
  ApplicantEnrolled = 'Applicant enrolled',
  PaymentReceived = 'Payment received',
  PaymentFailed = 'Payment failed',
  PaymentPending = 'Payment pending',
  ConcessionRequested = 'Concession requested',
  ConcessionDecided = 'Concession decided',
  ApplicantWithdrawn = 'Applicant withdrawn',
  SeatReleased = 'Seat released',
  TransferRequestRaised = 'Transfer request raised',
}

/** The fields a branch can test and an update-status node can set.
 *
 *  There is no generic `Payment status`: "payment is pending" cannot say
 *  *which* fee, and the answer changes what you say to the family (→ D-31).
 *  The three `… overdue` fields hold a number of days rather than a status,
 *  which is what the numeric operators compare against (→ D-33). */
export enum AdmissionField {
  ApplicationStatus = 'Application status',
  DocumentStatus = 'Document status',
  InterviewStatus = 'Interview status',
  Decision = 'Decision',
  OfferStatus = 'Offer status',
  EnrolmentStatus = 'Enrolment status',
  IntakeStatus = 'Intake status',
  RegistrationFeeStatus = 'Registration fee status',
  TokenFeeStatus = 'Token fee status',
  AdmissionFeeStatus = 'Admission fee status',
  TermFeeStatus = 'Term fee status',
  RegistrationFeeOverdue = 'Registration fee overdue',
  AdmissionFeeOverdue = 'Admission fee overdue',
  TermFeeOverdue = 'Term fee overdue',
  RefundStatus = 'Refund status',
  FeeConcession = 'Fee concession',
  ConcessionStatus = 'Concession status',
  DuesStatus = 'Dues status',
  SeatAvailability = 'Seat availability',
  TransferStatus = 'Transfer status',
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

/** One shape for every named fee. *Not applicable* is what lets a school
 *  switch a checkpoint off without deleting the workflow (→ D-31). */
export enum FeeStatus {
  NotApplicable = 'Not applicable',
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Overdue = 'Overdue',
}

export enum RefundStatus {
  NotApplicable = 'Not applicable',
  Due = 'Due',
  Processed = 'Processed',
}

/** Guards the waitlist promotion. *Closed* means the confirmation deadline for
 *  the session has passed (→ D-29). */
export enum IntakeStatus {
  Open = 'Open',
  Full = 'Full',
  Closed = 'Closed',
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

/** *Provisional* means the seat is held but not yet the family's; *Confirmed*
 *  means registered, which happens only after the gating fee is paid;
 *  *Lapsed* means they backed out and the seat is free again (→ D-27). */
export enum EnrolmentStatus {
  Pending = 'Pending',
  Provisional = 'Provisional',
  Confirmed = 'Confirmed',
  Lapsed = 'Lapsed',
  Withdrawn = 'Withdrawn',
}

/** What a family claimed, not what the workflow decided (→ D-26). */
export enum FeeConcession {
  None = 'None',
  MeritScholarship = 'Merit scholarship',
  MeritCumNeed = 'Merit-cum-need',
  NeedBased = 'Need-based aid',
  FacultyFamily = 'Faculty family',
  Sibling = 'Sibling',
  SpecialAllowance = 'Special allowance',
}

export enum ConcessionStatus {
  NotClaimed = 'Not claimed',
  Requested = 'Requested',
  DocumentsPending = 'Documents pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
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
  | FeeStatus
  | RefundStatus
  | IntakeStatus
  | DuesStatus
  | SeatAvailability
  | TransferStatus
  | OfferStatus
  | EnrolmentStatus
  | FeeConcession
  | ConcessionStatus
  | House

/* ---- node parameter vocabularies ---------------------------------------- */

/** The first four compare a status against its own closed list. `more than`
 *  and `less than` compare a number of days, and the editor offers them only
 *  on the overdue fields (→ D-33). */
export enum Operator {
  Equals = '=',
  IsNot = 'is not',
  IsEmpty = 'is empty',
  IsNotEmpty = 'is not empty',
  MoreThan = 'more than',
  LessThan = 'less than',
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

/* ---- the fee-adjustment vocabulary (→ D-25, D-37) ------------------------ */

/** One node, two arithmetics: a concession reduces what is owed, a credit
 *  deducts money the school already has. */
export enum AdjustKind {
  Concession = 'Concession',
  Credit = 'Credit',
}

/** What a credit is credited *from*. Only fees a family pays up front and that
 *  come off a later bill. */
export enum CreditSource {
  TokenFee = 'Token fee',
  RegistrationFee = 'Registration fee',
}

/** The fee head an adjustment applies to. **Token fee is deliberately absent:**
 *  a commitment device that can be discounted is not a commitment, and the rule
 *  is only real if the product enforces it (→ D-35). */
export enum FeeHead {
  TotalPayable = 'Total payable',
  AdmissionFee = 'Admission fee',
  TermFee = 'Term fee',
  TransportFee = 'Transport fee',
}

/** Merit awards are proportional; a discretionary allowance is usually a
 *  negotiated figure. Supporting only one forces schools to fake the other. */
export enum AdjustBasis {
  Percentage = 'A percentage',
  Amount = 'A fixed amount',
}

/** Most schools grant per year; a concession that silently persists across
 *  years is an audit problem. */
export enum AdjustValidity {
  ThisYear = 'This academic year',
  UntilWithdrawn = 'Until withdrawn',
}
