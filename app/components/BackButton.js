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
        <div className="fixed top-0 left-0 m-2 z-40">
            <RippleButton
                onClick={handleBack}
                className={`flex items-center gap-2 px-3 py-1 rounded-3xl backdrop-blur-xl backdrop-saturate-50 bg-neutral-300/50 shadow-md text-paragraph ${canGoBack ? "" : "opacity-50 cursor-not-allowed"
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
