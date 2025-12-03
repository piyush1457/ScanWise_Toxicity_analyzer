import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Check local storage or system preference on mount
        const savedTheme = localStorage.getItem('scanwise_theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('scanwise_theme', theme);
    }, [theme]);

    useEffect(() => {
        // Fetch user preference on login
        async function fetchUserTheme() {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();
                    // We need to import axios, but it's not imported. Let's use fetch or add import.
                    // Adding import is better.
                    // For now, let's assume we can add import in another step or use fetch.
                    // Let's use fetch to avoid import issues in this block, or just add import at top.
                    // I will add import in a separate step.
                    const res = await fetch("http://localhost:8000/users/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.theme_preference) {
                            setTheme(data.theme_preference);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch theme", err);
                }
            }
        }
        fetchUserTheme();
    }, [currentUser]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout,
        theme,
        toggleTheme
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
