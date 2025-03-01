import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../models";
import { DateUtil } from "../utils";

interface AutoCompleteProps {
  searchText: string;
  searches: Search[];
  onSelectItem: (text: string) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  searchText,
  searches,
  onSelectItem,
}) => {
  const filteredItems = searchText.trim()
    ? searches.filter((search) =>
        search.keyword.toLowerCase().includes(searchText.toLowerCase())
      )
    : searches;

  if (filteredItems.length === 0) {
    return null;
  }

  const renderItem = ({ item }: { item: Search }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onSelectItem(item.keyword)}
    >
      <View style={styles.leftContent}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={styles.icon}
        />
        <Text style={styles.itemText}>{item.keyword}</Text>
      </View>
      <Text style={styles.dateText}>{DateUtil.formatDate(item.date)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `autocomplete-${index}-${item.keyword}`}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingTop: 0,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#999",
  },
});

export default AutoComplete;
