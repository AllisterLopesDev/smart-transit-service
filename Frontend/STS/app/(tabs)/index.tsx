import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol.ios';


export default function HomeScreen() {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 500 }}>
        <Text style={{ fontSize: 24, textAlign: 'center' }}>
          Hello!
        </Text>
      </View>
  );
}
