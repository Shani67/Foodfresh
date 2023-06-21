import { Dropdown } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Icon, moreVertical } from '@wordpress/icons'
import { InternalLinkButton } from '@assist/components/buttons/InternalLinkButton'
import { ModalButton } from '@assist/components/buttons/ModalButton'
import { TourButton } from '@assist/components/buttons/TourButton'
import { useTasksStore } from '@assist/state/Tasks'

export const TaskItem = ({ task }) => {
    const { isCompleted, dismissTask } = useTasksStore()
    const { slug } = task
    const actions = {
        modal: ModalButton,
        tour: TourButton,
        'internal link': InternalLinkButton,
    }
    const Action = task?.taskType ? actions[task.taskType] : null

    return (
        <>
            <div className="flex gap-1 sm:gap-2 items-center">
                <div className="sr-only">
                    {isCompleted(slug)
                        ? __('Completed', 'extendify')
                        : __('Not completed', 'extendify')}
                </div>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                    className="flex-shrink-0 w-6 h-6 rounded-full text-gray-400">
                    {/* <!-- The background --> */}
                    <circle
                        className="checkbox__background"
                        r="5"
                        cx="8"
                        cy="8"
                        stroke={
                            isCompleted(slug)
                                ? 'var(--ext-design-main, #3959e9)'
                                : 'currentColor'
                        }
                        fill={
                            isCompleted(slug)
                                ? 'var(--ext-design-main, #3959e9)'
                                : 'none'
                        }
                        strokeWidth="1"
                    />
                    {/* <!-- The checkmark--> */}
                    <polyline
                        className="checkbox__checkmark"
                        points="5,8 8,10 11,6"
                        stroke={isCompleted(slug) ? '#fff' : 'transparent'}
                        strokeWidth="1"
                        fill="none"
                    />
                </svg>
                <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                        {task.title}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-end gap-1 sm:gap-3">
                {Action && <Action task={task} />}
                {isCompleted(slug) ? (
                    <div className="w-5" />
                ) : (
                    <Dropdown
                        className="w-5"
                        position="bottom left"
                        popoverProps={{ placement: 'bottom-end' }}
                        renderContent={({ onClose }) => (
                            <button
                                onClick={() => {
                                    onClose()
                                    dismissTask(task.slug)
                                }}
                                type="button"
                                className="-m-2 p-2 px-4 text-gray-900 text-sm border-0 cursor-pointer rounded-none bg-white hover:bg-gray-100 text-center no-underline">
                                {__('Dismiss', 'extendify')}
                            </button>
                        )}
                        renderToggle={({ onToggle }) => (
                            <button
                                onClick={onToggle}
                                type="button"
                                className="p-0 text-white text-xs border-0 rounded cursor-pointer bg-transparent text-center no-underline">
                                <Icon icon={moreVertical} className="" />
                            </button>
                        )}
                    />
                )}
            </div>
        </>
    )
}
