import { useCallback, useEffect, useState } from 'react'
import type { Flow } from '../types/flow'
import { formatFlowLocation, parseFlowLocation } from '../utils/urlState'

interface Options {
  flows: readonly Flow[]
  /** Used when the URL names nothing, or names something that no longer exists. */
  fallbackFlowId: string
}

interface FlowLocationState {
  flowId: string
  stepId: string
  /** Opening a workflow pushes history, so browser Back walks the stages. */
  openFlow: (flowId: string, stepId: string) => void
  /** Selecting a step replaces history, so a click-heavy demo does not bury
   *  the Back button under thirty selections. */
  selectStep: (stepId: string) => void
}

/** Keeps the open workflow and the selected step in the query string, so a
 *  diagram can be linked, bookmarked and reloaded into. */
export function useFlowLocation({ flows, fallbackFlowId }: Options): FlowLocationState {
  const resolve = useCallback(
    (search: string) => {
      const { flowId, stepId } = parseFlowLocation(search)
      const flow = flows.find((candidate) => candidate.id === flowId)
      const resolved = flow ?? flows.find((candidate) => candidate.id === fallbackFlowId) ?? flows[0]
      return { flowId: resolved.id, stepId: stepId ?? resolved.root.id }
    },
    [flows, fallbackFlowId],
  )

  const [location, setLocation] = useState(() => resolve(window.location.search))

  const write = useCallback((next: { flowId: string; stepId: string }, push: boolean) => {
    const url = `${window.location.pathname}${formatFlowLocation(next)}`
    if (push) window.history.pushState(next, '', url)
    else window.history.replaceState(next, '', url)
    setLocation(next)
  }, [])

  /* Back and forward change the URL without a reload, so adopt it. */
  useEffect(() => {
    function onPopState() {
      setLocation(resolve(window.location.search))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [resolve])

  /* Normalise on first load: a bare URL, or one naming a workflow that does
     not exist, should still read back as the workflow actually on screen. */
  useEffect(() => {
    const { flowId, stepId } = parseFlowLocation(window.location.search)
    if (flowId !== location.flowId || (stepId !== null && stepId !== location.stepId)) {
      write(location, false)
    }
    /* Mount only: later writes go through openFlow and selectStep. */
  }, [])

  return {
    flowId: location.flowId,
    stepId: location.stepId,
    openFlow: (flowId, stepId) => write({ flowId, stepId }, true),
    selectStep: (stepId) => write({ flowId: location.flowId, stepId }, false),
  }
}
