'use client';

import { createContext, useContext, useState } from 'react';
import Loader from '../components/Loader'; // Fix import path for Loader component

const LoadingContext = createContext({
    isLoading: false,
    setIsLoading: () => {},
});

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
            {isLoading && <Loader />}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    return useContext(LoadingContext);
}
