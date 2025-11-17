import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { authAPI } from '@/lib/api';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    
    // Call backend to get session token
    const response = await authAPI.login(idToken);
    const { sessionToken, nickname, avatarSeed } = response.data;
    
    // Update store
    useStore.getState().setUser(result.user);
    useStore.getState().setNickname(nickname);
    useStore.getState().setAvatarSeed(avatarSeed);
    useStore.getState().setSessionToken(sessionToken);
    
    toast.success(`Welcome, ${nickname}!`);
    return { success: true, user: result.user };
    
  } catch (error) {
    console.error('Sign in error:', error);
    toast.error('Failed to sign in. Please try again.');
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
