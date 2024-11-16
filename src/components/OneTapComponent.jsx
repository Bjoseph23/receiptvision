import React, { useEffect } from 'react';
import supabase from './supabaseClient'; // Import Supabase client

const OneTapComponent = () => {
    useEffect(() => {
        /* global google */
        window.google?.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
        });

        window.google?.accounts.id.prompt();
    }, []);

    const handleGoogleResponse = async (response) => {
        const { credential } = response;

        // Exchange the credential with Supabase for authentication
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: credential,
        });

        if (error) {
            console.error('Error during Google One Tap sign-in', error.message);
            return;
        }

        const { email, name, id } = data.user;

        // Insert or Upsert user data in the 'user' table
        const { error: dbError } = await supabase
            .from('user')
            .upsert({ id, email, name }, { onConflict: ['id'] });

        if (dbError) {
            console.error('Error upserting user data', dbError.message);
        }

        // Redirect to dashboard or some other page
        window.location.href = '/dashboard';
    };

    return null;
};

export default OneTapComponent;
