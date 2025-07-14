
import { AppProvider } from '@/context/app-provider';

export default function PaywallLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    )
}
