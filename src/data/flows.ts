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
  WorkflowStage,
} from '../types/admissions'
import { DelayMode, DelayUnit, NodeKind, type Flow } from '../types/flow'

const retry = { enabled: true, attempts: 2, intervalHours: 24 }
const noRetry = { enabled: false, attempts: 1, intervalHours: 6 }

/** One complete diagram per stage of the admission journey. Every path ends
 *  somewhere deliberate - either an End node or a task a human picks up -
 *  because a path that just stops is how families fall through the cracks. */
export const flows: Flow[] = [
  /* ---------------------------------------------------------------- Enquiry */
  {
    id: 'enquiry',
    stage: WorkflowStage.Enquiry,
    name: 'New enquiry follow-up',
    root: {
      id: 'e-trigger',
      kind: NodeKind.Trigger,
      title: 'Enquiry submitted',
      params: { event: TriggerEvent.EnquirySubmitted, grade: Grade.AllGrades, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'e-email-intro',
          kind: NodeKind.Email,
          title: 'School introduction',
          params: {
            recipient: Role.Parent,
            subject: 'Welcome to Greenwood International',
            sender: Role.AdmissionsTeam,
            retry,
          },
          children: [
            {
              id: 'e-delay-1',
              kind: NodeKind.Delay,
              title: 'Give them time',
              params: {
                mode: DelayMode.Duration,
                amount: 3,
                unit: DelayUnit.Days,
                excludeWeekends: true,
                event: TriggerEvent.ApplicationSubmitted,
                maxWaitDays: 5,
                date: '',
              },
              children: [
                {
                  id: 'e-branch',
                  kind: NodeKind.Branch,
                  title: 'Has an application arrived?',
                  params: { field: AdmissionField.ApplicationStatus },
                  children: [
                    {
                      id: 'e-end',
                      kind: NodeKind.End,
                      title: 'End',
                      pathLabel: 'Yes',
                      pathCondition: { operator: Operator.Equals, value: ApplicationStatus.Submitted },
                      params: {},
                      children: [],
                    },
                    {
                      id: 'e-email-reminder',
                      kind: NodeKind.Email,
                      title: 'Application reminder',
                      pathLabel: 'No',
                      params: {
                        recipient: Role.Parent,
                        subject: 'Ready to apply for Grade 6?',
                        sender: Role.Counsellor,
                        retry,
                      },
                      children: [
                        {
                          id: 'e-delay-2',
                          kind: NodeKind.Delay,
                          title: 'One more wait',
                          params: {
                            mode: DelayMode.Duration,
                            amount: 4,
                            unit: DelayUnit.Days,
                            excludeWeekends: true,
                            event: TriggerEvent.ApplicationSubmitted,
                            maxWaitDays: 5,
                            date: '',
                          },
                          children: [
                            {
                              id: 'e-task',
                              kind: NodeKind.Task,
                              title: 'Call the parent',
                              params: {
                                assignee: Role.Counsellor,
                                priority: TaskPriority.High,
                                dueInDays: 1,
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  /* ------------------------------------------------------------ Application */
  {
    id: 'application',
    stage: WorkflowStage.Application,
    name: 'Application acknowledgement',
    root: {
      id: 'a-trigger',
      kind: NodeKind.Trigger,
      title: 'Application submitted',
      params: { event: TriggerEvent.ApplicationSubmitted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'a-email-parent',
          kind: NodeKind.Email,
          title: 'Thank-you to the parent',
          params: {
            recipient: Role.Parent,
            subject: "We've received your application",
            sender: Role.AdmissionsTeam,
            retry,
          },
          children: [],
        },
        {
          id: 'a-email-official',
          kind: NodeKind.Email,
          title: 'Notify the school official',
          params: {
            recipient: Role.AdmissionsOfficer,
            subject: 'New application · Grade 6',
            sender: Role.AdmissionsTeam,
            retry: noRetry,
          },
          children: [
            {
              id: 'a-task-review',
              kind: NodeKind.Task,
              title: 'Review the application',
              params: { assignee: Role.AdmissionsOfficer, priority: TaskPriority.Medium, dueInDays: 2 },
              children: [
                {
                  id: 'a-status',
                  kind: NodeKind.Status,
                  title: 'Move to Under review',
                  params: { field: AdmissionField.ApplicationStatus, value: ApplicationStatus.UnderReview },
                  children: [
                    {
                      id: 'a-delay',
                      kind: NodeKind.Delay,
                      title: 'Give the team 2 days',
                      params: {
                        mode: DelayMode.Duration,
                        amount: 2,
                        unit: DelayUnit.Days,
                        excludeWeekends: true,
                        event: TriggerEvent.ApplicationSubmitted,
                        maxWaitDays: 5,
                        date: '',
                      },
                      children: [
                        {
                          id: 'a-branch',
                          kind: NodeKind.Branch,
                          title: 'Reviewed within 2 days?',
                          params: { field: AdmissionField.ApplicationStatus },
                          children: [
                            {
                              id: 'a-email-next',
                              kind: NodeKind.Email,
                              title: 'Next steps to the family',
                              pathLabel: 'Yes',
                              pathCondition: { operator: Operator.IsNot, value: ApplicationStatus.UnderReview },
                              params: {
                                recipient: Role.Parent,
                                subject: 'Your application is progressing',
                                sender: Role.AdmissionsTeam,
                                retry,
                              },
                              children: [],
                            },
                            {
                              id: 'a-notify',
                              kind: NodeKind.Notify,
                              title: 'Chase the admissions head',
                              pathLabel: 'No',
                              params: {
                                recipient: Role.AdmissionsHead,
                                channel: NotifyChannel.InAppAndEmail,
                                priority: NotifyPriority.Urgent,
                                retry: noRetry,
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },


  /* ----------------------------------------------------------------- Review */
  {
    id: 'review-shortlisting',
    stage: WorkflowStage.Review,
    name: 'Application review & shortlisting',
    root: {
      id: 'r-trigger',
      kind: NodeKind.Trigger,
      title: 'Documents submitted',
      params: { event: TriggerEvent.DocumentsSubmitted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'r-task-review',
          kind: NodeKind.Task,
          title: 'Review the application',
          params: { assignee: Role.AdmissionsOfficer, priority: TaskPriority.High, dueInDays: 2 },
          children: [
            {
              id: 'r-delay',
              kind: NodeKind.Delay,
              title: 'Give the reviewer 2 days',
              params: {
                mode: DelayMode.Duration,
                amount: 2,
                unit: DelayUnit.Days,
                excludeWeekends: true,
                event: TriggerEvent.DocumentsSubmitted,
                maxWaitDays: 5,
                date: '',
              },
              children: [
                {
                  id: 'r-branch',
                  kind: NodeKind.Branch,
                  title: 'What did the review conclude?',
                  params: { field: AdmissionField.ApplicationStatus },
                  children: [
                    {
                      id: 'r-status-short',
                      kind: NodeKind.Status,
                      title: 'Shortlist the applicant',
                      pathLabel: 'Shortlisted',
                      pathCondition: { operator: Operator.Equals, value: ApplicationStatus.Shortlisted },
                      params: { field: AdmissionField.ApplicationStatus, value: ApplicationStatus.Shortlisted },
                      children: [
                        {
                          id: 'r-email-invite',
                          kind: NodeKind.Email,
                          title: 'Invite to the interview',
                          params: {
                            recipient: Role.Parent,
                            subject: 'Next step: your interview slot',
                            sender: Role.AdmissionsTeam,
                            retry,
                          },
                          children: [
                            { id: 'r-end', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'r-task-second',
                      kind: NodeKind.Task,
                      title: 'Second reviewer to check',
                      pathLabel: 'Second look',
                      pathCondition: { operator: Operator.Equals, value: ApplicationStatus.NeedsSecondLook },
                      params: { assignee: Role.Principal, priority: TaskPriority.Medium, dueInDays: 2 },
                      children: [],
                    },
                    {
                      id: 'r-status-reject',
                      kind: NodeKind.Status,
                      title: 'Mark not eligible',
                      pathLabel: 'Not eligible',
                      pathCondition: { operator: Operator.Equals, value: '' },
                      params: { field: AdmissionField.ApplicationStatus, value: ApplicationStatus.Rejected },
                      children: [
                        {
                          id: 'r-email-regret',
                          kind: NodeKind.Email,
                          title: 'Regret email',
                          params: {
                            recipient: Role.Parent,
                            subject: 'About your application to Grade 6',
                            sender: Role.AdmissionsTeam,
                            retry,
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  /* --------------------------------------- Review · document verification */
  {
    id: 'documents',
    stage: WorkflowStage.Review,
    name: 'Missing documents reminder',
    root: {
      id: 'd-trigger',
      kind: NodeKind.Trigger,
      title: 'Application submitted',
      params: { event: TriggerEvent.ApplicationSubmitted, grade: Grade.AllGrades, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'd-branch-1',
          kind: NodeKind.Branch,
          title: 'Are the documents complete?',
          params: { field: AdmissionField.DocumentStatus },
          children: [
            {
              id: 'd-status',
              kind: NodeKind.Status,
              title: 'Send it for review',
              pathLabel: 'Yes',
              pathCondition: { operator: Operator.Equals, value: DocumentStatus.Complete },
              params: { field: AdmissionField.ApplicationStatus, value: ApplicationStatus.UnderReview },
              children: [
                { id: 'd-end-1', kind: NodeKind.End, title: 'End', params: {}, children: [] },
              ],
            },
            {
              id: 'd-email',
              kind: NodeKind.Email,
              title: 'Missing documents reminder',
              pathLabel: 'No',
              params: {
                recipient: Role.Parent,
                subject: 'Two documents are still pending',
                sender: Role.AdmissionsTeam,
                retry,
              },
              children: [
                {
                  id: 'd-delay',
                  kind: NodeKind.Delay,
                  title: 'Wait for the upload',
                  params: {
                    mode: DelayMode.UntilEvent,
                    amount: 3,
                    unit: DelayUnit.Days,
                    excludeWeekends: false,
                    event: TriggerEvent.DocumentsSubmitted,
                    maxWaitDays: 3,
                    date: '',
                  },
                  children: [
                    {
                      id: 'd-branch-2',
                      kind: NodeKind.Branch,
                      title: 'Have they arrived?',
                      params: { field: AdmissionField.DocumentStatus },
                      children: [
                        {
                          id: 'd-end-2',
                          kind: NodeKind.End,
                          title: 'End',
                          pathLabel: 'Yes',
                          pathCondition: { operator: Operator.Equals, value: DocumentStatus.Complete },
                          params: {},
                          children: [],
                        },
                        {
                          id: 'd-task',
                          kind: NodeKind.Task,
                          title: 'Call the parent',
                          pathLabel: 'No',
                          params: {
                            assignee: Role.Counsellor,
                            priority: TaskPriority.High,
                            dueInDays: 1,
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },


  /* --------------------------------------------------------------- Decision */
  {
    id: 'decision-offer',
    stage: WorkflowStage.Decision,
    name: 'Decision & offer',
    root: {
      id: 'dc-trigger',
      kind: NodeKind.Trigger,
      title: 'Interview completed',
      params: { event: TriggerEvent.InterviewCompleted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'dc-task-decide',
          kind: NodeKind.Task,
          title: 'Panel records the decision',
          params: { assignee: Role.InterviewPanel, priority: TaskPriority.High, dueInDays: 1 },
          children: [
            {
              id: 'dc-branch',
              kind: NodeKind.Branch,
              title: 'What did the panel decide?',
              params: { field: AdmissionField.Decision },
              children: [
                {
                  id: 'dc-status-offer',
                  kind: NodeKind.Status,
                  title: 'Record the offer',
                  pathLabel: 'Offered',
                  pathCondition: { operator: Operator.Equals, value: DecisionOutcome.Offered },
                  params: { field: AdmissionField.Decision, value: DecisionOutcome.Offered },
                  children: [
                    {
                      id: 'dc-email-offer',
                      kind: NodeKind.Email,
                      title: 'Offer letter',
                      params: {
                        recipient: Role.Parent,
                        subject: 'Your offer for Grade 6 · 2026–27',
                        sender: Role.Principal,
                        retry,
                      },
                      children: [
                        {
                          id: 'dc-delay-offer',
                          kind: NodeKind.Delay,
                          title: 'Offer valid for 7 days',
                          params: {
                            mode: DelayMode.Duration,
                            amount: 7,
                            unit: DelayUnit.Days,
                            excludeWeekends: true,
                            event: TriggerEvent.OfferAccepted,
                            maxWaitDays: 10,
                            date: '',
                          },
                          children: [
                            {
                              id: 'dc-branch-accept',
                              kind: NodeKind.Branch,
                              title: 'Was the offer accepted?',
                              params: { field: AdmissionField.OfferStatus },
                              children: [
                                {
                                  id: 'dc-end',
                                  kind: NodeKind.End,
                                  title: 'End',
                                  pathLabel: 'Yes',
                                  pathCondition: { operator: Operator.Equals, value: OfferStatus.Accepted },
                                  params: {},
                                  children: [],
                                },
                                {
                                  id: 'dc-task-lapse',
                                  kind: NodeKind.Task,
                                  title: 'Call before the offer lapses',
                                  pathLabel: 'No',
                                  pathCondition: { operator: Operator.Equals, value: '' },
                                  params: {
                                    assignee: Role.Counsellor,
                                    priority: TaskPriority.High,
                                    dueInDays: 1,
                                  },
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'dc-notify-head',
                      kind: NodeKind.Notify,
                      title: 'Offer issued',
                      params: {
                        recipient: Role.AdmissionsHead,
                        channel: NotifyChannel.InApp,
                        priority: NotifyPriority.Normal,
                        retry: noRetry,
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: 'dc-status-wait',
                  kind: NodeKind.Status,
                  title: 'Add to the waitlist',
                  pathLabel: 'Waitlisted',
                  pathCondition: { operator: Operator.Equals, value: DecisionOutcome.Waitlisted },
                  params: { field: AdmissionField.Decision, value: DecisionOutcome.Waitlisted },
                  children: [
                    {
                      id: 'dc-email-wait',
                      kind: NodeKind.Email,
                      title: 'Waitlist letter',
                      params: {
                        recipient: Role.Parent,
                        subject: 'You are on our waitlist for Grade 6',
                        sender: Role.AdmissionsTeam,
                        retry,
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: 'dc-status-reject',
                  kind: NodeKind.Status,
                  title: 'Record the outcome',
                  pathLabel: 'Not offered',
                  pathCondition: { operator: Operator.Equals, value: '' },
                  params: { field: AdmissionField.Decision, value: DecisionOutcome.Rejected },
                  children: [
                    {
                      id: 'dc-email-reject',
                      kind: NodeKind.Email,
                      title: 'Regret letter',
                      params: {
                        recipient: Role.Parent,
                        subject: 'About your application to Grade 6',
                        sender: Role.AdmissionsTeam,
                        retry,
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  /* ------------------------------------------ Decision · interview slot */
  {
    id: 'interview',
    stage: WorkflowStage.Decision,
    name: 'Interview reminder',
    root: {
      id: 'i-trigger',
      kind: NodeKind.Trigger,
      title: 'Interview scheduled',
      params: { event: TriggerEvent.InterviewScheduled, grade: Grade.Grade6, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'i-delay',
          kind: NodeKind.Delay,
          title: 'The day before',
          params: {
            mode: DelayMode.Duration,
            amount: 24,
            unit: DelayUnit.Hours,
            excludeWeekends: false,
            event: TriggerEvent.InterviewCompleted,
            maxWaitDays: 2,
            date: '',
          },
          children: [
            {
              id: 'i-email',
              kind: NodeKind.Email,
              title: 'Reminder to the family',
              params: {
                recipient: Role.Parent,
                subject: 'Your interview is tomorrow at 10:00',
                sender: Role.AdmissionsTeam,
                retry,
              },
              children: [
                {
                  id: 'i-branch',
                  kind: NodeKind.Branch,
                  title: 'Did they attend?',
                  params: { field: AdmissionField.InterviewStatus },
                  children: [
                    {
                      id: 'i-status',
                      kind: NodeKind.Status,
                      title: 'Ready for a decision',
                      pathLabel: 'Yes',
                      pathCondition: { operator: Operator.Equals, value: InterviewStatus.Completed },
                      params: { field: AdmissionField.InterviewStatus, value: InterviewStatus.Completed },
                      children: [
                        { id: 'i-end', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                      ],
                    },
                    {
                      id: 'i-task',
                      kind: NodeKind.Task,
                      title: 'Reschedule the interview',
                      pathLabel: 'No',
                      params: { assignee: Role.Counsellor, priority: TaskPriority.High, dueInDays: 1 },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'i-notify',
              kind: NodeKind.Notify,
              title: "Tomorrow's panel list",
              params: {
                recipient: Role.InterviewPanel,
                channel: NotifyChannel.InApp,
                priority: NotifyPriority.Normal,
                retry: noRetry,
              },
              children: [],
            },
          ],
        },
      ],
    },
  },


  /* -------------------------------------------------------------- Enrolment */
  {
    id: 'enrolment',
    stage: WorkflowStage.Enrolment,
    name: 'Enrolment confirmation',
    root: {
      id: 'en-trigger',
      kind: NodeKind.Trigger,
      title: 'Offer accepted',
      params: { event: TriggerEvent.OfferAccepted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'en-email-welcome',
          kind: NodeKind.Email,
          title: 'Welcome to the school',
          params: {
            recipient: Role.Parent,
            subject: 'Welcome to Greenwood International',
            sender: Role.Principal,
            retry,
          },
          children: [
            {
              id: 'en-status',
              kind: NodeKind.Status,
              title: 'Confirm the enrolment',
              params: { field: AdmissionField.EnrolmentStatus, value: EnrolmentStatus.Confirmed },
              children: [
                {
                  /* This used to be a spreadsheet job for the admissions
                     officer. Balancing is exactly what software should do. */
                  id: 'en-allocate-class',
                  kind: NodeKind.Allocate,
                  title: 'Allocate the class section',
                  params: {
                    target: AllocateTarget.ClassSection,
                    method: AllocateMethod.Balance,
                    options: ['A', 'B', 'C'],
                    value: '',
                  },
                  children: [
                    {
                      id: 'en-allocate-house',
                      kind: NodeKind.Allocate,
                      title: 'Allocate the house',
                      params: {
                        target: AllocateTarget.House,
                        method: AllocateMethod.MatchSibling,
                        options: ['Red', 'Yellow', 'Blue', 'Green'],
                        value: '',
                      },
                      children: [
                        {
                          id: 'en-email-joining',
                          kind: NodeKind.Email,
                          title: 'Class, house and joining details',
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your class, house, uniform list and fee payment',
                            sender: Role.AdmissionsTeam,
                            retry,
                          },
                          children: [
                            { id: 'en-end', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                          ],
                        },
                        {
                          id: 'en-notify-teacher',
                          kind: NodeKind.Notify,
                          title: 'Brief the class teacher',
                          params: {
                            recipient: Role.ClassTeacher,
                            channel: NotifyChannel.InApp,
                            priority: NotifyPriority.Normal,
                            retry: noRetry,
                          },
                          children: [],
                        },
                        {
                          id: 'en-notify-house',
                          kind: NodeKind.Notify,
                          title: 'Brief the house captain',
                          params: {
                            recipient: Role.HouseCaptain,
                            channel: NotifyChannel.InApp,
                            priority: NotifyPriority.Normal,
                            retry: noRetry,
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- Payment */
  {
    id: 'payment',
    stage: WorkflowStage.Payment,
    name: 'Payment reminder',
    root: {
      id: 'p-trigger',
      kind: NodeKind.Trigger,
      title: 'Applicant enrolled',
      params: { event: TriggerEvent.ApplicantEnrolled, grade: Grade.AllGrades, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 'p-email-instructions',
          kind: NodeKind.Email,
          title: 'Payment instructions',
          params: {
            recipient: Role.Parent,
            subject: 'Fee payment for Grade 6 · 2026–27',
            sender: Role.FinanceTeam,
            retry,
          },
          children: [
            {
              id: 'p-delay-1',
              kind: NodeKind.Delay,
              title: 'Wait for the payment',
              params: {
                mode: DelayMode.Duration,
                amount: 5,
                unit: DelayUnit.Days,
                excludeWeekends: true,
                event: TriggerEvent.PaymentReceived,
                maxWaitDays: 7,
                date: '',
              },
              children: [
                {
                  id: 'p-branch-1',
                  kind: NodeKind.Branch,
                  title: 'Is the fee still pending?',
                  params: { field: AdmissionField.PaymentStatus },
                  children: [
                    {
                      id: 'p-email-reminder',
                      kind: NodeKind.Email,
                      title: 'Payment reminder',
                      pathLabel: 'Yes',
                      pathCondition: { operator: Operator.Equals, value: PaymentStatus.Pending },
                      params: {
                        recipient: Role.Parent,
                        subject: 'Fee payment is still pending',
                        sender: Role.FinanceTeam,
                        retry,
                      },
                      children: [
                        {
                          id: 'p-delay-2',
                          kind: NodeKind.Delay,
                          title: 'Second wait',
                          params: {
                            mode: DelayMode.Duration,
                            amount: 3,
                            unit: DelayUnit.Days,
                            excludeWeekends: true,
                            event: TriggerEvent.PaymentReceived,
                            maxWaitDays: 5,
                            date: '',
                          },
                          children: [
                            {
                              id: 'p-branch-2',
                              kind: NodeKind.Branch,
                              title: 'Still pending?',
                              params: { field: AdmissionField.PaymentStatus },
                              children: [
                                {
                                  id: 'p-task',
                                  kind: NodeKind.Task,
                                  title: 'Finance follow-up call',
                                  pathLabel: 'Yes',
                                  pathCondition: { operator: Operator.Equals, value: PaymentStatus.Pending },
                                  params: {
                                    assignee: Role.FinanceTeam,
                                    priority: TaskPriority.High,
                                    dueInDays: 3,
                                  },
                                  children: [],
                                },
                                {
                                  id: 'p-end-2',
                                  kind: NodeKind.End,
                                  title: 'End',
                                  pathLabel: 'No',
                                  params: {},
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'p-end-1',
                      kind: NodeKind.End,
                      title: 'End',
                      pathLabel: 'No',
                      params: {},
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  /* -------------------------------------------------- Inter-branch transfer */
  /* Not an admissions-funnel flow: the applicant already belongs to the group
     and is moving between campuses. Same primitives, different goal - a clean
     handover rather than a conversion. It is also the clearest case for a
     branch with more than two paths. */
  {
    id: 'transfer',
    stage: WorkflowStage.Transfer,
    name: 'Inter-branch transfer request',
    root: {
      id: 't-trigger',
      kind: NodeKind.Trigger,
      title: 'Transfer request raised',
      params: { event: TriggerEvent.TransferRequestRaised, grade: Grade.Grade6, academicYear: AcademicYear.Y2026 },
      children: [
        {
          id: 't-branch-dues',
          kind: NodeKind.Branch,
          title: 'Are dues cleared at the current branch?',
          params: { field: AdmissionField.DuesStatus },
          children: [
            {
              id: 't-task-seat',
              kind: NodeKind.Task,
              title: 'Verify the seat at the destination',
              pathLabel: 'Cleared',
              pathCondition: { operator: Operator.Equals, value: DuesStatus.Cleared },
              params: {
                assignee: Role.DestinationOfficer,
                priority: TaskPriority.High,
                dueInDays: 2,
              },
              children: [
                {
                  id: 't-branch-seat',
                  kind: NodeKind.Branch,
                  title: 'Seat at the destination branch?',
                  params: { field: AdmissionField.SeatAvailability },
                  children: [
                    {
                      id: 't-status-approved',
                      kind: NodeKind.Status,
                      title: 'Approve the transfer',
                      pathLabel: 'Seat available',
                      pathCondition: { operator: Operator.Equals, value: SeatAvailability.Available },
                      params: { field: AdmissionField.TransferStatus, value: TransferStatus.Approved },
                      children: [
                        {
                          id: 't-email-confirm',
                          kind: NodeKind.Email,
                          title: 'Transfer confirmed',
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your transfer to Greenwood Primary is confirmed',
                            sender: Role.AdmissionsTeam,
                            retry,
                          },
                          children: [
                            {
                              id: 't-task-records',
                              kind: NodeKind.Task,
                              title: 'Move the student records across',
                              params: {
                                assignee: Role.RecordsTeam,
                                priority: TaskPriority.Medium,
                                dueInDays: 3,
                              },
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 't-notify-dest',
                          kind: NodeKind.Notify,
                          title: 'Brief the destination coordinator',
                          params: {
                            recipient: Role.DestinationCoordinator,
                            channel: NotifyChannel.InAppAndEmail,
                            priority: NotifyPriority.Normal,
                            retry: noRetry,
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 't-email-wait',
                      kind: NodeKind.Email,
                      title: 'Waitlisted at the destination',
                      pathLabel: 'Waitlisted',
                      pathCondition: { operator: Operator.Equals, value: SeatAvailability.Waitlist },
                      params: {
                        recipient: Role.Parent,
                        subject: 'You are on the waitlist at Greenwood Primary',
                        sender: Role.AdmissionsTeam,
                        retry,
                      },
                      children: [
                        {
                          id: 't-delay-wait',
                          kind: NodeKind.Delay,
                          title: 'Hold for a week',
                          params: {
                            mode: DelayMode.Duration,
                            amount: 7,
                            unit: DelayUnit.Days,
                            excludeWeekends: true,
                            event: TriggerEvent.PaymentReceived,
                            maxWaitDays: 14,
                            date: '',
                          },
                          children: [
                            {
                              id: 't-task-wait',
                              kind: NodeKind.Task,
                              title: 'Review the waitlist',
                              params: {
                                assignee: Role.DestinationOfficer,
                                priority: TaskPriority.Medium,
                                dueInDays: 2,
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 't-email-noseat',
                      kind: NodeKind.Email,
                      title: 'No seat this academic year',
                      pathLabel: 'No seat',
                      pathCondition: { operator: Operator.Equals, value: '' },
                      params: {
                        recipient: Role.Parent,
                        subject: 'We cannot offer a seat at Greenwood Primary this year',
                        sender: Role.AdmissionsTeam,
                        retry,
                      },
                      children: [
                        {
                          id: 't-task-counsel',
                          kind: NodeKind.Task,
                          title: 'Counsel the family on the options',
                          params: {
                            assignee: Role.Counsellor,
                            priority: TaskPriority.Medium,
                            dueInDays: 2,
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 't-email-dues',
              kind: NodeKind.Email,
              title: 'Dues must be cleared first',
              pathLabel: 'Pending',
              pathCondition: { operator: Operator.Equals, value: '' },
              params: {
                recipient: Role.Parent,
                subject: 'Pending dues are holding up the transfer',
                sender: Role.FinanceTeam,
                retry,
              },
              children: [
                {
                  id: 't-task-dues',
                  kind: NodeKind.Task,
                  title: 'Reconcile the dues',
                  params: { assignee: Role.FinanceTeam, priority: TaskPriority.High, dueInDays: 3 },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
]
