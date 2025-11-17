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
  const { user, nickname, avatarSeed, setNickname, setAvatarSeed } = useStore();

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
  };

  const handleRegenerateNickname = async () => {
    try {
      const response = await authAPI.regenerateNickname(user.uid);
      setNickname(response.data.nickname);
      toast.success('Nickname updated!');
    } catch (error) {
      toast.error('Failed to regenerate nickname');
    }
  };

  const handleRegenerateAvatar = async () => {
    try {
      const response = await authAPI.regenerateAvatar(user.uid);
      setAvatarSeed(response.data.avatarSeed);
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to regenerate avatar');
    }
  };

  if (!user) {
    return (
      <button onClick={handleSignIn} className="btn-primary flex items-center gap-2">
        <User className="w-4 h-4" />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 p-2 pr-4 rounded-full bg-white border-2 border-primary-200 hover:border-primary-400 transition-all"
      >
        <img
          src={avatarDataURI(avatarSeed)}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-medium text-neutral-900">{nickname}</span>
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 z-50"
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <img
                src={avatarDataURI(avatarSeed)}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="font-bold text-neutral-900">{nickname}</p>
                <p className="text-sm text-neutral-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRegenerateNickname}
                className="w-full btn-secondary flex items-center gap-2 justify-center text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                New Nickname
              </button>

              <button
                onClick={handleRegenerateAvatar}
                className="w-full btn-secondary flex items-center gap-2 justify-center text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                New Avatar
              </button>

              <button
                onClick={handleSignOut}
                className="w-full btn-secondary flex items-center gap-2 justify-center text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
}
