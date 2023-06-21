import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { getTaskData, saveTaskData } from '@assist/api/Data'

const key = 'extendify-assist-tasks'
const startingState = {
    // These are tests the user is in progress of completing.
    // Not to be confused with tasks that are in progress.
    // ! This should have probably been in Global or elsewhere?
    activeTests: [],
    // These are tasks that the user has seen. When added,
    // they will look like [{ key, firstSeenAt }]
    seenTasks: [],
    // These are tasks the user has already completed
    // [{ key, completedAt }] but it used to just be [key]
    // so use ?.completedAt to check if it's completed with the (.?)
    completedTasks: [],
    inProgressTasks: [],
    // Optimistically update from local storage - see storage.setItem below
    ...(JSON.parse(localStorage.getItem(key) || '{}')?.state ?? {}),
}

const state = (set, get) => ({
    ...startingState,
    isCompleted(taskId) {
        return get().completedTasks.some((task) => task?.id === taskId)
    },
    completeTask(taskId) {
        if (get().isCompleted(taskId)) {
            return
        }
        set((state) => ({
            completedTasks: [
                ...state.completedTasks,
                {
                    id: taskId,
                    completedAt: new Date().toISOString(),
                },
            ],
        }))
    },
    // Marks the task as dismissed: true
    dismissTask(taskId) {
        get().completeTask(taskId)
        set((state) => {
            const { completedTasks } = state
            const task = completedTasks.find((task) => task.id === taskId)
            return {
                completedTasks: [
                    ...completedTasks,
                    { ...task, dismissed: true },
                ],
            }
        })
    },
    isSeen(taskId) {
        return get().seenTasks.some((task) => task?.id === taskId)
    },
    seeTask(taskId) {
        if (get().isSeen(taskId)) {
            return
        }
        const task = {
            id: taskId,
            firstSeenAt: new Date().toISOString(),
        }
        set((state) => ({
            seenTasks: [...state.seenTasks, task],
        }))
    },
    uncompleteTask(taskId) {
        set((state) => ({
            completedTasks: state.completedTasks.filter(
                (task) => task.id !== taskId,
            ),
        }))
    },
    toggleCompleted(taskId) {
        if (get().isCompleted(taskId)) {
            get().uncompleteTask(taskId)
            return
        }
        get().completeTask(taskId)
    },
})

const storage = {
    getItem: async () => JSON.stringify(await getTaskData()),
    setItem: async (k, value) => {
        // Stash here so we can use it on reload optimistically
        localStorage.setItem(k, value)
        await saveTaskData(value)
    },
    removeItem: () => undefined,
}

export const useTasksStore = create(
    persist(devtools(state, { name: 'Extendify Assist Tasks' }), {
        name: key,
        storage: createJSONStorage(() => storage),
    }),
    state,
)
