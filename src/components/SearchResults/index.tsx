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
import { styles } from "./styles";
import { Repository } from "../../models";

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

export default SearchResults;