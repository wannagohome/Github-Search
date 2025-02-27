import React from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { styles } from "./styles";

interface Repository {
  id: number;
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface SearchResultsProps {
  results: Repository[];
  totalCount: number;
  isLoading: boolean;
  onEndReached: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  totalCount,
  isLoading,
  onEndReached,
}) => {
  const renderItem = ({ item }: { item: Repository }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.owner.avatar_url }} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.totalCount}>
        {totalCount.toLocaleString()} repositories found
      </Text>
      <FlatList
        style={flatListStyles.list}
        contentContainerStyle={flatListStyles.content}
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#999" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const flatListStyles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    paddingBottom: 0,
    flexGrow: 1,
  }
});

export default SearchResults;