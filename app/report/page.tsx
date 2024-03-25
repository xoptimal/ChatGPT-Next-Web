
import dynamic from 'next/dynamic'

const NoSSR = dynamic(() => import('./content'), { ssr: false })

export default function Page() {
    return (
        <NoSSR />
    )
}
