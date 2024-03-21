import UserLayout from "@/app/components/base-layout";
import AuthProvider from "@/providers/auth-provider";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <UserLayout>{children}</UserLayout>
        </AuthProvider>
    )
}
