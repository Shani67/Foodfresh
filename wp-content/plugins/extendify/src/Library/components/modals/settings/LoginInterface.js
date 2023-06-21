import { Spinner, Button } from '@wordpress/components'
import { safeHTML } from '@wordpress/dom'
import { useState, useEffect, useRef } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { Icon } from '@wordpress/icons'
import classNames from 'classnames'
import { User as UserApi } from '@library/api/User'
import { useIsDevMode } from '@library/hooks/helpers'
import { useUserStore } from '@library/state/User'
import { user } from '../../icons'
import { success as successIcon } from '../../icons'

export default function LoginInterface({ actionCallback, initialFocus }) {
    const loggedIn = useUserStore((state) => state.apiKey.length)
    const [email, setEmail] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [feedback, setFeedback] = useState('')
    const [feedbackType, setFeedbackType] = useState('info')
    const [isWorking, setIsWorking] = useState(false)
    const [success, setSuccess] = useState(false)
    const viewPatternsButtonRef = useRef(null)
    const licenseKeyRef = useRef(null)
    const devMode = useIsDevMode()

    useEffect(() => {
        setEmail(useUserStore.getState().email)
        // This will reset the default error state to info
        return () => setFeedbackType('info')
    }, [])

    useEffect(() => {
        success && viewPatternsButtonRef?.current?.focus()
    }, [success])

    const logout = () => {
        setApiKey('')
        useUserStore.setState({ apiKey: '' })
        setTimeout(() => {
            licenseKeyRef?.current?.focus()
        }, 0)
    }

    const confirmKey = async (event) => {
        event.preventDefault()
        setIsWorking(true)
        setFeedback('')
        const { token, error, exception, message } = await UserApi.authenticate(
            email,
            apiKey,
        )

        if (typeof message !== 'undefined') {
            setFeedbackType('error')
            setIsWorking(false)
            setFeedback(
                message?.length
                    ? message
                    : 'Error: Are you interacting with the wrong server?',
            )
            return
        }

        if (error || exception) {
            setFeedbackType('error')
            setIsWorking(false)
            setFeedback(error?.length ? error : exception)
            return
        }

        if (!token || typeof token !== 'string') {
            setFeedbackType('error')
            setIsWorking(false)
            setFeedback(__('Something went wrong', 'extendify'))
            return
        }

        setFeedbackType('success')
        setFeedback('Success!')
        setSuccess(true)
        setIsWorking(false)
        useUserStore.setState({
            email: email,
            apiKey: token,
        })
    }

    if (success) {
        return (
            <section className="space-y-6 p-6 text-center flex flex-col items-center">
                <Icon icon={successIcon} size={148} />
                <p className="text-center text-lg font-semibold m-0 text-extendify-black">
                    {sprintf(
                        // translators: %s: The name of the plugin, Extendify.
                        __("You've signed in to %s", 'extendify'),
                        'Extendify',
                    )}
                </p>
                <Button
                    ref={viewPatternsButtonRef}
                    className="cursor-pointer rounded bg-extendify-main p-2 px-4 text-center text-white"
                    onClick={actionCallback}>
                    {__('View patterns', 'extendify')}
                </Button>
            </section>
        )
    }

    if (loggedIn) {
        return (
            <section className="w-full space-y-6 p-6">
                <p className="text-base m-0 text-extendify-black">
                    {__('Account', 'extendify')}
                </p>
                <div className="flex items-center justify-between">
                    <div className="-ml-2 flex items-center space-x-2">
                        <Icon icon={user} size={48} />
                        <p className="text-extendify-black">
                            {email?.length
                                ? email
                                : __('Logged In', 'extendify')}
                        </p>
                    </div>
                    {devMode && (
                        <Button
                            className="cursor-pointer rounded bg-extendify-main px-4 py-3 text-center text-white hover:bg-extendify-main-dark"
                            onClick={logout}>
                            {__('Sign out', 'extendify')}
                        </Button>
                    )}
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-6 p-6 text-left">
            <div>
                <p className="text-center text-lg font-semibold m-0 text-extendify-black">
                    {__('Sign in to Extendify', 'extendify')}
                </p>
                <p
                    className="space-x-1 text-center text-sm m-0 text-extendify-gray"
                    dangerouslySetInnerHTML={{
                        __html: safeHTML(
                            sprintf(
                                // translators: %s: The partners@extendify.com email address.
                                __(
                                    "Don't have an account? Ask your hosting provider to reach out to %s.",
                                    'extendify',
                                ),
                                '<a href="mailto:partners@extendify.com">partners@extendify.com</a>',
                            ),
                        ),
                    }}
                />
            </div>
            <form
                onSubmit={confirmKey}
                className="flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center">
                    <label className="sr-only" htmlFor="extendify-login-email">
                        {__('Email address', 'extendify')}
                    </label>
                    <input
                        ref={initialFocus}
                        id="extendify-login-email"
                        name="extendify-login-email"
                        style={{ minWidth: '320px' }}
                        type="email"
                        className="w-full rounded border-2 p-2"
                        placeholder={__('Email address', 'extendify')}
                        value={email.length ? email : ''}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <label
                        className="sr-only"
                        htmlFor="extendify-login-license">
                        {__('License key', 'extendify')}
                    </label>
                    <input
                        ref={licenseKeyRef}
                        id="extendify-login-license"
                        name="extendify-login-license"
                        style={{ minWidth: '320px' }}
                        type="text"
                        className="w-full rounded border-2 p-2"
                        placeholder={__('License key', 'extendify')}
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                    />
                </div>
                <div className="flex justify-center pt-2">
                    <button
                        type="submit"
                        className="relative flex w-72 max-w-full cursor-pointer justify-center rounded bg-extendify-main p-2 py-3 text-center text-base text-white hover:bg-extendify-main-dark ">
                        <span>{__('Sign in', 'extendify')}</span>
                        {isWorking && (
                            <div className="absolute right-2.5">
                                <Spinner />
                            </div>
                        )}
                    </button>
                </div>
                {feedback && (
                    <div
                        className={classNames({
                            'border-gray-900 text-gray-900':
                                feedbackType === 'info',
                            'border-wp-alert-red text-wp-alert-red':
                                feedbackType === 'error',
                            'border-extendify-main text-extendify-main':
                                feedbackType === 'success',
                        })}>
                        {feedback}
                    </div>
                )}
            </form>
        </section>
    )
}
