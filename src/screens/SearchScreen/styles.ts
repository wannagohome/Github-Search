import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 0,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  backgroundTouchLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  limitedBackgroundLayer: {
    height: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    width: "100%",
    zIndex: 10,
  },
  searchBarContainer: {
    width: "100%",
  },
  autoCompleteContainer: {
    width: "100%",
    marginTop: 8,
    zIndex: 10,
  },
  searchResultsContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    zIndex: 1,
    marginBottom: 0,
    paddingBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});