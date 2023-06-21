import { useLayoutEffect, useState, useCallback } from '@wordpress/element'
import classNames from 'classnames'
import { getOption } from '@assist/api/WPApi'
import { useTasksStore } from '@assist/state/Tasks'

export const InternalLinkButton = ({ task }) => {
    const { completeTask } = useTasksStore()
    const [link, setLink] = useState(
        task.slug === 'edit-homepage' ? null : task.internalLink,
    )
    const handleClick = useCallback(() => {
        // If no dependency then complete the task
        !task.doneDependencies && completeTask(task.slug)
    }, [task, completeTask])

    useLayoutEffect(() => {
        if (task.slug === 'edit-homepage') {
            const split = task.internalLink.split('$')
            getOption('page_on_front').then((id) => {
                setLink(split[0] + id + split[1])
            })
        }
    }, [task])

    return (
        <a
            href={window.extAssistData.adminUrl + link}
            target="_blank"
            rel="noreferrer"
            className={classNames(
                'px-3 py-2 leading-tight min-w-20 sm:min-w-30 button-focus bg-gray-100 hover:bg-gray-200 focus:shadow-button rounded-sm relative z-10 cursor-pointer text-center no-underline text-sm transition ease-linear duration-150',
                {
                    'text-gray-900': link,
                    'text-gray-600 pointer-events-none': !link,
                },
            )}
            onClick={handleClick}
            aria-disabled={!link ? true : false}>
            {task.buttonTextToDo}
        </a>
    )
}
