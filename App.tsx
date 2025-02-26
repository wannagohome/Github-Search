import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import SearchScreen from './src/screens/SearchScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SearchScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});