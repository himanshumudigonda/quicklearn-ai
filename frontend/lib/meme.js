// Generate meme-style explanation
export const generateMeme = (topic, content) => {
  const memeTemplates = [
    {
      name: 'drake',
      top: 'Traditional boring textbooks',
      bottom: `${topic} explained by QuickLearn AI`
    },
    {
      name: 'distracted-boyfriend',
      description: `When you discover ${topic} is actually this cool: ${content.one_line}`
    },
    {
      name: 'expanding-brain',
      levels: [
        'Not knowing anything',
        'Reading about ' + topic,
        'Understanding the analogy',
        content.one_line
      ]
    }
  ];
  
  return memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
};

// Simple meme text overlay generator
export const createMemeText = (topic, content) => {
  const styles = [
    {
      title: `Nobody:`,
      subtitle: `${topic}: ${content.one_line}`
    },
    {
      title: `Me trying to explain ${topic}`,
      subtitle: `Also me: ${content.analogy}`
    },
    {
      title: `${topic} be like:`,
      subtitle: content.one_line
    }
  ];
  
  return styles[Math.floor(Math.random() * styles.length)];
};
