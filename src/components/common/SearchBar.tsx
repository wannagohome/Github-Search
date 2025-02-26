import React from 'react';
import {
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFocus,
  style,
}) => {
  return (
    <Animated.View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={20} color="#999" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="저장소 검색"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onFocus={onFocus}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});

export default SearchBar;