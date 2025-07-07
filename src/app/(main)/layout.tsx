import * as React from 'react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    // This layout is now just for the public-facing pages like the landing page.
    // The AppProvider and sidebar are now in the dashboard layout.
    return <>{children}</>;
}
