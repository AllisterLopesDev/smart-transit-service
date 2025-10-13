import { StyleSheet } from 'react-native'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import { Link } from 'expo-router'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Home</ThemedText>
      <Link href="/login">
        <ThemedText style={{ color: 'blue', marginTop: 20 }}>Go to Login</ThemedText>
      </Link>
      <Link href="/register">
        <ThemedText style={{ color: 'blue', marginTop: 20 }}>Go to Register</ThemedText>
      </Link>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})
