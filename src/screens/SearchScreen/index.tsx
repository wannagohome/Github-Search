import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar, RecentSearches, AutoComplete } from "../../components";
import { styles } from "./styles";

const RECENT_SEARCHES_KEY = "recent_searches";

interface Search {
  keyword: string;
  date: Date;
}

const SearchScreen: React.FC = () => {
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searches, setSearches] = useState<Search[]>([]);

  const titleOpacity = useRef(new Animated.Value(1)).current;
  const searchBarPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setIsFocused(true)
    );
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsFocused(false);
        animateUI(false);
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      animateUI(true);
    }
  }, [isFocused]);

  const animateUI = (focused: boolean) => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: focused ? 0 : 1,
        duration: focused ? 200 : 100,
        useNativeDriver: true,
      }),
      Animated.timing(searchBarPosition, {
        toValue: focused ? -50 : 0,
        duration: focused ? 200 : 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleCancel = () => {
    setCurrentSearchKeyword("");
    setIsFocused(false);
    animateUI(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setCurrentSearchKeyword("");
  };

  const handleSearch = () => {
    const keyword = currentSearchKeyword.trim();
    if (keyword) {
      saveRecentSearchKeyword(keyword);
    }
  };

  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}. ${day}.`;
  };

  const saveSearchesToStorage = async (searchesToSave: Search[]) => {
    const searches = searchesToSave.map((search) => ({
      keyword: search.keyword,
      date: search.date.toISOString(),
    }));

    await AsyncStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(searches)
    ).catch((error) =>
      console.error("Error saving searches to storage:", error)
    );
  };

  const saveRecentSearchKeyword = async (keyword: string) => {
    const now = new Date();

    const newSearches = [
      { keyword, date: now },
      ...searches.filter((search) => search.keyword !== keyword),
    ];

    setSearches(newSearches);
    await saveSearchesToStorage(newSearches);
  };

  const loadRecentSearches = async () => {
    const storedData = await AsyncStorage.getItem(RECENT_SEARCHES_KEY).catch(
      (error) => console.error("Error loading recent searches:", error)
    );
    if (storedData) {
      const data = JSON.parse(storedData);

      const searches = data.map((item: any) => ({
        keyword: item.keyword,
        date: new Date(item.date),
      }));

      setSearches(searches);
    }
  };

  const removeRecentSearch = async (keyword: string) => {
    const updatedSearches = searches.filter(
      (search) => search.keyword !== keyword
    );
    setSearches(updatedSearches);
    await saveSearchesToStorage(updatedSearches);
  };

  const clearAllRecentSearches = async () => {
    try {
      setSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  const selectRecentSearch = (keyword: string) => {
    setCurrentSearchKeyword(keyword);
    handleSearch();
  };

  const recentSearchKeywords = searches.map((search) => search.keyword);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
            Search
          </Animated.Text>

          <Animated.View
            style={[
              styles.searchContainer,
              { transform: [{ translateY: searchBarPosition }] },
            ]}
          >
            <View style={styles.searchBarContainer}>
              <SearchBar
                value={currentSearchKeyword}
                onChangeText={setCurrentSearchKeyword}
                onFocus={() => setIsFocused(true)}
                onCancel={handleCancel}
                onClear={handleClear}
                isFocused={isFocused}
                onSubmitEditing={handleSearch}
              />
            </View>

            {isFocused && (
              <View style={styles.autoCompleteContainer}>
                <AutoComplete
                  searchText={currentSearchKeyword}
                  searches={searches}
                  onSelectItem={selectRecentSearch}
                  formatDate={formatDate}
                />
              </View>
            )}
          </Animated.View>

          {!isFocused && recentSearchKeywords.length > 0 && (
            <RecentSearches
              searches={recentSearchKeywords}
              onSelectSearch={selectRecentSearch}
              onRemoveSearch={removeRecentSearch}
              onClearAllSearches={clearAllRecentSearches}
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;