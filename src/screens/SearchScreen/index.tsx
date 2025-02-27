import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Animated,
  Keyboard,
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SearchBar,
  RecentSearches,
  AutoComplete,
  SearchResults,
} from "../../components";
import { styles } from "./styles";

const RECENT_SEARCHES_KEY = "recent_searches";

interface Search {
  keyword: string;
  date: Date;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const SearchScreen: React.FC = () => {
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searches, setSearches] = useState<Search[]>([]);
  const [searchResults, setSearchResults] = useState<Repository[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isFetchingFirstPage, setIsFetchingFirstPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const titleOpacity = useRef(new Animated.Value(1)).current;
  const searchBarPosition = useRef(new Animated.Value(0)).current;

  const hasSearchResults = searchResults.length > 0;
  const recentSearchKeywords = searches.map((search) => search.keyword);

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
      () => setIsFocused(false)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const animations = [];

    animations.push(
      Animated.timing(titleOpacity, {
        toValue: isFocused || hasSearchResults ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      })
    );

    animations.push(
      Animated.timing(searchBarPosition, {
        toValue: isFocused || hasSearchResults ? -50 : 0,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  }, [isFocused, hasSearchResults]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleSearch = () => {
    if (!currentSearchKeyword.trim()) return;

    dismissKeyboardIfNeeded();
    saveRecentSearchKeyword(currentSearchKeyword);
    search(currentSearchKeyword);
  };

  const saveRecentSearchKeyword = async (keyword: string) => {
    const search = { keyword, date: new Date() };
    const newSearches = [
      search,
      ...searches.filter((search) => search.keyword !== keyword),
    ];

    setSearches(newSearches);
    await AsyncStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(newSearches)
    ).catch((error) => {
      console.error("Failed to save recent search", error);
    });
  };

  const loadRecentSearches = async () => {
    const storedSearches = await AsyncStorage.getItem(
      RECENT_SEARCHES_KEY
    ).catch((error) => {
      console.error("Failed to load recent searches", error);
    });
    if (storedSearches) {
      const parsedSearches = JSON.parse(storedSearches);
      setSearches(parsedSearches);
    }
  };

  const removeRecentSearch = async (keyword: string) => {
    const updatedSearches = searches.filter(
      (search) => search.keyword !== keyword
    );
    setSearches(updatedSearches);
    await AsyncStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(updatedSearches)
    ).catch((error) => {
      console.error("Failed to remove recent search", error);
    });
  };

  const clearAllRecentSearches = async () => {
    setSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY).catch((error) => {
      console.error("Failed to clear recent searches", error);
    });
  };

  const dismissKeyboardIfNeeded = () => {
    if (isFocused) {
      Keyboard.dismiss();
    }
  };

  const handleCancel = () => {
    setSearchResults([]);
    setTotalCount(0);
    Keyboard.dismiss();
    setIsFocused(false);
    setCurrentSearchKeyword("");
  };

  const handleClear = () => {
    setCurrentSearchKeyword("");
  };

  const search = async (keyword: string, page = 1) => {
    if (!keyword.trim()) return;

    try {
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setIsFetchingFirstPage(true);
        setSearchResults([]);
      } else {
        setIsFetchingMore(true);
      }

      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          keyword
        )}&page=${page}`
      );

      const data = await response.json();

      if (isFirstPage) {
        setSearchResults(data.items || []);
        setTotalCount(data.total_count || 0);
      } else {
        setSearchResults((prevResults) => [
          ...prevResults,
          ...(data.items || []),
        ]);
      }

      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to search", error);
    } finally {
      setIsFetchingFirstPage(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (isFetchingMore || searchResults.length === 0) return;
    search(currentSearchKeyword, currentPage + 1);
  };

  const selectRecentSearch = (keyword: string) => {
    setCurrentSearchKeyword(keyword);
    saveRecentSearchKeyword(keyword);
    search(keyword);
  };

  const handleBackgroundTap = () => {
    if (hasSearchResults) {
      Keyboard.dismiss();
    } else {
      dismissKeyboardIfNeeded();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 0 }]}>
      {(isFocused || hasSearchResults) && (
        <TouchableOpacity
          style={[
            styles.backgroundTouchLayer,
            hasSearchResults ? styles.limitedBackgroundLayer : null,
          ]}
          activeOpacity={1}
          onPress={handleBackgroundTap}
        />
      )}

      <View
        style={[
          styles.contentContainer,
          hasSearchResults && styles.fullHeightContent,
        ]}
      >
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
              hasSearchResults={hasSearchResults}
            />
          </View>

          {isFocused && !hasSearchResults && (
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

        {!isFocused && !hasSearchResults && recentSearchKeywords.length > 0 && (
          <RecentSearches
            searches={recentSearchKeywords}
            onSelectSearch={selectRecentSearch}
            onRemoveSearch={removeRecentSearch}
            onClearAllSearches={clearAllRecentSearches}
          />
        )}

        {isFetchingFirstPage && !isFetchingMore && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#999" />
          </View>
        )}

        {hasSearchResults && !isFetchingFirstPage && (
          <Animated.View
            style={[
              styles.searchResultsContainer,
              {
                transform: [{ translateY: searchBarPosition }],
                flex: 1,
                paddingBottom: 0,
                marginBottom: 0,
              },
            ]}
            pointerEvents="box-none"
          >
            <SearchResults
              results={searchResults}
              totalCount={totalCount}
              isLoading={isFetchingMore}
              onEndReached={handleLoadMore}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;