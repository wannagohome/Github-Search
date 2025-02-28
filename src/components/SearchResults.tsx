import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { Repository } from "../models";

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
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleRepositoryPress = (repository: Repository) => {
    navigation.navigate("WebView", {
      url: repository.html_url,
      title: repository.name,
    });
  };

  const renderItem = ({ item }: { item: Repository }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleRepositoryPress(item)}
    >
      <Image source={{ uri: item.owner.avatar_url }} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>
      </View>
    </TouchableOpacity>
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
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  totalCount: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 8,
    paddingHorizontal: 0,
    color: "#666",
  },
  listContent: {
    paddingBottom: 0,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  loadingFooter: {
    padding: 16,
    alignItems: "center",
  },
}); 

export default SearchResults;