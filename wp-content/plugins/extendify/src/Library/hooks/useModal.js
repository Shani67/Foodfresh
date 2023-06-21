import { useEffect, useState } from '@wordpress/element'
import { useGlobalStore } from '@library/state/GlobalState'

/** Return any pending modals and check if any need to show  */
export const useModal = () => {
    const [modal, setModal] = useState(null)
    const open = useGlobalStore((state) => state.open)
    const removeAllModals = useGlobalStore((state) => state.removeAllModals)

    // Watches modals added anywhere
    useEffect(
        () =>
            useGlobalStore.subscribe(
                (state) => state.modals,
                (value) => setModal(value?.length > 0 ? value[0] : null),
            ),
        [],
    )

    useEffect(() => {
        if (!open) removeAllModals()
    }, [open, removeAllModals])

    return modal
}
