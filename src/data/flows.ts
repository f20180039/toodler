import type { Flow } from '../types/flow'

const retry = { enabled: true, attempts: 2, intervalHours: 24 }
const noRetry = { enabled: false, attempts: 1, intervalHours: 6 }

/** One complete diagram per stage of the admission journey. Every path ends
 *  somewhere deliberate - either an End node or a task a human picks up -
 *  because a path that just stops is how families fall through the cracks. */
export const flows: Flow[] = [
  /* ---------------------------------------------------------------- Enquiry */
  {
    id: 'enquiry',
    stage: 'Enquiry',
    name: 'New enquiry follow-up',
    root: {
      id: 'e-trigger',
      kind: 'trigger',
      title: 'Enquiry submitted',
      params: { event: 'Enquiry submitted', grade: 'All grades', academicYear: '2026–27' },
      children: [
        {
          id: 'e-email-intro',
          kind: 'email',
          title: 'School introduction',
          params: {
            recipient: 'Parent / Guardian',
            subject: 'Welcome to Greenwood International',
            sender: 'Admissions team',
            retry,
          },
          children: [
            {
              id: 'e-delay-1',
              kind: 'delay',
              title: 'Give them time',
              params: {
                mode: 'duration',
                amount: 3,
                unit: 'days',
                excludeWeekends: true,
                event: 'Application submitted',
                maxWaitDays: 5,
                date: '',
              },
              children: [
                {
                  id: 'e-branch',
                  kind: 'branch',
                  title: 'Has an application arrived?',
                  params: { field: 'Application status' },
                  children: [
                    {
                      id: 'e-end',
                      kind: 'end',
                      title: 'End',
                      pathLabel: 'Yes',
                      pathCondition: { operator: '=', value: 'Submitted' },
                      params: {},
                      children: [],
                    },
                    {
                      id: 'e-email-reminder',
                      kind: 'email',
                      title: 'Application reminder',
                      pathLabel: 'No',
                      params: {
                        recipient: 'Parent / Guardian',
                        subject: 'Ready to apply for Grade 6?',
                        sender: 'Assigned counsellor',
                        retry,
                      },
                      children: [
                        {
                          id: 'e-delay-2',
                          kind: 'delay',
                          title: 'One more wait',
                          params: {
                            mode: 'duration',
                            amount: 4,
                            unit: 'days',
                            excludeWeekends: true,
                            event: 'Application submitted',
                            maxWaitDays: 5,
                            date: '',
                          },
                          children: [
                            {
                              id: 'e-task',
                              kind: 'task',
                              title: 'Call the parent',
                              params: {
                                assignee: 'Assigned counsellor',
                                priority: 'High',
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
    stage: 'Application',
    name: 'Application acknowledgement',
    root: {
      id: 'a-trigger',
      kind: 'trigger',
      title: 'Application submitted',
      params: { event: 'Application submitted', grade: 'Grade 6', academicYear: '2026–27' },
      children: [
        {
          id: 'a-email-parent',
          kind: 'email',
          title: 'Thank-you to the parent',
          params: {
            recipient: 'Parent / Guardian',
            subject: "We've received your application",
            sender: 'Admissions team',
            retry,
          },
          children: [],
        },
        {
          id: 'a-email-official',
          kind: 'email',
          title: 'Notify the school official',
          params: {
            recipient: 'Admissions officer',
            subject: 'New application · Grade 6',
            sender: 'Admissions team',
            retry: noRetry,
          },
          children: [
            {
              id: 'a-task-review',
              kind: 'task',
              title: 'Review the application',
              params: { assignee: 'Admissions officer', priority: 'Medium', dueInDays: 2 },
              children: [
                {
                  id: 'a-status',
                  kind: 'status',
                  title: 'Move to Under review',
                  params: { field: 'Application status', value: 'Under review' },
                  children: [
                    {
                      id: 'a-delay',
                      kind: 'delay',
                      title: 'Give the team 2 days',
                      params: {
                        mode: 'duration',
                        amount: 2,
                        unit: 'days',
                        excludeWeekends: true,
                        event: 'Application submitted',
                        maxWaitDays: 5,
                        date: '',
                      },
                      children: [
                        {
                          id: 'a-branch',
                          kind: 'branch',
                          title: 'Reviewed within 2 days?',
                          params: { field: 'Application status' },
                          children: [
                            {
                              id: 'a-email-next',
                              kind: 'email',
                              title: 'Next steps to the family',
                              pathLabel: 'Yes',
                              pathCondition: { operator: 'is not', value: 'Under review' },
                              params: {
                                recipient: 'Parent / Guardian',
                                subject: 'Your application is progressing',
                                sender: 'Admissions team',
                                retry,
                              },
                              children: [],
                            },
                            {
                              id: 'a-notify',
                              kind: 'notify',
                              title: 'Chase the admissions head',
                              pathLabel: 'No',
                              params: {
                                recipient: 'Admissions head',
                                channel: 'In-app + email',
                                priority: 'Urgent',
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
    stage: 'Review',
    name: 'Application review & shortlisting',
    root: {
      id: 'r-trigger',
      kind: 'trigger',
      title: 'Documents submitted',
      params: { event: 'Documents submitted', grade: 'Grade 6', academicYear: '2026-27' },
      children: [
        {
          id: 'r-task-review',
          kind: 'task',
          title: 'Review the application',
          params: { assignee: 'Admissions officer', priority: 'High', dueInDays: 2 },
          children: [
            {
              id: 'r-delay',
              kind: 'delay',
              title: 'Give the reviewer 2 days',
              params: {
                mode: 'duration',
                amount: 2,
                unit: 'days',
                excludeWeekends: true,
                event: 'Documents submitted',
                maxWaitDays: 5,
                date: '',
              },
              children: [
                {
                  id: 'r-branch',
                  kind: 'branch',
                  title: 'What did the review conclude?',
                  params: { field: 'Application status' },
                  children: [
                    {
                      id: 'r-status-short',
                      kind: 'status',
                      title: 'Shortlist the applicant',
                      pathLabel: 'Shortlisted',
                      pathCondition: { operator: '=', value: 'Shortlisted' },
                      params: { field: 'Application status', value: 'Shortlisted' },
                      children: [
                        {
                          id: 'r-email-invite',
                          kind: 'email',
                          title: 'Invite to the interview',
                          params: {
                            recipient: 'Parent / Guardian',
                            subject: 'Next step: your interview slot',
                            sender: 'Admissions team',
                            retry,
                          },
                          children: [
                            { id: 'r-end', kind: 'end', title: 'End', params: {}, children: [] },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'r-task-second',
                      kind: 'task',
                      title: 'Second reviewer to check',
                      pathLabel: 'Second look',
                      pathCondition: { operator: '=', value: 'Needs a second look' },
                      params: { assignee: 'Principal', priority: 'Medium', dueInDays: 2 },
                      children: [],
                    },
                    {
                      id: 'r-status-reject',
                      kind: 'status',
                      title: 'Mark not eligible',
                      pathLabel: 'Not eligible',
                      pathCondition: { operator: '=', value: '' },
                      params: { field: 'Application status', value: 'Rejected' },
                      children: [
                        {
                          id: 'r-email-regret',
                          kind: 'email',
                          title: 'Regret email',
                          params: {
                            recipient: 'Parent / Guardian',
                            subject: 'About your application to Grade 6',
                            sender: 'Admissions team',
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
    stage: 'Review',
    name: 'Missing documents reminder',
    root: {
      id: 'd-trigger',
      kind: 'trigger',
      title: 'Application submitted',
      params: { event: 'Application submitted', grade: 'All grades', academicYear: '2026–27' },
      children: [
        {
          id: 'd-branch-1',
          kind: 'branch',
          title: 'Are the documents complete?',
          params: { field: 'Document status' },
          children: [
            {
              id: 'd-status',
              kind: 'status',
              title: 'Send it for review',
              pathLabel: 'Yes',
              pathCondition: { operator: '=', value: 'Complete' },
              params: { field: 'Application status', value: 'Under review' },
              children: [
                { id: 'd-end-1', kind: 'end', title: 'End', params: {}, children: [] },
              ],
            },
            {
              id: 'd-email',
              kind: 'email',
              title: 'Missing documents reminder',
              pathLabel: 'No',
              params: {
                recipient: 'Parent / Guardian',
                subject: 'Two documents are still pending',
                sender: 'Admissions team',
                retry,
              },
              children: [
                {
                  id: 'd-delay',
                  kind: 'delay',
                  title: 'Wait for the upload',
                  params: {
                    mode: 'until-event',
                    amount: 3,
                    unit: 'days',
                    excludeWeekends: false,
                    event: 'Documents submitted',
                    maxWaitDays: 3,
                    date: '',
                  },
                  children: [
                    {
                      id: 'd-branch-2',
                      kind: 'branch',
                      title: 'Have they arrived?',
                      params: { field: 'Document status' },
                      children: [
                        {
                          id: 'd-end-2',
                          kind: 'end',
                          title: 'End',
                          pathLabel: 'Yes',
                          pathCondition: { operator: '=', value: 'Complete' },
                          params: {},
                          children: [],
                        },
                        {
                          id: 'd-task',
                          kind: 'task',
                          title: 'Call the parent',
                          pathLabel: 'No',
                          params: {
                            assignee: 'Assigned counsellor',
                            priority: 'High',
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
    stage: 'Decision',
    name: 'Decision & offer',
    root: {
      id: 'dc-trigger',
      kind: 'trigger',
      title: 'Interview completed',
      params: { event: 'Interview completed', grade: 'Grade 6', academicYear: '2026-27' },
      children: [
        {
          id: 'dc-task-decide',
          kind: 'task',
          title: 'Panel records the decision',
          params: { assignee: 'Interview panel', priority: 'High', dueInDays: 1 },
          children: [
            {
              id: 'dc-branch',
              kind: 'branch',
              title: 'What did the panel decide?',
              params: { field: 'Decision' },
              children: [
                {
                  id: 'dc-status-offer',
                  kind: 'status',
                  title: 'Record the offer',
                  pathLabel: 'Offered',
                  pathCondition: { operator: '=', value: 'Offered' },
                  params: { field: 'Decision', value: 'Offered' },
                  children: [
                    {
                      id: 'dc-email-offer',
                      kind: 'email',
                      title: 'Offer letter',
                      params: {
                        recipient: 'Parent / Guardian',
                        subject: 'Your offer for Grade 6 · 2026-27',
                        sender: 'Principal',
                        retry,
                      },
                      children: [
                        {
                          id: 'dc-delay-offer',
                          kind: 'delay',
                          title: 'Offer valid for 7 days',
                          params: {
                            mode: 'duration',
                            amount: 7,
                            unit: 'days',
                            excludeWeekends: true,
                            event: 'Offer accepted',
                            maxWaitDays: 10,
                            date: '',
                          },
                          children: [
                            {
                              id: 'dc-branch-accept',
                              kind: 'branch',
                              title: 'Was the offer accepted?',
                              params: { field: 'Offer status' },
                              children: [
                                {
                                  id: 'dc-end',
                                  kind: 'end',
                                  title: 'End',
                                  pathLabel: 'Yes',
                                  pathCondition: { operator: '=', value: 'Accepted' },
                                  params: {},
                                  children: [],
                                },
                                {
                                  id: 'dc-task-lapse',
                                  kind: 'task',
                                  title: 'Call before the offer lapses',
                                  pathLabel: 'No',
                                  pathCondition: { operator: '=', value: '' },
                                  params: {
                                    assignee: 'Assigned counsellor',
                                    priority: 'High',
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
                      kind: 'notify',
                      title: 'Offer issued',
                      params: {
                        recipient: 'Admissions head',
                        channel: 'In-app',
                        priority: 'Normal',
                        retry: noRetry,
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: 'dc-status-wait',
                  kind: 'status',
                  title: 'Add to the waitlist',
                  pathLabel: 'Waitlisted',
                  pathCondition: { operator: '=', value: 'Waitlisted' },
                  params: { field: 'Decision', value: 'Waitlisted' },
                  children: [
                    {
                      id: 'dc-email-wait',
                      kind: 'email',
                      title: 'Waitlist letter',
                      params: {
                        recipient: 'Parent / Guardian',
                        subject: 'You are on our waitlist for Grade 6',
                        sender: 'Admissions team',
                        retry,
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: 'dc-status-reject',
                  kind: 'status',
                  title: 'Record the outcome',
                  pathLabel: 'Not offered',
                  pathCondition: { operator: '=', value: '' },
                  params: { field: 'Decision', value: 'Rejected' },
                  children: [
                    {
                      id: 'dc-email-reject',
                      kind: 'email',
                      title: 'Regret letter',
                      params: {
                        recipient: 'Parent / Guardian',
                        subject: 'About your application to Grade 6',
                        sender: 'Admissions team',
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
    stage: 'Decision',
    name: 'Interview reminder',
    root: {
      id: 'i-trigger',
      kind: 'trigger',
      title: 'Interview scheduled',
      params: { event: 'Interview scheduled', grade: 'Grade 6', academicYear: '2026–27' },
      children: [
        {
          id: 'i-delay',
          kind: 'delay',
          title: 'The day before',
          params: {
            mode: 'duration',
            amount: 24,
            unit: 'hours',
            excludeWeekends: false,
            event: 'Interview completed',
            maxWaitDays: 2,
            date: '',
          },
          children: [
            {
              id: 'i-email',
              kind: 'email',
              title: 'Reminder to the family',
              params: {
                recipient: 'Parent / Guardian',
                subject: 'Your interview is tomorrow at 10:00',
                sender: 'Admissions team',
                retry,
              },
              children: [
                {
                  id: 'i-branch',
                  kind: 'branch',
                  title: 'Did they attend?',
                  params: { field: 'Interview status' },
                  children: [
                    {
                      id: 'i-status',
                      kind: 'status',
                      title: 'Ready for a decision',
                      pathLabel: 'Yes',
                      pathCondition: { operator: '=', value: 'Completed' },
                      params: { field: 'Interview status', value: 'Completed' },
                      children: [
                        { id: 'i-end', kind: 'end', title: 'End', params: {}, children: [] },
                      ],
                    },
                    {
                      id: 'i-task',
                      kind: 'task',
                      title: 'Reschedule the interview',
                      pathLabel: 'No',
                      params: { assignee: 'Assigned counsellor', priority: 'High', dueInDays: 1 },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'i-notify',
              kind: 'notify',
              title: "Tomorrow's panel list",
              params: {
                recipient: 'Interview panel',
                channel: 'In-app',
                priority: 'Normal',
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
    stage: 'Enrolment',
    name: 'Enrolment confirmation',
    root: {
      id: 'en-trigger',
      kind: 'trigger',
      title: 'Offer accepted',
      params: { event: 'Offer accepted', grade: 'Grade 6', academicYear: '2026-27' },
      children: [
        {
          id: 'en-email-welcome',
          kind: 'email',
          title: 'Welcome to the school',
          params: {
            recipient: 'Parent / Guardian',
            subject: 'Welcome to Greenwood International',
            sender: 'Principal',
            retry,
          },
          children: [
            {
              id: 'en-status',
              kind: 'status',
              title: 'Confirm the enrolment',
              params: { field: 'Enrolment status', value: 'Confirmed' },
              children: [
                {
                  /* This used to be a spreadsheet job for the admissions
                     officer. Balancing is exactly what software should do. */
                  id: 'en-allocate-class',
                  kind: 'allocate',
                  title: 'Allocate the class section',
                  params: {
                    target: 'Class & section',
                    method: 'Balance across options',
                    options: ['A', 'B', 'C'],
                    value: '',
                  },
                  children: [
                    {
                      id: 'en-allocate-house',
                      kind: 'allocate',
                      title: 'Allocate the house',
                      params: {
                        target: 'House',
                        method: 'Match a sibling',
                        options: ['Red', 'Yellow', 'Blue', 'Green'],
                        value: '',
                      },
                      children: [
                        {
                          id: 'en-email-joining',
                          kind: 'email',
                          title: 'Class, house and joining details',
                          params: {
                            recipient: 'Parent / Guardian',
                            subject: 'Your class, house, uniform list and fee payment',
                            sender: 'Admissions team',
                            retry,
                          },
                          children: [
                            { id: 'en-end', kind: 'end', title: 'End', params: {}, children: [] },
                          ],
                        },
                        {
                          id: 'en-notify-teacher',
                          kind: 'notify',
                          title: 'Brief the class teacher',
                          params: {
                            recipient: 'Class teacher',
                            channel: 'In-app',
                            priority: 'Normal',
                            retry: noRetry,
                          },
                          children: [],
                        },
                        {
                          id: 'en-notify-house',
                          kind: 'notify',
                          title: 'Brief the house captain',
                          params: {
                            recipient: 'House captain',
                            channel: 'In-app',
                            priority: 'Normal',
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
    stage: 'Payment',
    name: 'Payment reminder',
    root: {
      id: 'p-trigger',
      kind: 'trigger',
      title: 'Applicant enrolled',
      params: { event: 'Applicant enrolled', grade: 'All grades', academicYear: '2026–27' },
      children: [
        {
          id: 'p-email-instructions',
          kind: 'email',
          title: 'Payment instructions',
          params: {
            recipient: 'Parent / Guardian',
            subject: 'Fee payment for Grade 6 · 2026–27',
            sender: 'Finance team',
            retry,
          },
          children: [
            {
              id: 'p-delay-1',
              kind: 'delay',
              title: 'Wait for the payment',
              params: {
                mode: 'duration',
                amount: 5,
                unit: 'days',
                excludeWeekends: true,
                event: 'Payment received',
                maxWaitDays: 7,
                date: '',
              },
              children: [
                {
                  id: 'p-branch-1',
                  kind: 'branch',
                  title: 'Is the fee still pending?',
                  params: { field: 'Payment status' },
                  children: [
                    {
                      id: 'p-email-reminder',
                      kind: 'email',
                      title: 'Payment reminder',
                      pathLabel: 'Yes',
                      pathCondition: { operator: '=', value: 'Pending' },
                      params: {
                        recipient: 'Parent / Guardian',
                        subject: 'Fee payment is still pending',
                        sender: 'Finance team',
                        retry,
                      },
                      children: [
                        {
                          id: 'p-delay-2',
                          kind: 'delay',
                          title: 'Second wait',
                          params: {
                            mode: 'duration',
                            amount: 3,
                            unit: 'days',
                            excludeWeekends: true,
                            event: 'Payment received',
                            maxWaitDays: 5,
                            date: '',
                          },
                          children: [
                            {
                              id: 'p-branch-2',
                              kind: 'branch',
                              title: 'Still pending?',
                              params: { field: 'Payment status' },
                              children: [
                                {
                                  id: 'p-task',
                                  kind: 'task',
                                  title: 'Finance follow-up call',
                                  pathLabel: 'Yes',
                                  pathCondition: { operator: '=', value: 'Pending' },
                                  params: {
                                    assignee: 'Finance team',
                                    priority: 'High',
                                    dueInDays: 3,
                                  },
                                  children: [],
                                },
                                {
                                  id: 'p-end-2',
                                  kind: 'end',
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
                      kind: 'end',
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
    stage: 'Transfer',
    name: 'Inter-branch transfer request',
    root: {
      id: 't-trigger',
      kind: 'trigger',
      title: 'Transfer request raised',
      params: { event: 'Transfer request raised', grade: 'Grade 6', academicYear: '2026-27' },
      children: [
        {
          id: 't-branch-dues',
          kind: 'branch',
          title: 'Are dues cleared at the current branch?',
          params: { field: 'Dues status' },
          children: [
            {
              id: 't-task-seat',
              kind: 'task',
              title: 'Verify the seat at the destination',
              pathLabel: 'Cleared',
              pathCondition: { operator: '=', value: 'Cleared' },
              params: {
                assignee: 'Destination admissions officer',
                priority: 'High',
                dueInDays: 2,
              },
              children: [
                {
                  id: 't-branch-seat',
                  kind: 'branch',
                  title: 'Seat at the destination branch?',
                  params: { field: 'Seat availability' },
                  children: [
                    {
                      id: 't-status-approved',
                      kind: 'status',
                      title: 'Approve the transfer',
                      pathLabel: 'Seat available',
                      pathCondition: { operator: '=', value: 'Available' },
                      params: { field: 'Transfer status', value: 'Approved' },
                      children: [
                        {
                          id: 't-email-confirm',
                          kind: 'email',
                          title: 'Transfer confirmed',
                          params: {
                            recipient: 'Parent / Guardian',
                            subject: 'Your transfer to Greenwood Primary is confirmed',
                            sender: 'Admissions team',
                            retry,
                          },
                          children: [
                            {
                              id: 't-task-records',
                              kind: 'task',
                              title: 'Move the student records across',
                              params: {
                                assignee: 'Records team',
                                priority: 'Medium',
                                dueInDays: 3,
                              },
                              children: [],
                            },
                          ],
                        },
                        {
                          id: 't-notify-dest',
                          kind: 'notify',
                          title: 'Brief the destination coordinator',
                          params: {
                            recipient: 'Destination coordinator',
                            channel: 'In-app + email',
                            priority: 'Normal',
                            retry: noRetry,
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 't-email-wait',
                      kind: 'email',
                      title: 'Waitlisted at the destination',
                      pathLabel: 'Waitlisted',
                      pathCondition: { operator: '=', value: 'Waitlist' },
                      params: {
                        recipient: 'Parent / Guardian',
                        subject: 'You are on the waitlist at Greenwood Primary',
                        sender: 'Admissions team',
                        retry,
                      },
                      children: [
                        {
                          id: 't-delay-wait',
                          kind: 'delay',
                          title: 'Hold for a week',
                          params: {
                            mode: 'duration',
                            amount: 7,
                            unit: 'days',
                            excludeWeekends: true,
                            event: 'Payment received',
                            maxWaitDays: 14,
                            date: '',
                          },
                          children: [
                            {
                              id: 't-task-wait',
                              kind: 'task',
                              title: 'Review the waitlist',
                              params: {
                                assignee: 'Destination admissions officer',
                                priority: 'Medium',
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
                      kind: 'email',
                      title: 'No seat this academic year',
                      pathLabel: 'No seat',
                      pathCondition: { operator: '=', value: '' },
                      params: {
                        recipient: 'Parent / Guardian',
                        subject: 'We cannot offer a seat at Greenwood Primary this year',
                        sender: 'Admissions team',
                        retry,
                      },
                      children: [
                        {
                          id: 't-task-counsel',
                          kind: 'task',
                          title: 'Counsel the family on the options',
                          params: {
                            assignee: 'Assigned counsellor',
                            priority: 'Medium',
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
              kind: 'email',
              title: 'Dues must be cleared first',
              pathLabel: 'Pending',
              pathCondition: { operator: '=', value: '' },
              params: {
                recipient: 'Parent / Guardian',
                subject: 'Pending dues are holding up the transfer',
                sender: 'Finance team',
                retry,
              },
              children: [
                {
                  id: 't-task-dues',
                  kind: 'task',
                  title: 'Reconcile the dues',
                  params: { assignee: 'Finance team', priority: 'High', dueInDays: 3 },
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
