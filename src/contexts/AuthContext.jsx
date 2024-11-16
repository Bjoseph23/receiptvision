import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../components/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (data) => {
        const { user, error } = await supabase.auth.signUp(data);
        if (error) throw error;
        if (user) {
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ id: user.id, email: user.email, name: data.options.data.name }]); // Adjusted
            if (insertError) throw insertError;
        }
        return user;
    };

    const value = {
        signUp,
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => {
            supabase.auth.signOut();
            setUser(null);
            navigate('/login');
        },
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
