import BaseLayout from "@/app/components/base-layout";
import ExContent from "@/app/components/ExContent";
import AuthProvider from "@/providers/auth-provider";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <BaseLayout hideContainer>
          <AuthProvider>
              <ExContent>{children}</ExContent>
          </AuthProvider>
        </BaseLayout>
    )
}
