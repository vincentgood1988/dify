import {
  useCallback,
  useRef,
} from 'react'
import { debounce } from 'lodash-es'
import {
  useStoreApi,
} from 'reactflow'
import { useTranslation } from 'react-i18next'
import { useWorkflowHistoryStore } from '../workflow-history-store'

/**
 * All supported Events that create a new history state.
 * Current limitations:
 * - InputChange events in Node Panels do not trigger state changes.
 * - Resizing UI elements does not trigger state changes.
 */
export enum WorkflowHistoryEvent {
  NodeTitleChange = 'NodeTitleChange',
  NodeDescriptionChange = 'NodeDescriptionChange',
  NodeDragStop = 'NodeDragStop',
  NodeChange = 'NodeChange',
  NodeConnect = 'NodeConnect',
  NodePaste = 'NodePaste',
  NodeDelete = 'NodeDelete',
  EdgeDelete = 'EdgeDelete',
  EdgeDeleteByDeleteBranch = 'EdgeDeleteByDeleteBranch',
  NodeAdd = 'NodeAdd',
}

export const useWorkflowHistory = () => {
  const store = useStoreApi()
  const workflowHistoryStore = useWorkflowHistoryStore()
  const { t } = useTranslation()

  // Some events may be triggered multiple times in a short period of time.
  // We debounce the history state update to avoid creating multiple history states
  // with minimal changes.
  const saveStateToHistoryRef = useRef(debounce((event: WorkflowHistoryEvent) => {
    workflowHistoryStore.setState({
      workflowHistoryEvent: event,
      nodes: store.getState().getNodes(),
      edges: store.getState().edges,
    })
  }, 500))

  const saveStateToHistory = useCallback((event: WorkflowHistoryEvent) => {
    switch (event) {
      case WorkflowHistoryEvent.NodeTitleChange:
      case WorkflowHistoryEvent.NodeDescriptionChange:
      case WorkflowHistoryEvent.NodeDragStop:
      case WorkflowHistoryEvent.NodeChange:
      case WorkflowHistoryEvent.NodeConnect:
      case WorkflowHistoryEvent.NodePaste:
      case WorkflowHistoryEvent.NodeDelete:
      case WorkflowHistoryEvent.EdgeDelete:
      case WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
      case WorkflowHistoryEvent.NodeAdd:
        saveStateToHistoryRef.current(event)
        break
      default:
        // We do not create a history state for every event.
        // Some events of reactflow may change things the user would not want to undo/redo.
        // For example: UI state changes like selecting a node.
        break
    }
  }, [])

  const getHistoryLabel = useCallback((event: WorkflowHistoryEvent) => {
    switch (event) {
      case WorkflowHistoryEvent.NodeTitleChange:
        return t('workflow.changeHistory.nodeTitleChange')
      case WorkflowHistoryEvent.NodeDescriptionChange:
        return t('workflow.changeHistory.nodeDescriptionChange')
      case WorkflowHistoryEvent.NodeDragStop:
        return t('workflow.changeHistory.nodeDragStop')
      case WorkflowHistoryEvent.NodeChange:
        return t('workflow.changeHistory.nodeChange')
      case WorkflowHistoryEvent.NodeConnect:
        return t('workflow.changeHistory.nodeConnect')
      case WorkflowHistoryEvent.NodePaste:
        return t('workflow.changeHistory.nodePaste')
      case WorkflowHistoryEvent.NodeDelete:
        return t('workflow.changeHistory.nodeDelete')
      case WorkflowHistoryEvent.NodeAdd:
        return t('workflow.changeHistory.nodeAdd')
      case WorkflowHistoryEvent.EdgeDelete:
      case WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
        return t('workflow.changeHistory.edgeDelete')
      default:
        return 'Unknown Event'
    }
  }, [])

  return {
    store: workflowHistoryStore,
    saveStateToHistory,
    getHistoryLabel,
  }
}
