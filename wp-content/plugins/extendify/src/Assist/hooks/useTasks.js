import useSWR from 'swr'
import { getTasks } from '@assist/api/Data'
import { completedDependency } from '@assist/api/Data'
import { useTasksStore } from '@assist/state/Tasks'

export const useTasks = () => {
    const { isCompleted, completeTask } = useTasksStore()

    const { data: tasks, error } = useSWR(
        () => 'tasks',
        async () => {
            const response = await getTasks()

            if (!response?.data || !Array.isArray(response.data)) {
                throw new Error('Bad Data')
            }

            const tasks = response.data

            for (const task of tasks ?? []) {
                const { slug, doneDependencies } = task
                if (!doneDependencies) continue
                if (isCompleted(slug)) continue
                const { data: done } = await completedDependency(slug)
                if (done) completeTask(task.slug)
            }

            return tasks
        },
        {
            refreshInterval: 360_000,
            revalidateOnFocus: false,
            dedupingInterval: 360_000,
        },
    )

    return { tasks, error, loading: !tasks && !error }
}
