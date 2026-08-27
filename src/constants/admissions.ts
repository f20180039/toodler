/** Option lists for the configuration panel.
 *
 *  Components render these; they never declare them. Full-enum lists use
 *  `Object.values`, so adding an enum member is the only edit needed. Subsets
 *  (who can send an email, who can own a task) are spelled out, because the
 *  subset itself is a product decision worth reading. */

import type { DelayParams } from '../types/flow'
import {
  AcademicYear,
  AdmissionField,
  AllocateMethod,
  AllocateTarget,
  ApplicationStatus,
  DecisionOutcome,
  DocumentStatus,
  DuesStatus,
  EnrolmentStatus,
  Grade,
  House,
  InterviewStatus,
  NotifyChannel,
  NotifyPriority,
  OfferStatus,
  Operator,
  PaymentStatus,
  Role,
  SeatAvailability,
  TaskPriority,
  TransferStatus,
  TriggerEvent,
  type FieldValue,
} from '../types/admissions'

/* ---- trigger ------------------------------------------------------------ */

export const TRIGGER_EVENT_OPTIONS: readonly TriggerEvent[] = Object.values(TriggerEvent)
export const GRADE_OPTIONS: readonly Grade[] = Object.values(Grade)
export const ACADEMIC_YEAR_OPTIONS: readonly AcademicYear[] = Object.values(AcademicYear)

/* ---- people ------------------------------------------------------------- */

export const RECIPIENT_OPTIONS: readonly Role[] = [
  Role.Parent,
  Role.Applicant,
  Role.AdmissionsOfficer,
  Role.Counsellor,
  Role.ClassTeacher,
  Role.FinanceTeam,
  Role.AdmissionsTeam,
  Role.AdmissionsHead,
  Role.InterviewPanel,
  Role.DestinationCoordinator,
  Role.HouseCaptain,
]

/** Only mailboxes a school actually sends from. */
export const SENDER_OPTIONS: readonly Role[] = [
  Role.AdmissionsTeam,
  Role.Counsellor,
  Role.Principal,
  Role.FinanceTeam,
]

/** Only people and teams that can own a task through to completion. */
export const ASSIGNEE_OPTIONS: readonly Role[] = [
  Role.AdmissionsOfficer,
  Role.Counsellor,
  Role.AdmissionsTeam,
  Role.FinanceTeam,
  Role.DestinationOfficer,
  Role.RecordsTeam,
  Role.InterviewPanel,
  Role.Principal,
]

/* ---- delay -------------------------------------------------------------- */

export const DELAY_UNIT_OPTIONS: readonly DelayParams['unit'][] = ['minutes', 'hours', 'days']

/** Events a flow can sit and wait for, as opposed to start from. */
export const WAIT_EVENT_OPTIONS: readonly TriggerEvent[] = [
  TriggerEvent.DocumentsSubmitted,
  TriggerEvent.PaymentReceived,
  TriggerEvent.InterviewCompleted,
  TriggerEvent.ApplicationSubmitted,
]

/* ---- task and notification --------------------------------------------- */

export const TASK_PRIORITY_OPTIONS: readonly TaskPriority[] = Object.values(TaskPriority)
export const NOTIFY_CHANNEL_OPTIONS: readonly NotifyChannel[] = Object.values(NotifyChannel)
export const NOTIFY_PRIORITY_OPTIONS: readonly NotifyPriority[] = Object.values(NotifyPriority)

/* ---- fields, conditions and their values -------------------------------- */

export const ADMISSION_FIELD_OPTIONS: readonly AdmissionField[] = Object.values(AdmissionField)
export const OPERATOR_OPTIONS: readonly Operator[] = Object.values(Operator)

/** Picking a field narrows the values. This is the whole argument for
 *  admissions-native fields over generic CRM properties: the options can be
 *  right by default instead of being free text. */
export const FIELD_VALUES: Record<AdmissionField, readonly FieldValue[]> = {
  [AdmissionField.ApplicationStatus]: Object.values(ApplicationStatus),
  [AdmissionField.DocumentStatus]: Object.values(DocumentStatus),
  [AdmissionField.InterviewStatus]: Object.values(InterviewStatus),
  [AdmissionField.Decision]: Object.values(DecisionOutcome),
  [AdmissionField.PaymentStatus]: Object.values(PaymentStatus),
  [AdmissionField.DuesStatus]: Object.values(DuesStatus),
  [AdmissionField.SeatAvailability]: Object.values(SeatAvailability),
  [AdmissionField.TransferStatus]: Object.values(TransferStatus),
  [AdmissionField.OfferStatus]: Object.values(OfferStatus),
  [AdmissionField.EnrolmentStatus]: Object.values(EnrolmentStatus),
  [AdmissionField.House]: Object.values(House),
}

/** The values a field can take. Accepts a plain string because the flow model
 *  still types `field` as one; it narrows here in a single place. */
export function fieldValues(field: string): readonly FieldValue[] {
  return FIELD_VALUES[field as AdmissionField] ?? []
}

/* ---- allocation --------------------------------------------------------- */

export const ALLOCATE_TARGET_OPTIONS: readonly AllocateTarget[] = Object.values(AllocateTarget)
export const ALLOCATE_METHOD_OPTIONS: readonly AllocateMethod[] = Object.values(AllocateMethod)

export const DEFAULT_HOUSES: readonly House[] = Object.values(House)
export const DEFAULT_SECTIONS: readonly string[] = ['A', 'B', 'C']

/** The school's house colours, so the options read as houses rather than four
 *  arbitrary words. Not design tokens — they belong to the school, not the UI. */
export const HOUSE_COLOURS: Record<House, string> = {
  [House.Red]: '#dc2626',
  [House.Yellow]: '#eab308',
  [House.Blue]: '#2563eb',
  [House.Green]: '#16a34a',
}
