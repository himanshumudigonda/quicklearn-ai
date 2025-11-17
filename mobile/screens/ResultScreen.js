import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speakText, stopSpeech } from '../lib/tts';
import { saveFavorite, removeFavorite, getFavorites } from '../lib/database';

export default function ResultScreen({ route }) {
  const { topic, content } = route.params;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSpeak = async () => {
    if (isSpeaking) {
      await stopSpeech();
      setIsSpeaking(false);
    } else {
      const text = `${topic}. ${content.one_line}. ${content.explanation}. ${content.analogy}. ${content.example}.`;
      await speakText(text);
      setIsSpeaking(true);
      
      // Reset after speaking
      setTimeout(() => setIsSpeaking(false), text.length * 50);
    }
  };

  const handleShare = async () => {
    try {
      const message = `${topic.toUpperCase()}\n\n${content.one_line}\n\n${content.explanation}\n\nFrom QuickLearn AI`;
      await Share.share({ message });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(topic);
        setIsFavorite(false);
        Alert.alert('Removed', 'Removed from favorites');
      } else {
        await saveFavorite(topic, content);
        setIsFavorite(true);
        Alert.alert('Saved', 'Added to favorites!');
      }
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.topic}>{topic}</Text>
        {content.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Definition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEFINITION</Text>
          <Text style={styles.oneLine}>{content.one_line}</Text>
        </View>

        {/* Explanation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPLANATION</Text>
          <Text style={styles.text}>{content.explanation}</Text>
        </View>

        {/* Analogy */}
        <View style={[styles.section, styles.analogySection]}>
          <Text style={styles.sectionTitle}>💡 ANALOGY</Text>
          <Text style={[styles.text, styles.italic]}>{content.analogy}</Text>
        </View>

        {/* Example */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXAMPLE</Text>
          <Text style={styles.text}>{content.example}</Text>
        </View>

        {/* Formula */}
        {content.formula && (
          <View style={[styles.section, styles.formulaSection]}>
            <Text style={styles.sectionTitle}>FORMULA</Text>
            <Text style={styles.formula}>{content.formula}</Text>
          </View>
        )}

        {/* Revision Note */}
        <View style={[styles.section, styles.revisionSection]}>
          <Text style={styles.sectionTitle}>⚡ 10-SECOND REVISION</Text>
          <Text style={styles.revisionText}>{content.revision_note}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSpeak}
        >
          <Ionicons
            name={isSpeaking ? 'volume-mute' : 'volume-high'}
            size={24}
            color="#FFA000"
          />
          <Text style={styles.actionText}>
            {isSpeaking ? 'Stop' : 'Read Aloud'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={24} color="#FFA000" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFavorite}
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={24}
            color="#FFA000"
          />
          <Text style={styles.actionText}>
            {isFavorite ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  topic: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFA000',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  oneLine: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    lineHeight: 26,
  },
  text: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
  italic: {
    fontStyle: 'italic',
  },
  analogySection: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
  },
  formulaSection: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
  },
  formula: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#212121',
  },
  revisionSection: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  revisionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
});
