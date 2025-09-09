'use client';

import { useState, useEffect } from 'react';

interface ConnectionInfo {
    effectiveType: string;
    downlink: number;
    saveData: boolean;
}

export function useConnection() {
    const [connection, setConnection] = useState<ConnectionInfo | null>(null);

    useEffect(() => {
        // Check if the browser supports the Network Information API
        if ('connection' in navigator) {
            const conn = (navigator as any).connection;
            
            const updateConnection = () => {
                setConnection({
                    effectiveType: conn.effectiveType || '4g',
                    downlink: conn.downlink || 10,
                    saveData: conn.saveData || false
                });
            };

            updateConnection();
            conn.addEventListener('change', updateConnection);

            return () => conn.removeEventListener('change', updateConnection);
        } else {
            // Fallback for browsers that don't support the API
            setConnection({
                effectiveType: '4g',
                downlink: 10,
                saveData: false
            });
        }
    }, []);

    return connection;
}
