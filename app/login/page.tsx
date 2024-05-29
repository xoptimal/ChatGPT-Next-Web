import dynamic from 'next/dynamic'

const NoSSR = dynamic(() => import('./components/Login'), { ssr: false })

export default function Page() {
    return (
        <NoSSR />
    )
}
