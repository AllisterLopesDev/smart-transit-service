import { Link } from 'expo-router'

// themed components
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import { useState } from 'react'
import { Pressable, Text } from 'react-native'
import useGoogleAuth from '../../auth/GoogleAuth';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [error, setError] = useState()

  const handleSubmit = async () => {
    console.log("Login submitted", { email, password });
  }
  console.log(useGoogleAuth);
  

  // const { user, loading, error, signIn, signOut } = useGoogleAuth();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
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
        <Text style={{ color: '#f2f2f2' }}>Login</Text>
      </ThemedButton>
      <Spacer height={10} />
        {/* {error && <Text style={styles.error}>{error}</Text>} */}
      <Spacer height={20} />
      <Link href="/register">
        <ThemedText style={{ color: 'blue' }}>Don't have an account? Register</ThemedText>
      </Link>

      {/* {loading ? (
        <ActivityIndicator size="large" />
      ) : user ? (
        <>
          <Text>Welcome, {user.user.name}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      ) : (
        <Button title="Google Sign-In" onPress={signIn} />
      )} */}
      
    </ThemedView>
  )
}

export default Login

// import React from 'react';
// import { View, Text, Button, ActivityIndicator, Image } from 'react-native';
// // import useGoogleAuth from '../../auth/GoogleAuth'; // adjust the path

// const LoginScreen = () => {
//   // const { user, loading, error, signIn, signOut } = useGoogleAuth();

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {/* {loading && <ActivityIndicator size="large" />} */}
      
//       {!user ? (
//         <>
//           <Text style={{ fontSize: 20, marginBottom: 20 }}>Welcome! Please sign in</Text>
//           <Button title="Sign in with Google" onPress={signIn} />
//         </>
//       ) : (
//         <>
//           <Image
//             source={{ uri: user.user.photo }}
//             style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
//           />
//           <Text style={{ fontSize: 18, marginBottom: 5 }}>{user.user.name}</Text>
//           <Text style={{ marginBottom: 20 }}>{user.user.email}</Text>
//           <Button title="Sign out" onPress={signOut} />
//         </>
//       )}

//       {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
//     </View>
//   );
// };

// export default LoginScreen;

