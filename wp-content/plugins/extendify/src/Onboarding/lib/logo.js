import { uploadMedia } from '@wordpress/media-utils'
import { getFilename } from '@wordpress/url'
import { getOption, updateOption } from '@onboarding/api/WPApi'

export const uploadLogo = async (url) => {
    await getOption('site_logo').then(async (id) => {
        if (!parseInt(id)) {
            const name = getFilename(url) ?? 'default-logo.png'
            const blob = await (await fetch(url)).blob()

            await uploadMedia({
                filesList: [
                    new File([blob], name, {
                        type: 'image/x-png',
                    }),
                ],
                onFileChange: async ([fileObj]) => {
                    if (fileObj.id) {
                        await updateOption('site_logo', fileObj.id)
                    }
                },
                onError: console.error,
            })
        }
    })
}
