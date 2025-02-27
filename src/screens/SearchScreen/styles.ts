import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  searchBarContainer: {
    width: "100%",
  },
  autoCompleteContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopWidth: 0,
  },
});