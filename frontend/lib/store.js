import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // User state
      user: null,
      nickname: null,
      avatarSeed: null,
      sessionToken: null,
      
      setUser: (user) => set({ user }),
      setNickname: (nickname) => set({ nickname }),
      setAvatarSeed: (avatarSeed) => set({ avatarSeed }),
      setSessionToken: (token) => {
        if (token) {
          localStorage.setItem('session_token', token);
        } else {
          localStorage.removeItem('session_token');
        }
        set({ sessionToken: token });
      },
      
      logout: () => set({
        user: null,
        nickname: null,
        avatarSeed: null,
        sessionToken: null,
      }),

      // Current explanation state
      currentExplanation: null,
      currentTopic: null,
      isLoading: false,
      
      setCurrentExplanation: (explanation) => set({ currentExplanation: explanation }),
      setCurrentTopic: (topic) => set({ currentTopic: topic }),
      setIsLoading: (isLoading) => set({ isLoading }),

      // Favorites (local only)
      favorites: [],
      addFavorite: (topic, explanation) =>
        set((state) => ({
          favorites: [...state.favorites, { topic, explanation, timestamp: Date.now() }],
        })),
      removeFavorite: (topic) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.topic !== topic),
        })),
      isFavorite: (topic) => {
        const state = useStore.getState();
        return state.favorites.some((f) => f.topic === topic);
      },
    }),
    {
      name: 'quicklearn-storage',
      partialize: (state) => ({
        nickname: state.nickname,
        avatarSeed: state.avatarSeed,
        sessionToken: state.sessionToken,
        favorites: state.favorites,
      }),
    }
  )
);

export default useStore;
