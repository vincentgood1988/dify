import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Tooltip from '../../base/tooltip'
import { FlipBackward, FlipForward } from '../../base/icons/src/vender/line/arrows'
import { useNodesReadOnly } from '@/app/components/workflow/hooks'
import ViewWorkflowHistory from '@/app/components/workflow/header/view-workflow-history'

export type UndoRedoProps = { handleUndo: () => void; handleRedo: () => void }
const UndoRedo: FC<UndoRedoProps> = ({ handleUndo, handleRedo }) => {
  const { t } = useTranslation()

  const { nodesReadOnly } = useNodesReadOnly()

  return (
    <div className='flex items-center px-0.5 h-8 rounded-lg border-[0.5px] border-gray-200 bg-white shadow-xs'>

      <Tooltip selector={'workflow.common.undo'} content={t('workflow.common.undo')!} >
        <div
          data-tooltip-id='workflow.undo'
          className={`
        flex items-center px-1.5 h-7 rounded-md text-[13px] font-medium text-primary-600
        hover:bg-primary-50 cursor-pointer select-none
        ${nodesReadOnly && 'bg-primary-50 opacity-50 !cursor-not-allowed'}
      `}
          onClick={() => !nodesReadOnly && handleUndo()}
        >
          <FlipBackward className='mr-1 px-1 h-4 w-6' />
        </div>
      </Tooltip>

      <Tooltip selector={'workflow.redo'} content={t('workflow.common.redo')!} >
        <div
          data-tooltip-id='workflow.redo'
          className={`
        flex items-center px-1.5 h-7 rounded-md text-[13px] font-medium text-primary-600
        hover:bg-primary-50 cursor-pointer select-none
        ${nodesReadOnly && 'bg-primary-50 opacity-50 !cursor-not-allowed'}
      `}
          onClick={() => !nodesReadOnly && handleRedo()}
        >
          <FlipForward className='mr-1 px-1 h-4 w-6' />

        </div>
      </Tooltip>
      <div className='mx-0.5 w-[0.5px] h-8 bg-gray-200'></div>
      <ViewWorkflowHistory />
    </div>
  )
}

export default memo(UndoRedo)
