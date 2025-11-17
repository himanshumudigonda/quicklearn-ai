import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { authAPI } from '@/lib/api';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

export async function signInWithGoogle() {
  try {
    console.log('Starting Google Sign-in...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful, getting token...');
    
    const idToken = await result.user.getIdToken();
    console.log('Token obtained, calling backend...');
    
    // Call backend to get session token
    const response = await authAPI.login(idToken);
    const { sessionToken, nickname, avatarSeed } = response.data;
    
    console.log('Backend response received:', { nickname });
    
    // Update store
    useStore.getState().setUser(result.user);
    useStore.getState().setNickname(nickname);
    useStore.getState().setAvatarSeed(avatarSeed);
    useStore.getState().setSessionToken(sessionToken);
    
    toast.success(`Welcome, ${nickname}!`, {
      icon: '👋',
      style: {
        background: '#8B5CF6',
        color: '#fff',
      }
    });
    
    return { success: true, user: result.user };
    
  } catch (error) {
    console.error('Sign in error:', error);
    
    // Specific error messages
    let errorMessage = 'Failed to sign in. Please try again.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in cancelled';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup blocked. Please allow popups for this site.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized. Please contact support.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    useStore.getState().logout();
    toast.success('Signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error('Failed to sign out');
    return { success: false, error };
  }
}
