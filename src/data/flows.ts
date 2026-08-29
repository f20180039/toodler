import {
  AcademicYear,
  AdjustBasis,
  AdjustKind,
  AdjustValidity,
  AdmissionField,
  AllocateMethod,
  AllocateTarget,
  ApplicationStatus,
  ConcessionStatus,
  CreditSource,
  DecisionOutcome,
  DocumentStatus,
  DuesStatus,
  EnrolmentStatus,
  FeeConcession,
  FeeHead,
  FeeStatus,
  Grade,
  IntakeStatus,
  InterviewStatus,
  NotifyChannel,
  NotifyPriority,
  OfferStatus,
  Operator,
  ReentryRule,
  RefundStatus,
  Role,
  SeatAvailability,
  TaskPriority,
  TransferStatus,
  TriggerEvent,
  WorkflowStage,
  WorkflowState,
} from '../types/admissions'
import { DelayMode, DelayUnit, NodeKind, type Flow, type FlowNode } from '../types/flow'

const retry = { enabled: true, attempts: 2, intervalHours: 24 }
const noRetry = { enabled: false, attempts: 1, intervalHours: 6 }

/** Every step below this one runs — all of them, not one of them.
 *
 *  A fan-out has to say which it means, so it is always a Parallel or a Branch
 *  and never an ordinary node that happens to have two children. */
const parallel = (id: string, title: string, children: FlowNode[]): FlowNode => ({
  id,
  kind: NodeKind.Parallel,
  title,
  params: {},
  children,
})

/** One complete diagram per stage of the admission journey. Every path ends
 *  somewhere deliberate - either an End node or a task a human picks up -
 *  because a path that just stops is how families fall through the cracks. */
