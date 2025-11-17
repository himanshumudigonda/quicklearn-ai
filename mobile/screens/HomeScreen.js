import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { explainAPI, topicsAPI } from '../lib/api';
import { initDatabase, cacheExplanation, getCachedExplanation } from '../lib/database';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [popularTopics, setPopularTopics] = useState([]);

  useEffect(() => {
    initDatabase();
    loadPopularTopics();
  }, []);

  const loadPopularTopics = async () => {
    try {
      const data = await topicsAPI.popular(12);
      setPopularTopics(data.topics);
    } catch (error) {
      console.error('Failed to load popular topics:', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // Check cache first
      let result = await getCachedExplanation(query);

      if (!result) {
        // Fetch from API
        const data = await explainAPI.explain(query);
        result = data.content;
        
        // Cache the result
        await cacheExplanation(query, result);
      }

      navigation.navigate('Result', {
        topic: query,
        content: result,
      });
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to get explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = async (topic) => {
    setQuery(topic);
    // Trigger search immediately
    setLoading(true);
    try {
      const data = await explainAPI.explain(topic);
      navigation.navigate('Result', {
        topic,
        content: data.content,
      });
    } catch (error) {
      console.error('Topic click error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learn anything in</Text>
        <Text style={styles.titleHighlight}>1 minute</Text>
        <Text style={styles.subtitle}>
          Get instant, concise explanations
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ask anything..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="search" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Suggestion Chips */}
      <View style={styles.chipsContainer}>
        {['Photosynthesis', 'Blockchain', 'DNA', 'Gravity'].map((topic) => (
          <TouchableOpacity
            key={topic}
            style={styles.chip}
            onPress={() => setQuery(topic)}
          >
            <Text style={styles.chipText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popular Topics */}
      <View style={styles.popularSection}>
        <View style={styles.popularHeader}>
          <Ionicons name="trending-up" size={20} color="#FFA000" />
          <Text style={styles.popularTitle}>Popular Topics</Text>
        </View>

        <View style={styles.topicsGrid}>
          {popularTopics.map((topic) => (
            <TouchableOpacity
              key={topic.topic}
              style={styles.topicCard}
              onPress={() => handleTopicClick(topic.topic)}
            >
              <Text style={styles.topicText}>{topic.topic}</Text>
              <Text style={styles.topicViews}>{topic.uses} views</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Profile Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-circle" size={24} color="#666" />
        <Text style={styles.profileText}>Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
  },
  titleHighlight: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFA000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchButton: {
    backgroundColor: '#FFA000',
    borderRadius: 12,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
  },
  chipText: {
    color: '#666',
    fontSize: 14,
  },
  popularSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  topicsGrid: {
    gap: 12,
  },
  topicCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    textTransform: 'capitalize',
  },
  topicViews: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
  },
  profileText: {
    fontSize: 16,
    color: '#666',
  },
});
