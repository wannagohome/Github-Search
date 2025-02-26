import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import SearchBar from '../../components/common/SearchBar';
import { styles } from './styles';

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const searchBarPosition = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsFocused(true)
    );
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
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

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
            Search
          </Animated.Text>
          
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsFocused(true)}
            style={[styles.searchBarContainer, { transform: [{ translateY: searchBarPosition }] }]}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;