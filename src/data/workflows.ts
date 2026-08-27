import type { Workflow } from '../types/workflow'

/** The five workflows from docs/02-workflow-use-cases.md, as mock data.
 *  Nothing here executes — see docs/07-prototype-scope.md. */
export const workflows: Workflow[] = [
  {
    id: 'new-enquiry-follow-up',
    name: 'New enquiry follow-up',
    description: 'Convert a new enquiry into a submitted application.',
    category: 'admissions',
    status: 'active',
    trigger: 'Enquiry created',
    createdBy: 'Priya Menon',
    updatedAt: '2026-08-25',
    steps: [
      {
        id: 'w1-trigger',
        type: 'trigger',
        title: 'Enquiry created',
        summary: 'Enquiry created · All grades · 2026–27',
      },
      {
        id: 'w1-email-intro',
        type: 'send-email',
        title: 'School introduction',
        summary: 'Email · School introduction → Parent',
      },
      { id: 'w1-delay-3d', type: 'delay', title: 'Wait 3 days', summary: 'Wait 3 days' },
      {
        id: 'w1-branch',
        type: 'branch',
        title: 'Application submitted?',
        summary: 'Application status = Submitted',
        yes: [{ id: 'w1-end', type: 'end', title: 'End', summary: 'Workflow ends' }],
        no: [
          {
            id: 'w1-email-reminder',
            type: 'send-email',
            title: 'Application reminder',
            summary: 'Email · Application reminder → Parent',
          },
          { id: 'w1-delay-4d', type: 'delay', title: 'Wait 4 days', summary: 'Wait 4 days' },
          {
            id: 'w1-task',
            type: 'create-task',
            title: 'Call the parent',
            summary: 'Task · Call the parent → Counsellor · High',
          },
        ],
      },
    ],
  },
  {
    id: 'application-acknowledgement',
    name: 'Application acknowledgement',
    description: 'Confirm receipt of an application and make sure it is picked up for review.',
    category: 'admissions',
    status: 'active',
    trigger: 'Application submitted',
    createdBy: 'Rahul Nair',
    updatedAt: '2026-08-26',
    steps: [
      {
        id: 'w2-trigger',
        type: 'trigger',
        title: 'Application submitted',
        summary: 'Application submitted · Grade 6 · 2026–27',
      },
      {
        id: 'w2-email-received',
        type: 'send-email',
        title: 'Application received',
        summary: 'Email · Application received → Parent',
      },
      {
        id: 'w2-task-review',
        type: 'create-task',
        title: 'Review application',
        summary: 'Task · Review application → Admissions team · Medium',
      },
      {
        id: 'w2-status',
        type: 'update-status',
        title: 'Move to Under review',
        summary: 'Application status → Under review',
      },
      { id: 'w2-delay-2d', type: 'delay', title: 'Wait 2 days', summary: 'Wait 2 days' },
      {
        id: 'w2-branch',
        type: 'branch',
        title: 'Application reviewed?',
        summary: 'Application status = Reviewed',
        yes: [
          {
            id: 'w2-email-next',
            type: 'send-email',
            title: 'Next steps',
            summary: 'Email · Next steps → Parent',
          },
        ],
        no: [
          {
            id: 'w2-notify',
            type: 'send-notification',
            title: 'Unreviewed for 2 days',
            summary: 'Notify · Admissions head · Urgent',
          },
        ],
      },
    ],
  },
  {
    id: 'missing-documents-reminder',
    name: 'Missing documents reminder',
    description: 'Chase incomplete document sets without a human tracking a spreadsheet.',
    category: 'admissions',
    status: 'draft',
    trigger: 'Application submitted',
    createdBy: 'Aisha Khan',
    updatedAt: '2026-08-20',
    steps: [
      {
        id: 'w3-trigger',
        type: 'trigger',
        title: 'Application submitted',
        summary: 'Application submitted · All grades · 2026–27',
      },
      {
        id: 'w3-branch-1',
        type: 'branch',
        title: 'Documents complete?',
        summary: 'Document status = Complete',
        yes: [{ id: 'w3-end-1', type: 'end', title: 'Continue to review', summary: 'Workflow ends' }],
        no: [
          {
            id: 'w3-tag',
            type: 'add-tag',
            title: 'Flag the applicant',
            summary: 'Tag · Documents pending',
          },
          {
            id: 'w3-email',
            type: 'send-email',
            title: 'Missing documents reminder',
            summary: 'Email · Missing documents → No recipient',
            warning: 'Configure email recipient',
          },
          {
            id: 'w3-delay',
            type: 'delay',
            title: 'Wait for the documents',
            summary: 'Wait until documents submitted (max 3 days)',
          },
          {
            id: 'w3-branch-2',
            type: 'branch',
            title: 'Documents complete?',
            summary: 'Document status = Complete',
            yes: [{ id: 'w3-end-2', type: 'end', title: 'Continue to review', summary: 'Workflow ends' }],
            no: [
              {
                id: 'w3-task',
                type: 'create-task',
                title: 'Counsellor follow-up call',
                summary: 'Task · Follow-up call → Counsellor · High',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'interview-reminder',
    name: 'Interview reminder',
    description: 'Make sure families attend the interview or assessment slot they booked.',
    category: 'admissions',
    status: 'paused',
    trigger: 'Interview scheduled',
    createdBy: 'Vikram Rao',
    updatedAt: '2026-08-12',
    steps: [
      {
        id: 'w4-trigger',
        type: 'trigger',
        title: 'Interview scheduled',
        summary: 'Interview scheduled · Grade 6 · 2026–27',
      },
      {
        id: 'w4-delay',
        type: 'delay',
        title: 'Wait until the day before',
        summary: 'Wait until 24h before interview',
      },
      {
        id: 'w4-email',
        type: 'send-email',
        title: 'Interview reminder',
        summary: 'Email · Interview reminder → Parent',
      },
      {
        id: 'w4-notify',
        type: 'send-notification',
        title: "Tomorrow's interview list",
        summary: 'Notify · Interview panel · Normal',
      },
      {
        id: 'w4-branch',
        type: 'branch',
        title: 'Interview completed?',
        summary: 'Interview status = Completed',
        yes: [{ id: 'w4-end', type: 'end', title: 'Continue to decision', summary: 'Workflow ends' }],
        no: [
          {
            id: 'w4-task',
            type: 'create-task',
            title: 'Reschedule with the parent',
            summary: 'Task · Reschedule → Counsellor · High',
          },
        ],
      },
    ],
  },
  {
    id: 'enrolment-payment-reminder',
    name: 'Enrolment payment reminder',
    description: 'Follow up when the fee is still pending after enrolment.',
    category: 'enrolment',
    status: 'draft',
    trigger: 'Applicant enrolled',
    createdBy: 'Sneha Iyer',
    updatedAt: '2026-07-30',
    steps: [
      {
        id: 'w5-trigger',
        type: 'trigger',
        title: 'Applicant enrolled',
        summary: 'Applicant enrolled · All grades · 2026–27',
      },
      {
        id: 'w5-email-instructions',
        type: 'send-email',
        title: 'Payment instructions',
        summary: 'Email · Payment instructions → Parent',
      },
      { id: 'w5-delay-5d', type: 'delay', title: 'Wait 5 days', summary: 'Wait 5 days' },
      {
        id: 'w5-branch-1',
        type: 'branch',
        title: 'Payment pending?',
        summary: 'Payment status = Pending',
        yes: [
          {
            id: 'w5-email-reminder',
            type: 'send-email',
            title: 'Payment reminder',
            summary: 'Email · Payment reminder → Parent',
          },
          {
            id: 'w5-delay-3d',
            type: 'delay',
            title: 'Wait 3 days',
            summary: 'Wait 3 days · excludes weekends',
          },
          {
            id: 'w5-branch-2',
            type: 'branch',
            title: 'Payment pending?',
            summary: 'Payment status = Pending',
            yes: [
              {
                id: 'w5-task',
                type: 'create-task',
                title: 'Finance team follow-up',
                summary: 'Task · Finance follow-up → No assignee',
                warning: 'Configure task assignee',
              },
            ],
            no: [{ id: 'w5-end-2', type: 'end', title: 'End', summary: 'Workflow ends' }],
          },
        ],
        no: [{ id: 'w5-end-1', type: 'end', title: 'End', summary: 'Workflow ends' }],
      },
    ],
  },
]

export function getWorkflow(id: string | undefined): Workflow | undefined {
  return workflows.find((workflow) => workflow.id === id)
}
