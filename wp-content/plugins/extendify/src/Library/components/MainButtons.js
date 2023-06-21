import { Button } from '@wordpress/components'
import { useEffect } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { Icon } from '@wordpress/icons'
import { useUserStore, useUserStoreReady } from '@library/state/User'
import { openModal } from '@library/util/general'
import { brandMark } from './icons'

export const MainButtonWrapper = () => {
    const hasPendingNewImports = useUserStore(
        (state) => state.runningImports === -1,
    )
    const userDataReady = useUserStoreReady()

    useEffect(() => {
        if (userDataReady && hasPendingNewImports) {
            useUserStore.setState({ runningImports: 0 })
        }
    }, [hasPendingNewImports, userDataReady])

    return <MainButton text={__('Design Library', 'extendify')} />
}

const MainButton = ({ buttonRef, text }) => (
    <div className="extendify">
        <Button
            variant="primary"
            ref={buttonRef}
            className="h-8 xs:h-9 px-1 min-w-0 xs:pl-2 xs:pr-3 sm:ml-2"
            onClick={() => openModal('main-button')}
            id="extendify-templates-inserter-btn"
            icon={
                <Icon icon={brandMark} size={24} style={{ marginRight: 0 }} />
            }>
            <span className="hidden xs:inline ml-1">{text}</span>
        </Button>
    </div>
)

export const CtaButton = () => (
    <Button
        id="extendify-cta-button"
        style={{
            margin: '1rem 1rem 0',
            width: 'calc(100% - 2rem)',
            justifyContent: ' center',
        }}
        onClick={() => openModal('patterns-cta')}
        isSecondary>
        {sprintf(
            // translators: %s: Extendify Library term.
            __('Discover patterns in the %s', 'extendify'),
            'Extendify Library',
        )}
    </Button>
)
