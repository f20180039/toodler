import { useCallback, useEffect, useState } from 'react'
import type { Flow } from '../types/flow'
import { formatFlowLocation, parseFlowLocation } from '../utils/urlState'

interface Options {
  flows: readonly Flow[]
  /** Used when the URL names nothing, or names something that no longer exists. */
  fallbackFlowId: string
  /** A step id from the URL is only kept if it exists in the resolved flow.
   *  The caller checks, because it holds the edited trees - a step added
   *  during this session is valid even though the seed data never had it. */
  isValidStep: (flowId: string, stepId: string) => boolean
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
export function useFlowLocation({
  flows,
  fallbackFlowId,
  isValidStep,
}: Options): FlowLocationState {
  const resolve = useCallback(
    (search: string) => {
      const { flowId, stepId } = parseFlowLocation(search)
      const flow = flows.find((candidate) => candidate.id === flowId)
      const resolved = flow ?? flows.find((candidate) => candidate.id === fallbackFlowId) ?? flows[0]
      /* A step from another flow, or one that has since been deleted, must not
         survive: it would leave the URL claiming a selection that is not shown. */
      const step =
        stepId && isValidStep(resolved.id, stepId) ? stepId : resolved.root.id
      return { flowId: resolved.id, stepId: step }
    },
    [flows, fallbackFlowId, isValidStep],
  )

  const [location, setLocation] = useState(() => resolve(window.location.search))

  const write = useCallback((next: { flowId: string; stepId: string }, push: boolean) => {
    const search = formatFlowLocation(next, window.location.search)
    const url = `${window.location.pathname}${search}${window.location.hash}`
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

  /* Normalise on first load, so the address bar always names exactly what is on
     screen: a bare URL, a URL naming a workflow that does not exist, and a URL
     that names a workflow but no step all get written out in full. */
  useEffect(() => {
    const fromUrl = parseFlowLocation(window.location.search)
    if (fromUrl.flowId !== location.flowId || fromUrl.stepId !== location.stepId) {
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
