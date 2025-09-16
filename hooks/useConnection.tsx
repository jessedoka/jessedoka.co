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
            
            setConnection({
                effectiveType: '4g',
                downlink: 10,
                saveData: false
            });
        }
    }, []);

    return connection;
}
