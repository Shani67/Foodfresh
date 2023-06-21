import { Spinner } from '@wordpress/components'
import { useEffect } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import { Icon, chevronRightSmall } from '@wordpress/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { TaskBadge } from '@assist/components/TaskBadge'
import { TaskItem } from '@assist/components/task-items/TaskItem'
import { useTasks } from '@assist/hooks/useTasks'
import { useTasksStore } from '@assist/state/Tasks'
import { Confetti } from '@assist/svg'

export const TasksList = () => {
    const { seeTask, isCompleted } = useTasksStore()
    const { tasks, loading, error } = useTasks()

    const notCompleted = tasks?.filter((task) => !isCompleted(task.slug))

    useEffect(() => {
        if (!notCompleted?.length) return
        // Mark all tasks as seen. If always seen they will not update.
        notCompleted.forEach((task) => seeTask(task.slug))
    }, [notCompleted, seeTask])

    if (loading || error) {
        return (
            <div className="assist-tasks-module w-full flex justify-center bg-white border border-gray-300 p-2 lg:p-4 mb-6 rounded">
                <Spinner />
            </div>
        )
    }

    if (tasks?.length === 0) {
        return (
            <div className="assist-tasks-module w-full bg-white border border-gray-300 p-2 lg:p-4 mb-6 rounded">
                {__('No tasks found...', 'extendify')}
            </div>
        )
    }

    // Use the WP admin accent color as the bg
    const adminColor = window.getComputedStyle(
        document?.querySelector('#wpadminbar'),
    )?.['background-color']

    return (
        <div
            id="assist-tasks-module"
            className="assist-tasks-module w-full border border-gray-300 text-base bg-white p-4 md:p-8 rounded mb-6">
            <div className="flex justify-between items-center gap-2">
                <h2 className="text-lg leading-tight m-0 flex items-center gap-1">
                    <span>{__('Tasks', 'extendify')}</span>
                    {notCompleted?.length > 0 ? (
                        <span
                            className="rounded-full py-0 px-1.5 text-xss flex justify-center items-center text-white w-4 h-4"
                            style={{ backgroundColor: adminColor }}>
                            <TaskBadge />
                        </span>
                    ) : null}
                </h2>
                <a
                    href="admin.php?page=extendify-assist#tasks"
                    className="inline-flex items-center no-underline text-sm text-design-main hover:underline">
                    {notCompleted?.length > 0
                        ? sprintf(
                              __('View all (%s)', 'extendify'),
                              tasks?.length,
                          )
                        : __('View completed tasks', 'extendify')}
                    <Icon icon={chevronRightSmall} className="fill-current" />
                </a>
            </div>
            {notCompleted.length === 0 ? (
                <TasksCompleted />
            ) : (
                <div className="border border-b-0 border-gray-300 mt-4">
                    <AnimatePresence>
                        {notCompleted.slice(0, 5).map((task) => (
                            <motion.div
                                key={task.slug}
                                variants={{
                                    fade: {
                                        opacity: 0,
                                        x: 15,
                                        transition: {
                                            duration: 0.5,
                                        },
                                    },
                                    shrink: {
                                        height: 0,
                                        transition: {
                                            delay: 0.5,
                                            duration: 0.2,
                                        },
                                    },
                                }}
                                exit={['fade', 'shrink']}>
                                <TaskItemWrapper task={task} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

const TaskItemWrapper = ({ task, Action }) => (
    <div className="px-3 sm:px-4 py-3 flex gap-2 justify-between border-0 border-b border-gray-300 relative items-center min-h-16">
        <TaskItem task={task} Action={Action} />
    </div>
)

const TasksCompleted = () => {
    return (
        <div className="flex flex-col items-center justify-center border-b border-gray-300 p-4 lg:p-8">
            <Confetti aria-hidden={true} />
            <p className="mb-0 text-lg font-bold">
                {__('All caught up!', 'extendify')}
            </p>
            <p className="mb-0 text-sm">
                {__(
                    'Congratulations! Take a moment to celebrate.',
                    'extendify',
                )}
            </p>
        </div>
    )
}
