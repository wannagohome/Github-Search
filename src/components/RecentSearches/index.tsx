import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MAX_DISPLAY_SEARCHES = 10;

interface RecentSearchesProps {
  searches: string[];
  onSelectSearch: (search: string) => void;
  onRemoveSearch: (search: string) => void;
  onClearAllSearches: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelectSearch,
  onRemoveSearch,
  onClearAllSearches,
}) => {
  const displaySearches = searches.slice(0, MAX_DISPLAY_SEARCHES);
  
  const renderRecentSearchItem = ({ item }: { item: string }) => (
    <View style={styles.recentSearchItem}>
      <TouchableOpacity 
        style={styles.recentSearchTextContainer}
        onPress={() => onSelectSearch(item)}
      >
        <Ionicons name="time-outline" size={18} color="#999" style={styles.recentSearchIcon} />
        <Text style={styles.recentSearchText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRemoveSearch(item)}>
        <Ionicons name="close" size={18} color="#999" />
      </TouchableOpacity>
    </View>
  );

  if (displaySearches.length === 0) {
    return null;
  }

  return (
    <View style={styles.recentSearchesContainer}>
      <View style={styles.recentSearchesHeader}>
        <Text style={styles.recentSearchesTitle}>최근 검색</Text>
        <TouchableOpacity onPress={onClearAllSearches}>
          <Text style={styles.clearAllButton}>전체삭제</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={displaySearches}
        renderItem={renderRecentSearchItem}
        keyExtractor={(item, index) => `search-${index}-${item}`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recentSearchesContainer: {
    marginTop: 20,
    width: '100%',
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearAllButton: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentSearchIcon: {
    marginRight: 8,
  },
  recentSearchText: {
    fontSize: 16,
  },
});

export default RecentSearches; 