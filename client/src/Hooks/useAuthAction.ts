import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuthAction = () => {
    const auth = useContext(AuthContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [actionText, setActionText] = useState("continue");

    const requireAuth = (action: () => void, actionName?: string): void => {
        if (auth?.user) {
            action();
        } else {
            setActionText(actionName || "continue");
            setShowLoginModal(true);
        }
    };

    return {
        isLoggedIn: !!auth?.user,
        user: auth?.user,
        requireAuth,
        showLoginModal,
        setShowLoginModal,
        actionText
    };
};