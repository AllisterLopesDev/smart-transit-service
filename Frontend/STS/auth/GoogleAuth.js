import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';

const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '299414539953-bvnqviuhikfsojv3ns5glopqnhgvpd8m.apps.googleusercontent.com',
      offlineAccess: true,
    });
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await getCurrentUser();
      }
    } catch (err) {
      console.error('Check user error:', err);
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await GoogleSignin.signInSilently();
      setUser(currentUser);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        setUser(null);
      } else {
        console.error('Silent sign-in error:', error);
      }
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
      const tokens = await GoogleSignin.getTokens();
      console.log('Tokens:', tokens);
    } catch (error) {
      setError(error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Sign-in error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return { user, loading, error, signIn, signOut };
};

export default useGoogleAuth;
