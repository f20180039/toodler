/** The URL is the source of truth for *where you are* — which workflow is open
 *  and which step is selected. Editing state stays in memory; only the location
 *  is shareable. Pure functions here; the hook does the reading and writing. */

export const FLOW_PARAM = 'flow'
export const STEP_PARAM = 'step'

export interface FlowLocation {
  flowId: string | null
  stepId: string | null
}

export function parseFlowLocation(search: string): FlowLocation {
  const params = new URLSearchParams(search)
  return {
    flowId: params.get(FLOW_PARAM),
    stepId: params.get(STEP_PARAM),
  }
}

/** `?flow=transfer&step=t-branch-seat`. The step is omitted when it is the
 *  trigger, so the common link stays short. */
export function formatFlowLocation({ flowId, stepId }: FlowLocation): string {
  const params = new URLSearchParams()
  if (flowId) params.set(FLOW_PARAM, flowId)
  if (stepId) params.set(STEP_PARAM, stepId)
  const query = params.toString()
  return query ? `?${query}` : ''
}
