import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors'
import { useState } from 'react';
import ThemedText from './ThemedText';

export default function ThemedTextInput({ type = 'text', style, ...props }) {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  const [hidePass, setHidePass] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        secureTextEntry={!hidePass}
        style={[
          {
            backgroundColor: theme.uiBackground,
            color: theme.text,
            padding: 20,
            borderRadius: 6,
          },
          style,
        ]}
        {...props}
      />
      {/* <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
        <ThemedText>{hidePass ? 'true' : 'false'}</ThemedText>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    width: '100%',
    paddingRight: 60,
  },
  toggleButton: {
    position: 'absolute',
    right: 16,
    top: 10,
    padding: 4,
  },
});