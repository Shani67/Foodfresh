import { render } from '@wordpress/element'
import { Chat } from '@chat/Chat'
import './app.css'

const chat = Object.assign(document.createElement('div'), {
    className: 'extendify-chat',
})
document.body.append(chat)
render(<Chat />, chat)
