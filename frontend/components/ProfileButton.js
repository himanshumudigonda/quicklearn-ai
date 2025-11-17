import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, RefreshCw } from 'lucide-react';
import useStore from '@/lib/store';
import { signInWithGoogle, signOut } from '@/lib/auth';
import { authAPI } from '@/lib/api';
import { avatarDataURI } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfileButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { user, nickname, avatarSeed, setNickname, setAvatarSeed } = useStore();

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      toast.success('Welcome to QuickLearn!', {
        icon: '🎉',
      });
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
    toast.success('Signed out successfully');
  };

  const handleRegenerateNickname = async () => {
    try {
      const response = await authAPI.regenerateNickname(user.uid);
      setNickname(response.data.nickname);
      toast.success('Nickname updated!', { icon: '✨' });
    } catch (error) {
      toast.error('Failed to regenerate nickname');
    }
  };

  const handleRegenerateAvatar = async () => {
    try {
      const response = await authAPI.regenerateAvatar(user.uid);
      setAvatarSeed(response.data.avatarSeed);
      toast.success('Avatar updated!', { icon: '🎨' });
    } catch (error) {
      toast.error('Failed to regenerate avatar');
    }
  };

  if (!user) {
    return (
      <motion.button 
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-2">
          {isSigningIn ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
              Signing in...
            </>
          ) : (
            <>
              <User className="w-5 h-5" />
              Sign in
            </>
          )}
        </span>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.img
          src={avatarDataURI(avatarSeed)}
          alt="Avatar"
          className="w-8 h-8 rounded-full"
          whileHover={{ rotate: 15 }}
          transition={{ duration: 0.3 }}
        />
        <span className="font-semibold text-gray-900 hidden sm:inline">{nickname}</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-gray-200 p-6 z-50 shadow-2xl"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <img
                    src={avatarDataURI(avatarSeed)}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full ring-2 ring-indigo-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">{nickname}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <motion.button
                  onClick={handleRegenerateNickname}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 flex items-center gap-3 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200">
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-900 font-medium">New Nickname</span>
                </motion.button>

                <motion.button
                  onClick={handleRegenerateAvatar}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 flex items-center gap-3 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200">
                    <RefreshCw className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-900 font-medium">New Avatar</span>
                </motion.button>

                <motion.button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 flex items-center gap-3 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-red-600 font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
