import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFavorites } from '../lib/database';
import { generateAvatarColor, formatTimeAgo } from '../lib/utils';

export default function ProfileScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const nickname = 'Turbo-Papaya-042'; // Replace with actual nickname from auth
  const avatarSeed = '12345';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const avatarColor = generateAvatarColor(avatarSeed);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>
            {nickname.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.subtitle}>Anonymous User</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="refresh" size={20} color="#666" />
            <Text style={styles.buttonText}>New Nickname</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="refresh" size={20} color="#666" />
            <Text style={styles.buttonText}>New Avatar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Favorites Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="star" size={20} color="#FFA000" />
          <Text style={styles.sectionTitle}>Favorites</Text>
        </View>

        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>No favorites yet</Text>
        ) : (
          favorites.map((fav) => (
            <TouchableOpacity
              key={fav.id}
              style={styles.favoriteCard}
              onPress={() =>
                navigation.navigate('Result', {
                  topic: fav.topic,
                  content: fav.content,
                })
              }
            >
              <Text style={styles.favoriteTitle}>{fav.topic}</Text>
              <Text style={styles.favoriteTime}>
                {formatTimeAgo(fav.timestamp)}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          QuickLearn AI respects your privacy. No search history is stored on
          our servers.
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
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
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    textTransform: 'capitalize',
  },
  favoriteTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  infoSection: {
    padding: 20,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  version: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
});
