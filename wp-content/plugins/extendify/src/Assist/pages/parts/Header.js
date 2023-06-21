import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classNames from 'classnames'
import { Logo } from '@onboarding/svg'
import { useDesignColors } from '@assist/hooks/useDesignColors'
import { useRouter } from '@assist/hooks/useRouter'
import { Nav } from '@assist/pages/parts/Nav'

export const Header = () => {
    const { filteredPages, navigateTo, current } = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    useDesignColors()

    return (
        <header className="w-full flex bg-design-main">
            <div className="max-w-screen-2xl w-full mx-4 md:mx-12 3xl:mx-auto mt-auto flex flex-col">
                <div className="flex flex-wrap justify-between items-center my-6 xl:my-8 gap-x-4 gap-y-2">
                    {window.extAssistData?.partnerLogo && (
                        <div className="w-40 h-16 flex items-center">
                            <a
                                href={`${window.extAssistData.adminUrl}admin.php?page=extendify-assist`}>
                                <img
                                    className="h-full w-full"
                                    src={window.extAssistData.partnerLogo}
                                    alt={window.extAssistData.partnerName}
                                />
                            </a>
                        </div>
                    )}
                    {!window.extAssistData?.partnerLogo && (
                        <a href="/wp-admin/admin.php?page=extendify-assist">
                            <Logo className="logo text-design-text w-32 sm:w-40" />
                        </a>
                    )}
                    <div className="lg:hidden">
                        <button
                            type="button"
                            className={classNames(
                                'cursor-pointer bg-transparent hover:bg-white hover:bg-opacity-20 text-design-text h-8 rounded-sm flex items-center gap-2 text-base',
                                { 'bg-white bg-opacity-20': menuOpen },
                            )}
                            onClick={() => setMenuOpen((v) => !v)}>
                            <span className="dashicons dashicons-menu-alt text-design-text" />
                            {__('Menu', 'extendify')}
                        </button>
                    </div>
                    <div
                        id="assist-menu-bar"
                        className={classNames(
                            'lg:flex lg:w-auto flex-wrap gap-4 items-center',
                            {
                                hidden: !menuOpen,
                                block: menuOpen,
                                'w-full': menuOpen,
                            },
                        )}>
                        <Nav
                            hideMenu={() => setMenuOpen(false)}
                            pages={filteredPages}
                            activePage={current?.slug}
                            setActivePage={navigateTo}
                        />
                        <a
                            className="text-sm text-center text-design-main cursor-pointer rounded-b-sm lg:rounded-sm py-2 px-3 bg-white border-none no-underline block lg:inline-block"
                            href={window.extAssistData.home}
                            target="_blank"
                            rel="noreferrer">
                            {__('View site', 'extendify')}
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
