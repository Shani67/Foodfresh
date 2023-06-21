import { __ } from '@wordpress/i18n'
import { Icon } from '@wordpress/icons'
import classNames from 'classnames'

export const Nav = ({ pages, activePage, setActivePage, hideMenu }) => (
    <nav aria-labelledby="assist-landing-nav">
        <h2 id="assist-landing-nav" className="sr-only">
            {__('Assist navigation', 'extendify')}
        </h2>
        <ul className="space-x-1 flex flex-wrap lg:flex-nowrap rounded-t-sm overflow-hidden m-0 p-0 pb-2 lg:pb-0 lg-gap-1.5 bg-white bg-opacity-5 lg:bg-transparent">
            {pages.map((page) => (
                <li
                    className="list-none m-0 p-0 w-full lg:w-auto"
                    key={page.slug}>
                    <button
                        onClick={() => {
                            setActivePage(page.slug)
                            hideMenu()
                        }}
                        type="button"
                        aria-current={activePage === page.slug}
                        className={classNames(
                            'rounded-sm w-full px-3 lg:px-2 lg:pr-3 py-2 text-sm text-design-text whitespace-nowrap cursor-pointer flex gap-1.5 items-center focus:outline-none focus:bg-white focus:bg-opacity-20',
                            activePage === page.slug
                                ? 'bg-white bg-opacity-10 lg:bg-opacity-20'
                                : 'bg-transparent hover:bg-white hover:bg-opacity-10 lg:hover:bg-opacity-20',
                        )}>
                        {page.icon && (
                            <Icon
                                icon={page.icon}
                                className="fill-current flex"
                            />
                        )}
                        {page.name}
                    </button>
                </li>
            ))}
        </ul>
    </nav>
)
