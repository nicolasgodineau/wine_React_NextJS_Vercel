"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RippleButton from "./RippleButton";
import ArrowBackSvg from "@components/icons/ArrowBackSvg";

export default function BackButton({ className = "", effectWidth = "50px" }) {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        // Vérifie si l'utilisateur peut revenir en arrière
        setCanGoBack(window.history.length > 1);
    }, []);

    const handleBack = () => {
        if (canGoBack) {
            router.back();
        }
    };

    return (
        <div className="fixed top-0 left-0 m-2">
            <RippleButton
                onClick={handleBack}
                className={`flex items-center gap-2 px-4 py-2 bg-neutral-300/50 backdrop-blur-xl shadow-lg rounded-full ${canGoBack ? "" : "opacity-50 cursor-not-allowed"
                    } ${className}`}
                effectWidth={50}
                effectHeight={50}
                disabled={!canGoBack}
            >
                {/*             <ArrowBackSvg width="24px" height="24px" fill="#4c0519" />
 */}            Retour
            </RippleButton>
        </div>
    );
}
