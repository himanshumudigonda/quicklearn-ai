import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, RefreshCw, Sparkles } from 'lucide-react';
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
        style: {
          background: '#8B5CF6',
          color: '#fff',
        }
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
        className="relative px-6 py-3 rounded-full font-semibold text-white overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-blue-500 transition-all"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
        <span className="relative z-10 flex items-center gap-2">
          {isSigningIn ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Signing in...
            </>
          ) : (
            <>
              <User className="w-5 h-5" />
              Sign in with Google
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
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-400/50 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.img
          src={avatarDataURI(avatarSeed)}
          alt="Avatar"
          className="w-10 h-10 rounded-full ring-2 ring-purple-400/50"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <span className="font-semibold text-white">{nickname}</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-0 mt-4 w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 p-6 z-50 shadow-2xl"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="relative">
                  <img
                    src={avatarDataURI(avatarSeed)}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full ring-2 ring-purple-400/50"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-black"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-lg">{nickname}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleRegenerateNickname}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 flex items-center gap-3 transition-all group"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30">
                    <RefreshCw className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white font-medium">New Nickname</span>
                </motion.button>

                <motion.button
                  onClick={handleRegenerateAvatar}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 flex items-center gap-3 transition-all group"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30">
                    <RefreshCw className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">New Avatar</span>
                </motion.button>

                <motion.button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-400/50 flex items-center gap-3 transition-all group"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30">
                    <LogOut className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-red-400 font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
