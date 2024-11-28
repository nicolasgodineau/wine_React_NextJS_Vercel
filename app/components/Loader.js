'use client';

export default function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-xl text-primary">Chargement...</p>
            </div>
        </div>
    );
}
