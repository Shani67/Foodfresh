import { useGlobalStore } from '@assist/state/Global'
import { useTasksStore } from '@assist/state/Tasks'
import { UpdateLogo } from '@assist/tasks/UpdateLogo'
import { UpdateSiteDescription } from '@assist/tasks/UpdateSiteDescription'
import { UpdateSiteIcon } from '@assist/tasks/UpdateSiteIcon'

export const ModalButton = ({ task }) => {
    const { pushModal } = useGlobalStore()
    const { isCompleted } = useTasksStore()
    const Components = {
        UpdateLogo,
        UpdateSiteDescription,
        UpdateSiteIcon,
    }

    if (!Components[task.modalFunction]) return null

    return (
        <button
            className="px-3 py-2 leading-tight min-w-20 sm:min-w-30 button-focus bg-gray-100 hover:bg-gray-200 focus:shadow-button text-gray-900 rounded-sm relative z-10 cursor-pointer text-center no-underline text-sm"
            type="button"
            onClick={() => pushModal(Components[task.modalFunction])}>
            {isCompleted(task.slug) ? task.buttonTextDone : task.buttonTextToDo}
        </button>
    )
}
