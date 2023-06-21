import { Button, Spinner } from '@wordpress/components'
import {
    useRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
    useMemo,
} from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import { Icon, close } from '@wordpress/icons'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignColors } from '@assist/hooks/useDesignColors'
import { router } from '@assist/hooks/useRouter'
import { useGlobalSyncStore } from '@assist/state/GlobalSync'
import { useTasksStore } from '@assist/state/Tasks'
import { useTourStore } from '@assist/state/Tours'
import availableTours from '@assist/tours/tours.js'

const getBoundingClientRect = (element) => {
    const { top, right, bottom, left, width, height, x, y } =
        element.getBoundingClientRect()
    return { top, right, bottom, left, width, height, x, y }
}

export const GuidedTour = () => {
    const tourBoxRef = useRef()
    const {
        currentTour,
        currentStep,
        startTour,
        closeCurrentTour,
        getStepData,
        onTourPage,
    } = useTourStore()
    const { settings } = currentTour || {}
    const { image, title, text, attachTo, events, options } =
        getStepData(currentStep)

    const { queueTourForRedirect, queuedTour, clearQueuedTour } =
        useGlobalSyncStore()
    const { element, frame, offset, position, hook, boxPadding } =
        attachTo || {}

    const elementSelector = useMemo(
        () => (typeof element === 'function' ? element() : element),
        [element],
    )

    const frameSelector = useMemo(
        () => (typeof frame === 'function' ? frame() : frame),
        [frame],
    )

    const offsetNormalized = useMemo(
        () => (typeof offset === 'function' ? offset() : offset),
        [offset],
    )
    const hookNormalized = useMemo(
        () => (typeof hook === 'function' ? hook() : hook),
        [hook],
    )

    const [targetedElement, setTargetedElement] = useState(null)

    const initialFocus = useRef()
    const [redirecting, setRedirecting] = useState(false)
    const [visible, setVisible] = useState(false)

    const [overlayRect, setOverlayRect] = useState(null)

    const [placement, setPlacement] = useState({
        x: undefined,
        y: undefined,
        ...offsetNormalized,
    })
    const setTourBox = useCallback(
        (x, y) => {
            // x is 20 on mobile, so exclude the offset here
            setPlacement(x === 20 ? { x, y } : { x, y, ...offsetNormalized })
        },
        [offsetNormalized],
    )
    const getOffset = useCallback(() => {
        const hooks = hookNormalized?.split(' ') || []
        return {
            x: hooks.includes('right') ? tourBoxRef.current?.offsetWidth : 0,
            y: hooks.includes('bottom') ? tourBoxRef.current?.offsetHeight : 0,
        }
    }, [hookNormalized])

    const startOrRecalc = useCallback(() => {
        if (!targetedElement) return

        const frame = frameSelector
            ? document.querySelector(frameSelector)?.contentDocument ?? document
            : document

        const rect = getBoundingClientRect(
            frame.querySelector(elementSelector) ?? targetedElement,
        )

        // Adjust the frame position if we're in an iframe
        if (frame !== document) {
            const frameRect = getBoundingClientRect(
                frame.defaultView.frameElement,
            )
            rect.x += frameRect.x
            rect.left += frameRect.x
            rect.right += frameRect.x
            rect.y += frameRect.y
            rect.top += frameRect.y
            rect.bottom += frameRect.y
        }

        if (window.innerWidth <= 960) {
            closeCurrentTour('closed-resize')
            return
        }
        if (position?.x === undefined) {
            setTourBox(undefined, undefined)
            setOverlayRect(null)
            setVisible(false)
            return
        }
        const x = rect?.[position.x] - getOffset().x
        const y = rect?.[position.y] - getOffset().y
        const box = tourBoxRef.current
        // make sure it doesn't go off-screen
        setTourBox(
            Math.min(x, window.innerWidth - (box?.offsetWidth ?? 0) - 20),
            Math.min(y, window.innerHeight - (box?.offsetHeight ?? 0) - 20),
        )
        setOverlayRect(rect)
    }, [
        targetedElement,
        position,
        getOffset,
        setTourBox,
        frameSelector,
        elementSelector,
        closeCurrentTour,
    ])

    // Pre-launch check whether to redirect
    useLayoutEffect(() => {
        // if the tour has a start from url, redirect there
        if (!settings?.startFrom) return
        if (onTourPage()) return
        setRedirecting(true)
        queueTourForRedirect(currentTour.id)
        closeCurrentTour('redirected')
        window.location.assign(settings?.startFrom[0])
        if (
            window.location.href.split('#')[0] ===
            settings.startFrom[0].split('#')[0]
        ) {
            // Reload if hash is the only difference
            window.location.reload()
        }
    }, [
        settings?.startFrom,
        currentTour,
        queueTourForRedirect,
        closeCurrentTour,
        onTourPage,
    ])

    // Possibly start the tour, or wait for the load event
    useLayoutEffect(() => {
        if (redirecting) return
        const tour = queuedTour
        let rafId = 0
        if (!tour || !availableTours[tour]) return clearQueuedTour()
        const handle = () => {
            requestAnimationFrame(() => {
                startTour(availableTours[tour])
            })
            clearQueuedTour()
        }

        addEventListener('load', handle)
        if (document.readyState === 'complete') {
            // Page is already loaded, so we can start the tour immediately
            rafId = requestAnimationFrame(handle)
        }
        return () => {
            cancelAnimationFrame(rafId)
            removeEventListener('load', handle)
        }
    }, [startTour, queuedTour, clearQueuedTour, redirecting])

    useEffect(() => {
        // Find and set the element we are attaching to
        const frame = frameSelector
            ? document.querySelector(frameSelector)?.contentDocument ?? document
            : document
        const element = frame.querySelector(elementSelector)

        if (!element) return
        setTargetedElement(element)
        return () => setTargetedElement(null)
    }, [frameSelector, elementSelector])

    // Start building the tour step
    useLayoutEffect(() => {
        if (!targetedElement || redirecting) return
        setVisible(true)
        startOrRecalc()
        addEventListener('resize', startOrRecalc)
        targetedElement.style.pointerEvents = 'none'
        return () => {
            removeEventListener('resize', startOrRecalc)
            targetedElement.style.pointerEvents = 'auto'
        }
    }, [redirecting, targetedElement, startOrRecalc])

    // Handle the attach and detach events
    useEffect(() => {
        if (currentStep === undefined || !targetedElement) return
        events?.onAttach?.(targetedElement)
        let inner = 0
        const id = requestAnimationFrame(() => {
            inner = requestAnimationFrame(startOrRecalc)
        })
        return () => {
            events?.onDetach?.(targetedElement)
            cancelAnimationFrame(id)
            cancelAnimationFrame(inner)
        }
    }, [currentStep, events, targetedElement, startOrRecalc])

    useLayoutEffect(() => {
        if (!settings?.allowOverflow) return
        document.documentElement.classList.add('ext-force-overflow-auto')
        return () => {
            document.documentElement.classList.remove('ext-force-overflow-auto')
        }
    }, [settings])

    useEffect(() => {
        // This closes the tour if the user switches tabs
        // (likely by pressing the browser back button)
        const stopTheTour = () => closeCurrentTour('assist-route-change')
        router.onRouteChange(stopTheTour)
        return () => router.removeOnRouteChange(stopTheTour)
    }, [closeCurrentTour])

    if (!visible) return null

    const rectWithPadding = addPaddingToRect(overlayRect, boxPadding)
    return (
        <>
            <AnimatePresence>
                {Boolean(currentTour) && (
                    <Dialog
                        as={motion.div}
                        static
                        initialFocus={initialFocus}
                        className="extendify-assist"
                        open={Boolean(currentTour)}
                        onClose={() => undefined}>
                        <div className="relative z-max">
                            <motion.div
                                ref={tourBoxRef}
                                animate={{ opacity: 1, ...placement }}
                                initial={{ opacity: 0, ...placement }}
                                // TODO: fire another event after animation completes?
                                onAnimationComplete={() => {
                                    startOrRecalc()
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeInOut',
                                }}
                                className="fixed top-0 left-0 shadow-2xl sm:overflow-hidden bg-transparent flex flex-col max-w-xs z-20"
                                style={{
                                    minWidth: settings?.minBoxWidth ?? '325px',
                                }}>
                                <button
                                    data-test="close-tour"
                                    className="absolute bg-white cursor-pointer flex ring-gray-200 ring-1 focus:ring-wp focus:ring-design-main focus:shadow-none h-6 items-center justify-center leading-none m-2 outline-none p-0 right-0 rounded-full top-0 w-6 border-0 z-20"
                                    onClick={() =>
                                        closeCurrentTour('closed-manually')
                                    }
                                    aria-label={__('Close Modal', 'extendify')}>
                                    <Icon icon={close} className="w-4 h-4" />
                                </button>
                                <Dialog.Title className="sr-only">
                                    {currentTour?.title ??
                                        __('Tour', 'extendify')}
                                </Dialog.Title>
                                {image && (
                                    <div
                                        className="w-full p-6"
                                        style={{
                                            minHeight: 150,
                                            background:
                                                'linear-gradient(58.72deg, #485563 7.71%, #29323C 92.87%)',
                                        }}>
                                        <img
                                            src={image}
                                            className="w-full block"
                                            alt={title}
                                        />
                                    </div>
                                )}
                                <div className="m-0 p-6 pt-0 text-left relative bg-white">
                                    {title && (
                                        <h2 className="text-xl font-medium mb-2">
                                            {title}
                                        </h2>
                                    )}
                                    {text && <p className="mb-6">{text}</p>}
                                    <BottomNav initialFocus={initialFocus} />
                                </div>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
            {options?.blockPointerEvents && (
                <div aria-hidden={true} className="fixed inset-0 z-max-1" />
            )}
            <AnimatePresence>
                {Boolean(currentTour) && overlayRect?.left !== undefined && (
                    <>
                        <motion.div
                            initial={{
                                opacity: 0,
                                clipPath:
                                    'polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%, 0 0)',
                            }}
                            animate={{
                                opacity: 1,
                                clipPath: `polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%, 0 0, ${rectWithPadding.left}px 0, ${rectWithPadding.left}px ${rectWithPadding?.bottom}px, ${rectWithPadding?.right}px ${rectWithPadding.bottom}px, ${rectWithPadding.right}px ${rectWithPadding.top}px, ${rectWithPadding.left}px ${rectWithPadding.top}px)`,
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="hidden lg:block fixed inset-0 bg-black bg-opacity-70 z-max-1"
                            aria-hidden="true"
                        />
                        <motion.div
                            initial={{
                                opacity: 0,
                                ...(rectWithPadding ?? {}),
                            }}
                            animate={{
                                opacity: 1,
                                ...(rectWithPadding ?? {}),
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="hidden lg:block fixed inset-0 border-2 border-design-main z-high"
                            aria-hidden="true"
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

const BottomNav = ({ initialFocus }) => {
    const {
        goToStep,
        completeCurrentTour,
        currentStep,
        preparingStep,
        getStepData,
        hasNextStep,
        nextStep,
        hasPreviousStep,
        prevStep,
        currentTour,
    } = useTourStore()
    const { options = {} } = getStepData(currentStep)
    const { hideBackButton = false } = options
    const { id, steps, settings } = currentTour || {}
    const { mainColor } = useDesignColors()
    const { completeTask } = useTasksStore()

    return (
        <div
            id="extendify-tour-navigation"
            className="flex justify-between items-center w-full">
            <div className="flex-1 flex justify-start">
                <AnimatePresence>
                    {hasPreviousStep() && !hideBackButton && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}>
                            <button
                                className="flex gap-2 p-0 h-8 rounded-sm items-center justify-center bg-transparent hover:bg-transparent focus:outline-none ring-design-main focus:ring-wp focus:ring-offset-1 focus:ring-offset-white text-gray-900 disabled:opacity-60"
                                onClick={prevStep}
                                disabled={preparingStep > -1}>
                                {preparingStep < currentStep && (
                                    <Spinner
                                        style={{
                                            color: mainColor,
                                            margin: 0,
                                            height: '1em',
                                        }}
                                    />
                                )}
                                {__('Back', 'extendify')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {steps?.length > 2 && !settings?.hideDotsNav ? (
                <nav
                    role="navigation"
                    aria-label={__('Tour Steps', 'extendify')}
                    className="flex-1 flex items-center justify-center gap-1 transform -translate-x-3">
                    {steps.map((_step, index) => (
                        <div key={index}>
                            <button
                                style={{
                                    backgroundColor:
                                        index === currentStep
                                            ? mainColor
                                            : undefined,
                                }}
                                aria-label={sprintf(
                                    __('%s of %s', 'extendify'),
                                    index + 1,
                                    steps.length,
                                )}
                                aria-current={index === currentStep}
                                className={`focus:ring-wp focus:outline-none ring-offset-1 ring-offset-white focus:ring-design-main block cursor-pointer w-2.5 h-2.5 m-0 p-0 rounded-full ${
                                    index === currentStep
                                        ? 'bg-design-main'
                                        : 'bg-gray-300'
                                }`}
                                onClick={() => goToStep(index)}
                                disabled={preparingStep > -1}
                            />
                        </div>
                    ))}
                </nav>
            ) : null}

            <div className="flex-1 flex justify-end">
                {hasNextStep() ? (
                    <Button
                        ref={initialFocus}
                        id="assist-tour-next-button"
                        data-test="assist-tour-next-button"
                        onClick={nextStep}
                        disabled={preparingStep > -1}
                        style={{
                            backgroundColor: mainColor,
                        }}
                        className="flex gap-2 text-design-text focus:text-design-text disabled:opacity-60"
                        variant="primary">
                        {preparingStep > currentStep && (
                            <Spinner
                                style={{
                                    color: mainColor,
                                    margin: 0,
                                    height: '1em',
                                }}
                            />
                        )}
                        {__('Next', 'extendify')}
                    </Button>
                ) : (
                    <Button
                        id="assist-tour-next-button"
                        data-test="assist-tour-next-button"
                        onClick={() => {
                            completeTask(id)
                            completeCurrentTour()
                        }}
                        style={{
                            backgroundColor: mainColor,
                        }}
                        variant="primary">
                        {__('Done', 'extendify')}
                    </Button>
                )}
            </div>
        </div>
    )
}

const addPaddingToRect = (rect, padding) => ({
    top: rect.top - (padding?.top ?? 0),
    left: rect.left - (padding?.left ?? 0),
    right: rect.right + (padding?.right ?? 0),
    bottom: rect.bottom + (padding?.bottom ?? 0),
    width: rect.width + (padding?.left ?? 0) + (padding?.right ?? 0),
    height: rect.height + (padding?.top ?? 0) + (padding?.bottom ?? 0),
    x: rect.x - (padding?.left ?? 0),
    y: rect.y - (padding?.top ?? 0),
})
