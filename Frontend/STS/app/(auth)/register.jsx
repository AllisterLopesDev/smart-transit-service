import { StyleSheet, Text } from 'react-native'
import { Link } from 'expo-router'

// themed components
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import { useState } from 'react'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'

const Register = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState()
  
  const handleSubmit = async () => {
    console.log("Login submitted", { email, password });
  }
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedTextInput
          style={{ marginBottom: 20}}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      <ThemedTextInput
          style={{ marginBottom: 20}}
          placeholder="Contact Number"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />
      <ThemedTextInput
          style={{ marginBottom: 20}}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      <ThemedTextInput
          type="password"
          style={{ marginBottom: 20}}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      <ThemedButton style={{ justifyContent: 'center', alignItems: 'center' }} onPress={handleSubmit}>
        <Text style={{ color: '#f2f2f2' }}>Register</Text>
      </ThemedButton>
      <Spacer height={10} />
        {error && <Text style={styles.error}>{error}</Text>}
      <Spacer height={20} />
      <Link href="/login">
        <ThemedText style={{ color: 'blue' }}>Already have an account? Login</ThemedText>
      </Link>
    </ThemedView>
  )
}

export default Register

const styles = StyleSheet.create({})