export const flows: Flow[] = [
  /* ---------------------------------------------------------------- Enquiry */
  {
    id: 'enquiry',
    stage: WorkflowStage.Enquiry,
    name: 'New enquiry follow-up',
    state: WorkflowState.Active,
    root: {
      id: 'e-trigger',
      kind: NodeKind.Trigger,
      title: 'Enquiry submitted',
      params: { event: TriggerEvent.EnquirySubmitted, grade: Grade.AllGrades, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
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
    state: WorkflowState.Active,
    root: {
      id: 'a-trigger',
      kind: NodeKind.Trigger,
      title: 'Application submitted',
      params: { event: TriggerEvent.ApplicationSubmitted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
      children: [
        parallel('a-parallel', 'The family and the school, at once', [
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
              ]),
      ],
    },
  },


  /* ------------------------------------- Application · the fee some schools
     take before any decision. GIIS states the registration fee "has to be paid
     while submitting the admission form"; a school that takes no fee here
     leaves the status Not applicable and the flow ends on its first branch,
     which is what "configurable checkpoint" means in practice (-> D-30). */
  {
    id: 'registration-fee',
    stage: WorkflowStage.Application,
    name: 'Registration fee at submission',
    state: WorkflowState.Active,
    root: {
      id: 'rf-trigger',
      kind: NodeKind.Trigger,
      title: 'Application submitted',
      params: { event: TriggerEvent.ApplicationSubmitted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
      children: [
        {
          id: 'rf-branch-due',
          kind: NodeKind.Branch,
          title: 'Is a registration fee due?',
          params: { field: AdmissionField.RegistrationFeeStatus },
          children: [
            {
              id: 'rf-end-none',
              kind: NodeKind.End,
              title: 'End',
              pathLabel: 'Not applicable',
              pathCondition: { operator: Operator.Equals, value: FeeStatus.NotApplicable },
              params: {},
              children: [],
            },
            {
              id: 'rf-email-link',
              kind: NodeKind.Email,
              title: 'Send the fee link',
              pathLabel: 'Pending',
              pathCondition: { operator: Operator.Equals, value: '' },
              params: {
                recipient: Role.Parent,
                subject: 'Registration fee for your application to Grade 6',
                sender: Role.FinanceTeam,
                retry,
              },
              children: [
                {
                  id: 'rf-delay',
                  kind: NodeKind.Delay,
                  title: 'Wait for the fee',
                  params: {
                    mode: DelayMode.UntilEvent,
                    amount: 3,
                    unit: DelayUnit.Days,
                    excludeWeekends: true,
                    event: TriggerEvent.PaymentReceived,
                    maxWaitDays: 3,
                    date: '',
                  },
                  children: [
                    {
                      id: 'rf-branch-outcome',
                      kind: NodeKind.Branch,
                      title: 'Where did the fee get to?',
                      params: { field: AdmissionField.RegistrationFeeStatus },
                      children: [
                        {
                          id: 'rf-status-review',
                          kind: NodeKind.Status,
                          title: 'Send it for review',
                          pathLabel: 'Paid',
                          pathCondition: { operator: Operator.Equals, value: FeeStatus.Paid },
                          params: {
                            field: AdmissionField.ApplicationStatus,
                            value: ApplicationStatus.UnderReview,
                          },
                          children: [
                            { id: 'rf-end-paid', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                          ],
                        },
                        {
                          /* A declined card is a family who tried. Escalating at
                             them as though they were ignoring the fee is what
                             makes software feel hostile (-> D-32). */
                          id: 'rf-email-failed',
                          kind: NodeKind.Email,
                          title: 'The payment did not go through',
                          pathLabel: 'Failed',
                          pathCondition: { operator: Operator.Equals, value: FeeStatus.Failed },
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your payment did not go through — try another method',
                            sender: Role.FinanceTeam,
                            retry,
                          },
                          children: [
                            {
                              id: 'rf-task-finance',
                              kind: NodeKind.Task,
                              title: 'Help the family pay',
                              params: {
                                assignee: Role.FinanceTeam,
                                priority: TaskPriority.Medium,
                                dueInDays: 1,
                              },
                              children: [],
                            },
                          ],
                        },
                        {
                          /* Three days late and thirty days late need different
                             responses, which an Overdue status alone cannot say
                             - hence the day count and the numeric operators
                             (-> D-33). */
                          id: 'rf-branch-late',
                          kind: NodeKind.Branch,
                          title: 'How late is it?',
                          pathLabel: 'Overdue',
                          pathCondition: { operator: Operator.Equals, value: '' },
                          params: { field: AdmissionField.RegistrationFeeOverdue },
                          children: [
                            {
                              id: 'rf-task-call',
                              kind: NodeKind.Task,
                              title: 'Call the parent, application on hold',
                              pathLabel: 'More than 3 days',
                              pathCondition: { operator: Operator.MoreThan, value: 3 },
                              params: {
                                assignee: Role.Counsellor,
                                priority: TaskPriority.High,
                                dueInDays: 1,
                              },
                              children: [],
                            },
                            {
                              id: 'rf-end-late',
                              kind: NodeKind.End,
                              title: 'End',
                              pathLabel: 'Not yet',
                              pathCondition: { operator: Operator.MoreThan, value: '' },
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
    state: WorkflowState.Active,
    root: {
      id: 'r-trigger',
      kind: NodeKind.Trigger,
      title: 'Documents submitted',
      params: { event: TriggerEvent.DocumentsSubmitted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
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
    state: WorkflowState.Active,
    root: {
      id: 'd-trigger',
      kind: NodeKind.Trigger,
      title: 'Application submitted',
      params: { event: TriggerEvent.ApplicationSubmitted, grade: Grade.AllGrades, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
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
    state: WorkflowState.Active,
    root: {
      id: 'dc-trigger',
      kind: NodeKind.Trigger,
      title: 'Interview completed',
      params: { event: TriggerEvent.InterviewCompleted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
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
                    parallel('dc-parallel', 'Tell the family and the head', [
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
                                  children: [
                                    {
                                      /* Expiring the offer is what releases the
                                         seat, and a released seat is the event
                                         the waitlist promotion runs on. The loop
                                         is the trigger, not a loop node (-> D-28). */
                                      id: 'dc-status-expire',
                                      kind: NodeKind.Status,
                                      title: 'Let the offer expire',
                                      params: {
                                        field: AdmissionField.OfferStatus,
                                        value: OfferStatus.Expired,
                                      },
                                      children: [
                                        {
                                          id: 'dc-end-expire',
                                          kind: NodeKind.End,
                                          title: 'End',
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
                                      ]),
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
    state: WorkflowState.Active,
    root: {
      id: 'i-trigger',
      kind: NodeKind.Trigger,
      title: 'Interview scheduled',
      params: { event: TriggerEvent.InterviewScheduled, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
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
            parallel('i-parallel', 'Remind the family, brief the panel', [
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
                      ]),
          ],
        },
      ],
    },
  },


  /* ---------------------------------------- Decision · backfilling a seat.
     The workflow that answers the actual goal: filling the seats before the
     confirmation deadline. The loop is the trigger, not a loop node - a
     declined promotion expires the offer, which releases the seat, which fires
     this workflow again for the next family (-> D-28). That is why its trigger
     is the one flow in the set set to re-enter every time (-> D-14). */
  {
    id: 'waitlist',
    stage: WorkflowStage.Decision,
    name: 'Waitlist promotion',
    state: WorkflowState.Draft,
    root: {
      id: 'wl-trigger',
      kind: NodeKind.Trigger,
      title: 'Seat released',
      params: { event: TriggerEvent.SeatReleased, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.EveryTime },
      children: [
        {
          /* Without the guard the workflow keeps calling families after the
             seats are full, or after the deadline when it can no longer honour
             an offer - both worse than doing nothing (-> D-29). */
          id: 'wl-branch-intake',
          kind: NodeKind.Branch,
          title: 'Is the intake still open?',
          params: { field: AdmissionField.IntakeStatus },
          children: [
            {
              id: 'wl-task-call',
              kind: NodeKind.Task,
              title: 'Call the next waitlisted family',
              pathLabel: 'Open',
              pathCondition: { operator: Operator.Equals, value: IntakeStatus.Open },
              params: { assignee: Role.Counsellor, priority: TaskPriority.High, dueInDays: 1 },
              children: [
                {
                  id: 'wl-status-offer',
                  kind: NodeKind.Status,
                  title: 'Make the offer',
                  params: { field: AdmissionField.Decision, value: DecisionOutcome.Offered },
                  children: [
                    {
                      id: 'wl-email-offer',
                      kind: NodeKind.Email,
                      title: 'A seat has opened',
                      params: {
                        recipient: Role.Parent,
                        subject: 'A seat has opened — please confirm within 3 days',
                        sender: Role.AdmissionsTeam,
                        retry,
                      },
                      children: [
                        {
                          /* Three days, against seven at first offer: the closer
                             the deadline, the more a slow reply costs. */
                          id: 'wl-delay',
                          kind: NodeKind.Delay,
                          title: 'Offer valid for 3 days',
                          params: {
                            mode: DelayMode.Duration,
                            amount: 3,
                            unit: DelayUnit.Days,
                            excludeWeekends: true,
                            event: TriggerEvent.OfferAccepted,
                            maxWaitDays: 3,
                            date: '',
                          },
                          children: [
                            {
                              id: 'wl-branch-accept',
                              kind: NodeKind.Branch,
                              title: 'Was it accepted?',
                              params: { field: AdmissionField.OfferStatus },
                              children: [
                                {
                                  /* Workflow 8 takes over, so a promoted family
                                     pays the same token and clears the same
                                     checkpoints as everyone else. */
                                  id: 'wl-end-accepted',
                                  kind: NodeKind.End,
                                  title: 'End',
                                  pathLabel: 'Accepted',
                                  pathCondition: { operator: Operator.Equals, value: OfferStatus.Accepted },
                                  params: {},
                                  children: [],
                                },
                                {
                                  id: 'wl-status-expire',
                                  kind: NodeKind.Status,
                                  title: 'Let the offer expire',
                                  pathLabel: 'Not accepted',
                                  pathCondition: { operator: Operator.Equals, value: '' },
                                  params: { field: AdmissionField.OfferStatus, value: OfferStatus.Expired },
                                  children: [
                                    {
                                      id: 'wl-notify-again',
                                      kind: NodeKind.Notify,
                                      title: 'Seat released again',
                                      params: {
                                        recipient: Role.AdmissionsHead,
                                        channel: NotifyChannel.InAppAndEmail,
                                        priority: NotifyPriority.Urgent,
                                        retry: noRetry,
                                      },
                                      children: [
                                        { id: 'wl-end-expired', kind: NodeKind.End, title: 'End', params: {}, children: [] },
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
              ],
            },
            {
              id: 'wl-end-full',
              kind: NodeKind.End,
              title: 'End',
              pathLabel: 'Full',
              pathCondition: { operator: Operator.Equals, value: IntakeStatus.Full },
              params: {},
              children: [],
            },
            {
              id: 'wl-notify-closed',
              kind: NodeKind.Notify,
              title: 'Seat unfilled for this session',
              pathLabel: 'Closed — deadline passed',
              pathCondition: { operator: Operator.Equals, value: '' },
              params: {
                recipient: Role.AdmissionsHead,
                channel: NotifyChannel.InAppAndEmail,
                priority: NotifyPriority.Urgent,
                retry: noRetry,
              },
              children: [
                { id: 'wl-end-closed', kind: NodeKind.End, title: 'End', params: {}, children: [] },
              ],
            },
          ],
        },
      ],
    },
  },

  /* ----------------------------------------------------------- Registration */
  /* An accepted offer is an intention, not a commitment. A small, fixed,
     non-negotiable token converts one into the other: it prices the seat the
     school is holding, and it is credited back against the final bill. A
     discount on a commitment device destroys the commitment, which is why the
     Adjust fee node does not offer the token as a target (-> D-34, D-35). */
  {
    id: 'token-fee',
    stage: WorkflowStage.Registration,
    name: 'Token fee & seat hold',
    state: WorkflowState.Active,
    root: {
      id: 'tf-trigger',
      kind: NodeKind.Trigger,
      title: 'Offer accepted',
      params: { event: TriggerEvent.OfferAccepted, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
      children: [
        {
          id: 'tf-status-provisional',
          kind: NodeKind.Status,
          title: 'Hold the seat',
          params: { field: AdmissionField.EnrolmentStatus, value: EnrolmentStatus.Provisional },
          children: [
            {
              id: 'tf-email-hold',
              kind: NodeKind.Email,
              title: 'Hold your seat',
              params: {
                recipient: Role.Parent,
                subject: 'Hold your seat — token fee, adjusted against your final bill',
                sender: Role.AdmissionsTeam,
                retry,
              },
              children: [
                {
                  id: 'tf-delay',
                  kind: NodeKind.Delay,
                  title: 'Wait for the token',
                  params: {
                    mode: DelayMode.UntilEvent,
                    amount: 3,
                    unit: DelayUnit.Days,
                    excludeWeekends: true,
                    event: TriggerEvent.PaymentReceived,
                    maxWaitDays: 3,
                    date: '',
                  },
                  children: [
                    {
                      id: 'tf-branch',
                      kind: NodeKind.Branch,
                      title: 'Token fee?',
                      params: { field: AdmissionField.TokenFeeStatus },
                      children: [
                        {
                          /* Paying does two things at once: it holds the seat,
                             and it opens the window in which a family can ask
                             for a concession - which is why the confirmation
                             email says so explicitly (-> D-36). */
                          id: 'tf-status-window',
                          kind: NodeKind.Status,
                          title: 'Open the concession window',
                          pathLabel: 'Paid',
                          pathCondition: { operator: Operator.Equals, value: FeeStatus.Paid },
                          params: {
                            field: AdmissionField.ConcessionStatus,
                            value: ConcessionStatus.NotClaimed,
                          },
                          children: [
                            {
                              id: 'tf-email-held',
                              kind: NodeKind.Email,
                              title: 'Your seat is held',
                              params: {
                                recipient: Role.Parent,
                                subject: 'Your seat is held — apply for a concession before the final bill',
                                sender: Role.AdmissionsTeam,
                                retry,
                              },
                              children: [
                                { id: 'tf-end-paid', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'tf-email-failed',
                          kind: NodeKind.Email,
                          title: 'The payment did not go through',
                          pathLabel: 'Failed',
                          pathCondition: { operator: Operator.Equals, value: FeeStatus.Failed },
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your payment did not go through — try another method',
                            sender: Role.FinanceTeam,
                            retry,
                          },
                          children: [
                            {
                              id: 'tf-task-finance',
                              kind: NodeKind.Task,
                              title: 'Help the family pay',
                              params: {
                                assignee: Role.FinanceTeam,
                                priority: TaskPriority.Medium,
                                dueInDays: 1,
                              },
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'tf-email-final-call',
                          kind: NodeKind.Email,
                          title: 'Final call',
                          pathLabel: 'Pending',
                          pathCondition: { operator: Operator.Equals, value: '' },
                          params: {
                            recipient: Role.Parent,
                            subject: 'Final call — the seat is released after the deadline',
                            sender: Role.AdmissionsTeam,
                            retry,
                          },
                          children: [
                            {
                              id: 'tf-delay-2',
                              kind: NodeKind.Delay,
                              title: 'Two more days',
                              params: {
                                mode: DelayMode.Duration,
                                amount: 2,
                                unit: DelayUnit.Days,
                                excludeWeekends: true,
                                event: TriggerEvent.PaymentReceived,
                                maxWaitDays: 2,
                                date: '',
                              },
                              children: [
                                {
                                  id: 'tf-branch-2',
                                  kind: NodeKind.Branch,
                                  title: 'Paid now?',
                                  params: { field: AdmissionField.TokenFeeStatus },
                                  children: [
                                    {
                                      id: 'tf-end-late-paid',
                                      kind: NodeKind.End,
                                      title: 'End',
                                      pathLabel: 'Paid',
                                      pathCondition: { operator: Operator.Equals, value: FeeStatus.Paid },
                                      params: {},
                                      children: [],
                                    },
                                    {
                                      /* Nothing was allotted, so unpicking a
                                         lapse costs nothing (-> D-27). */
                                      id: 'tf-status-lapsed',
                                      kind: NodeKind.Status,
                                      title: 'Let the hold lapse',
                                      pathLabel: 'Pending',
                                      pathCondition: { operator: Operator.Equals, value: '' },
                                      params: {
                                        field: AdmissionField.EnrolmentStatus,
                                        value: EnrolmentStatus.Lapsed,
                                      },
                                      children: [
                                        {
                                          id: 'tf-notify-released',
                                          kind: NodeKind.Notify,
                                          title: 'Seat released',
                                          params: {
                                            recipient: Role.AdmissionsHead,
                                            channel: NotifyChannel.InAppAndEmail,
                                            priority: NotifyPriority.Urgent,
                                            retry: noRetry,
                                          },
                                          children: [
                                            { id: 'tf-end-lapsed', kind: NodeKind.End, title: 'End', params: {}, children: [] },
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
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  /* ------------------------------------------ Registration · the real number.
     Concession decided fires whether or not anyone asked: when no concession was
     claimed it fires as soon as the token clears, so a family who wants no
     discount is not left waiting for a decision nobody was going to make
     (-> D-36). The token arrives here as a credit, not a discount - the same
     Adjust fee node, a different arithmetic (-> D-37). */
  {
    id: 'final-bill',
    stage: WorkflowStage.Registration,
    name: 'Final bill & payment',
    state: WorkflowState.Active,
    root: {
      id: 'fb-trigger',
      kind: NodeKind.Trigger,
      title: 'Concession decided',
      params: { event: TriggerEvent.ConcessionDecided, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
      children: [
        {
          id: 'fb-credit',
          kind: NodeKind.AdjustFee,
          title: 'Credit the token already paid',
          params: {
            kind: AdjustKind.Credit,
            concession: FeeConcession.None,
            creditFrom: CreditSource.TokenFee,
            appliesTo: FeeHead.TotalPayable,
            basis: AdjustBasis.Amount,
            value: 0,
            approvalRequired: false,
            approver: '',
            validity: AdjustValidity.ThisYear,
          },
          children: [
            {
              id: 'fb-email-bill',
              kind: NodeKind.Email,
              title: 'Your final bill',
              params: {
                recipient: Role.Parent,
                subject: 'Your final bill — admission and term fees, less the token',
                sender: Role.FinanceTeam,
                retry,
              },
              children: [
                {
                  id: 'fb-delay',
                  kind: NodeKind.Delay,
                  title: 'Wait for the payment',
                  params: {
                    mode: DelayMode.UntilEvent,
                    amount: 7,
                    unit: DelayUnit.Days,
                    excludeWeekends: true,
                    event: TriggerEvent.PaymentReceived,
                    maxWaitDays: 7,
                    date: '',
                  },
                  children: [
                    {
                      id: 'fb-branch',
                      kind: NodeKind.Branch,
                      title: 'Final bill?',
                      params: { field: AdmissionField.AdmissionFeeStatus },
                      children: [
                        {
                          /* Workflow 10 registers the student off the same
                             Payment received event. */
                          id: 'fb-end-paid',
                          kind: NodeKind.End,
                          title: 'End',
                          pathLabel: 'Paid',
                          pathCondition: { operator: Operator.Equals, value: FeeStatus.Paid },
                          params: {},
                          children: [],
                        },
                        {
                          id: 'fb-email-failed',
                          kind: NodeKind.Email,
                          title: 'Try another method',
                          pathLabel: 'Failed',
                          pathCondition: { operator: Operator.Equals, value: FeeStatus.Failed },
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your payment did not go through — try another method',
                            sender: Role.FinanceTeam,
                            retry,
                          },
                          children: [
                            {
                              id: 'fb-task-finance',
                              kind: NodeKind.Task,
                              title: 'Help the family pay',
                              params: {
                                assignee: Role.FinanceTeam,
                                priority: TaskPriority.Medium,
                                dueInDays: 1,
                              },
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 'fb-branch-late',
                          kind: NodeKind.Branch,
                          title: 'How late is it?',
                          pathLabel: 'Overdue',
                          pathCondition: { operator: Operator.Equals, value: '' },
                          params: { field: AdmissionField.AdmissionFeeOverdue },
                          children: [
                            {
                              id: 'fb-task-call',
                              kind: NodeKind.Task,
                              title: 'Counsellor to call',
                              pathLabel: 'More than 2 days',
                              pathCondition: { operator: Operator.MoreThan, value: 2 },
                              params: {
                                assignee: Role.Counsellor,
                                priority: TaskPriority.High,
                                dueInDays: 1,
                              },
                              children: [
                                {
                                  id: 'fb-branch-after-call',
                                  kind: NodeKind.Branch,
                                  title: 'Paid now?',
                                  params: { field: AdmissionField.AdmissionFeeStatus },
                                  children: [
                                    {
                                      id: 'fb-end-late-paid',
                                      kind: NodeKind.End,
                                      title: 'End',
                                      pathLabel: 'Paid',
                                      pathCondition: { operator: Operator.Equals, value: FeeStatus.Paid },
                                      params: {},
                                      children: [],
                                    },
                                    {
                                      id: 'fb-status-lapsed',
                                      kind: NodeKind.Status,
                                      title: 'Let the hold lapse',
                                      pathLabel: 'Pending',
                                      pathCondition: { operator: Operator.Equals, value: '' },
                                      params: {
                                        field: AdmissionField.EnrolmentStatus,
                                        value: EnrolmentStatus.Lapsed,
                                      },
                                      children: [
                                        {
                                          id: 'fb-notify-released',
                                          kind: NodeKind.Notify,
                                          title: 'Seat released',
                                          params: {
                                            recipient: Role.AdmissionsHead,
                                            channel: NotifyChannel.InAppAndEmail,
                                            priority: NotifyPriority.Urgent,
                                            retry: noRetry,
                                          },
                                          children: [
                                            { id: 'fb-end-lapsed', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              id: 'fb-end-not-late',
                              kind: NodeKind.End,
                              title: 'End',
                              pathLabel: 'Not yet',
                              pathCondition: { operator: Operator.MoreThan, value: '' },
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
          ],
        },
      ],
    },
  },

  /* -------------------------------------------------------------- Enrolment */
  /* Registration *is* the move to Confirmed, and it happens here rather than at
     acceptance: a class section and a house allotted to a family who has not
     paid is a seat the school cannot offer anyone else (-> D-27). */
  {
    id: 'enrolment',
    stage: WorkflowStage.Enrolment,
    name: 'Enrolment & allocation',
    state: WorkflowState.Active,
    root: {
      id: 'en-trigger',
      kind: NodeKind.Trigger,
      title: 'Payment received',
      params: { event: TriggerEvent.PaymentReceived, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
      children: [
        {
          /* Any fee payment fires the trigger, so the first thing to establish
             is which one arrived. A token is workflow 8's business and a term
             fee is workflow 12's. */
          id: 'en-branch-fee',
          kind: NodeKind.Branch,
          title: 'Which fee arrived?',
          params: { field: AdmissionField.AdmissionFeeStatus },
          children: [
            {
              id: 'en-status',
              kind: NodeKind.Status,
              title: 'Register the student',
              pathLabel: 'Paid',
              pathCondition: { operator: Operator.Equals, value: FeeStatus.Paid },
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
                        parallel('en-parallel', 'Tell the family, the teacher and the house', [
                        {
                          id: 'en-email-joining',
                          kind: NodeKind.Email,
                          title: 'Class, house and joining details',
                          params: {
                            recipient: Role.Parent,
                            subject: 'Registered — your class, house and joining details',
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
                                              ]),
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'en-end-other',
              kind: NodeKind.End,
              title: 'End',
              pathLabel: 'Anything else',
              pathCondition: { operator: Operator.Equals, value: '' },
              params: {},
              children: [],
            },
          ],
        },
      ],
    },
  },

  /* ------------------------------------------ Enrolment · the other half of
     the token's bargain: the school keeps the token and returns everything
     else. It is a *task* for finance, not an automated payout - moving money
     out is the one action where a wrong automation is unrecoverable, and in a
     prototype that executes nothing an automated refund would be the most
     dangerous fake in it (-> D-38). */
  {
    id: 'withdrawal',
    stage: WorkflowStage.Enrolment,
    name: 'Withdrawal & refund',
    state: WorkflowState.Draft,
    root: {
      id: 'wd-trigger',
      kind: NodeKind.Trigger,
      title: 'Applicant withdrawn',
      params: { event: TriggerEvent.ApplicantWithdrawn, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
      children: [
        {
          id: 'wd-status',
          kind: NodeKind.Status,
          title: 'Record the withdrawal',
          params: { field: AdmissionField.EnrolmentStatus, value: EnrolmentStatus.Withdrawn },
          children: [
            {
              id: 'wd-branch',
              kind: NodeKind.Branch,
              title: 'What has been paid?',
              params: { field: AdmissionField.AdmissionFeeStatus },
              children: [
                {
                  id: 'wd-status-refund',
                  kind: NodeKind.Status,
                  title: 'Mark the refund due',
                  pathLabel: 'Paid',
                  pathCondition: { operator: Operator.Equals, value: FeeStatus.Paid },
                  params: { field: AdmissionField.RefundStatus, value: RefundStatus.Due },
                  children: [
                    {
                      id: 'wd-task-refund',
                      kind: NodeKind.Task,
                      title: 'Refund the balance, retain the token',
                      params: {
                        assignee: Role.FinanceTeam,
                        priority: TaskPriority.High,
                        dueInDays: 3,
                      },
                      children: [
                        {
                          id: 'wd-email-breakdown',
                          kind: NodeKind.Email,
                          title: 'The refund breakdown',
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your withdrawal and refund — the breakdown',
                            sender: Role.FinanceTeam,
                            retry,
                          },
                          children: [
                            {
                              /* Both paths end in this notification, which is
                                 what pulls the next waitlisted family in
                                 (-> D-28). */
                              id: 'wd-notify-released',
                              kind: NodeKind.Notify,
                              title: 'Seat released',
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
                {
                  id: 'wd-email-confirm',
                  kind: NodeKind.Email,
                  title: 'Withdrawal confirmed',
                  pathLabel: 'Anything else',
                  pathCondition: { operator: Operator.Equals, value: '' },
                  params: {
                    recipient: Role.Parent,
                    subject: 'Your withdrawal is confirmed — the token is retained',
                    sender: Role.AdmissionsTeam,
                    retry,
                  },
                  children: [
                    {
                      id: 'wd-notify-released-2',
                      kind: NodeKind.Notify,
                      title: 'Seat released',
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
  },

  /* ---------------------------------------------------------------- Payment */
  {
    id: 'payment',
    stage: WorkflowStage.Payment,
    name: 'Term fee reminder',
    state: WorkflowState.Paused,
    root: {
      id: 'p-trigger',
      kind: NodeKind.Trigger,
      title: 'Applicant enrolled',
      params: { event: TriggerEvent.ApplicantEnrolled, grade: Grade.AllGrades, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
      children: [
        {
          id: 'p-email-instructions',
          kind: NodeKind.Email,
          title: 'Payment instructions',
          params: {
            recipient: Role.Parent,
            subject: 'Term fees for Grade 6 · 2026–27',
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
                  params: { field: AdmissionField.TermFeeStatus },
                  children: [
                    {
                      id: 'p-email-reminder',
                      kind: NodeKind.Email,
                      title: 'Payment reminder',
                      pathLabel: 'Yes',
                      pathCondition: { operator: Operator.Equals, value: FeeStatus.Pending },
                      params: {
                        recipient: Role.Parent,
                        subject: 'Term fee payment is still pending',
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
                              params: { field: AdmissionField.TermFeeStatus },
                              children: [
                                {
                                  id: 'p-task',
                                  kind: NodeKind.Task,
                                  title: 'Finance follow-up call',
                                  pathLabel: 'Yes',
                                  pathCondition: { operator: Operator.Equals, value: FeeStatus.Pending },
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

  /* ---------------------------------------- Payment · fee concessions.
     The window opens when the token clears and closes when the final bill is
     raised, so this runs between workflows 8 and 9 and ends by firing
     *Concession decided* (-> D-36). The categories are separate paths rather
     than one "discount" step because each needs a different amount of human
     judgement: merit-cum-need collects documents first, a faculty concession
     needs no evidence at all, and a special allowance is a person's decision
     (-> D-26). The token is not a valid target, and the node does not offer it
     (-> D-35). */
  {
    id: 'concession',
    stage: WorkflowStage.Payment,
    name: 'Concession application & assessment',
    state: WorkflowState.Draft,
    root: {
      id: 'cn-trigger',
      kind: NodeKind.Trigger,
      title: 'Concession requested',
      params: { event: TriggerEvent.ConcessionRequested, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.OncePerYear },
      children: [
        {
          id: 'cn-branch',
          kind: NodeKind.Branch,
          title: 'What concession is claimed?',
          params: { field: AdmissionField.FeeConcession },
          children: [
            {
              id: 'cn-task-verify',
              kind: NodeKind.Task,
              title: 'Verify the income documents',
              pathLabel: 'Merit-cum-need',
              pathCondition: { operator: Operator.Equals, value: FeeConcession.MeritCumNeed },
              params: { assignee: Role.FinanceTeam, priority: TaskPriority.High, dueInDays: 3 },
              children: [
                {
                  id: 'cn-adjust-mcn',
                  kind: NodeKind.AdjustFee,
                  title: 'Apply the merit-cum-need award',
                  params: {
                    kind: AdjustKind.Concession,
                    concession: FeeConcession.MeritCumNeed,
                    creditFrom: CreditSource.TokenFee,
                    appliesTo: FeeHead.AdmissionFee,
                    basis: AdjustBasis.Percentage,
                    value: 40,
                    approvalRequired: true,
                    approver: Role.Principal,
                    validity: AdjustValidity.ThisYear,
                  },
                  children: [
                    {
                      id: 'cn-status-mcn',
                      kind: NodeKind.Status,
                      title: 'Record the decision',
                      params: {
                        field: AdmissionField.ConcessionStatus,
                        value: ConcessionStatus.Approved,
                      },
                      children: [
                        {
                          id: 'cn-email-mcn',
                          kind: NodeKind.Email,
                          title: 'Revised fee schedule',
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your revised fee schedule',
                            sender: Role.FinanceTeam,
                            retry,
                          },
                          children: [
                            { id: 'cn-end-mcn', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              /* The exception that proves the rule: a faculty concession needs
                 no evidence, so this path has no verification task. */
              id: 'cn-adjust-faculty',
              kind: NodeKind.AdjustFee,
              title: 'Apply the staff concession',
              pathLabel: 'Faculty family',
              pathCondition: { operator: Operator.Equals, value: FeeConcession.FacultyFamily },
              params: {
                kind: AdjustKind.Concession,
                concession: FeeConcession.FacultyFamily,
                creditFrom: CreditSource.TokenFee,
                appliesTo: FeeHead.TermFee,
                basis: AdjustBasis.Percentage,
                value: 50,
                approvalRequired: true,
                approver: Role.FinanceTeam,
                validity: AdjustValidity.UntilWithdrawn,
              },
              children: [
                {
                  id: 'cn-status-faculty',
                  kind: NodeKind.Status,
                  title: 'Record the decision',
                  params: {
                    field: AdmissionField.ConcessionStatus,
                    value: ConcessionStatus.Approved,
                  },
                  children: [
                    {
                      id: 'cn-email-faculty',
                      kind: NodeKind.Email,
                      title: 'Revised fee schedule',
                      params: {
                        recipient: Role.Parent,
                        subject: 'Your revised fee schedule',
                        sender: Role.FinanceTeam,
                        retry,
                      },
                      children: [
                        { id: 'cn-end-faculty', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'cn-task-discretion',
              kind: NodeKind.Task,
              title: "Head's discretion review",
              pathLabel: 'Special allowance',
              pathCondition: { operator: Operator.Equals, value: FeeConcession.SpecialAllowance },
              params: { assignee: Role.AdmissionsHead, priority: TaskPriority.Medium, dueInDays: 3 },
              children: [
                {
                  id: 'cn-adjust-special',
                  kind: NodeKind.AdjustFee,
                  title: 'Apply the allowance',
                  params: {
                    kind: AdjustKind.Concession,
                    concession: FeeConcession.SpecialAllowance,
                    creditFrom: CreditSource.TokenFee,
                    appliesTo: FeeHead.AdmissionFee,
                    basis: AdjustBasis.Amount,
                    value: 25000,
                    approvalRequired: true,
                    approver: Role.Principal,
                    validity: AdjustValidity.ThisYear,
                  },
                  children: [
                    {
                      id: 'cn-status-special',
                      kind: NodeKind.Status,
                      title: 'Record the decision',
                      params: {
                        field: AdmissionField.ConcessionStatus,
                        value: ConcessionStatus.Approved,
                      },
                      children: [
                        {
                          id: 'cn-email-special',
                          kind: NodeKind.Email,
                          title: 'Revised fee schedule',
                          params: {
                            recipient: Role.Parent,
                            subject: 'Your revised fee schedule',
                            sender: Role.FinanceTeam,
                            retry,
                          },
                          children: [
                            { id: 'cn-end-special', kind: NodeKind.End, title: 'End', params: {}, children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              /* The final bill quotes the standard amount. */
              id: 'cn-end-none',
              kind: NodeKind.End,
              title: 'End',
              pathLabel: 'None',
              pathCondition: { operator: Operator.Equals, value: '' },
              params: {},
              children: [],
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
    state: WorkflowState.Active,
    root: {
      id: 't-trigger',
      kind: NodeKind.Trigger,
      title: 'Transfer request raised',
      params: { event: TriggerEvent.TransferRequestRaised, grade: Grade.Grade6, academicYear: AcademicYear.Y2026, reentry: ReentryRule.Once },
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
                        parallel('t-parallel', 'Confirm, move records, tell the destination', [
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
                                              ]),
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
