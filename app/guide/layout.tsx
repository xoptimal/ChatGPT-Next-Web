import UserLayout from "@/app/components/base-layout";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <UserLayout>{children}</UserLayout>
    )
}
