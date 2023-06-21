import { memo } from '@wordpress/element'
import { _n, sprintf } from '@wordpress/i18n'
import { Icon } from '@wordpress/icons'
import clasNames from 'classnames'
import { useUserStore } from '@library/state/User'
import { alert, download } from './icons/'

export const ImportCounter = memo(function ImportCounter() {
    const { remainingImports } = useUserStore()
    const count = remainingImports()

    return (
        <div className="relative mb-5">
            <div
                className={clasNames(
                    'hidden w-full justify-between py-3 px-4 text-sm text-white no-underline sm:flex',
                    {
                        'bg-design-main': count > 0,
                        'bg-extendify-alert': !count,
                    },
                )}>
                <span className="flex items-center space-x-2 text-xs no-underline">
                    <Icon icon={count > 0 ? download : alert} size={14} />
                    <span>
                        {sprintf(
                            // translators: %s is the number of imports remaining
                            _n(
                                '%s Import remaining',
                                '%s Imports remaining',
                                count,
                                'extendify',
                            ),
                            count,
                        )}
                    </span>
                </span>
            </div>
        </div>
    )
})
