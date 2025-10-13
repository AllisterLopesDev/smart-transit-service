import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from '../constants/Colors';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.light;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.navBackground,
        },
        // headerTintColor: theme.headerTextColor, // (Optional) for contrast
      }}
    >
      {/* <Stack.Screen name="index" options={{ title: "Home" }} /> */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
