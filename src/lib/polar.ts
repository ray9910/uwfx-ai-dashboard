
'use server';

import type { PolarProduct } from '@/types';

export async function getProducts(): Promise<PolarProduct[]> {
    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    const organizationId = process.env.POLAR_ORGANIZATION_ID;

    if (!accessToken || !organizationId) {
        throw new Error('Polar environment variables (POLAR_ACCESS_TOKEN, POLAR_ORGANIZATION_ID) are not set.');
    }

    try {
        const response = await fetch(`https://api.polar.sh/v1/products?organization_id=${organizationId}&is_recurring=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Polar API Error:', errorBody);
            throw new Error(`Failed to fetch products from Polar. Status: ${response.status}`);
        }

        const data = await response.json();
        
        // The products are in the 'items' array of the response
        if (!data.items || !Array.isArray(data.items)) {
            console.warn('Polar API response did not contain an "items" array.');
            return [];
        }

        return data.items;
    } catch (error) {
        console.error('An unexpected error occurred while fetching Polar products:', error);
        // Re-throw the error to be handled by the calling component
        throw error;
    }
}
