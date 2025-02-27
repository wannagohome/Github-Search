import React from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  LayoutChangeEvent,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onCancel?: () => void;
  onClear?: () => void;
  onSubmitEditing?: () => void;
  isFocused: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFocus,
  onCancel,
  onClear,
  onSubmitEditing,
  isFocused,
}) => {
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    if (containerWidth > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [isFocused, containerWidth]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container} onLayout={onLayout}>
        <View
          style={[
            styles.searchContainer,
            { width: isFocused ? "85%" : "100%" },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="저장소 검색"
            value={value}
            onChangeText={onChangeText}
            returnKeyType="search"
            onFocus={onFocus}
            onSubmitEditing={onSubmitEditing}
          />
          {isFocused && value.length > 0 && (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {isFocused && (
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 12,
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
  clearButton: {
    padding: 4,
  },
  cancelButtonContainer: {
    paddingLeft: 8,
    height: 40,
    justifyContent: "center",
  },
  cancelButton: {
    height: "100%",
    justifyContent: "center",
  },
  cancelText: {
    color: "#5856D6",
    fontSize: 16,
  },
});

export default SearchBar;