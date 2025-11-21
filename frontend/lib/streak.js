// Daily Streak Management
export const getStreak = (userId) => {
  if (!userId) return { currentStreak: 0, lastVisit: null, bestStreak: 0 };
  
  const key = `streak_${userId}`;
  const data = localStorage.getItem(key);
  
  if (!data) {
    return { currentStreak: 0, lastVisit: null, bestStreak: 0 };
  }
  
  return JSON.parse(data);
};

export const updateStreak = (userId) => {
  if (!userId) return { currentStreak: 0, bestStreak: 0 };
  
  const key = `streak_${userId}`;
  const now = new Date();
  const today = now.toDateString();
  
  const streakData = getStreak(userId);
  
  // Check if already learned today
  if (streakData.lastVisit === today) {
    return streakData;
  }
  
  const lastVisitDate = streakData.lastVisit ? new Date(streakData.lastVisit) : null;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newStreak;
  
  if (!lastVisitDate) {
    // First time
    newStreak = 1;
  } else if (lastVisitDate.toDateString() === yesterday.toDateString()) {
    // Consecutive day
    newStreak = streakData.currentStreak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }
  
  const bestStreak = Math.max(newStreak, streakData.bestStreak || 0);
  
  const newData = {
    currentStreak: newStreak,
    lastVisit: today,
    bestStreak
  };
  
  localStorage.setItem(key, JSON.stringify(newData));
  
  return newData;
};

export const getStreakEmoji = (streak) => {
  if (streak >= 100) return '🏆';
  if (streak >= 50) return '💎';
  if (streak >= 30) return '🔥';
  if (streak >= 14) return '⚡';
  if (streak >= 7) return '🌟';
  if (streak >= 3) return '✨';
  return '🎯';
};
