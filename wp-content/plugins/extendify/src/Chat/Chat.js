import { useState } from '@wordpress/element'
import { ChatButton } from '@chat/components/ChatButton'
import { ChatDialog } from '@chat/components/ChatDialog'
import { motion, AnimatePresence } from 'framer-motion'

export const Chat = () => {
    const [showDialog, setShowDialog] = useState(false)

    return (
        <>
            <ChatButton
                showDialog={showDialog}
                onClick={() => setShowDialog(!showDialog)}
            />
            <AnimatePresence>
                {showDialog && (
                    <motion.div
                        key="chat-dialog"
                        className="fixed bottom-0 right-0 z-high"
                        initial={{ y: 15, opacity: 0 }}
                        exit={{ y: 15, opacity: 0 }}
                        transition={{
                            y: { duration: 0.25 },
                            opacity: { duration: 0.1 },
                        }}
                        animate={{ y: 0, opacity: 1 }}>
                        <ChatDialog />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
