import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  // Animation du fondu et de la rotation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Lancer les animations en parallèle
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Redirection vers /login après 2,5 secondes
    const timer = setTimeout(() => {
      router.replace('/');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Interpolation de la rotation → 0 à 360°
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* ✅ Logo animé avec rotation et fondu */}
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Titre */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        EventEase
      </Animated.Text>

      {/* Sous-titre */}
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Planifiez. Participez. Profitez.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A', // fond bleu nuit chic
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: '#E0E1DD',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  subtitle: {
    color: '#778DA9',
    fontSize: 16,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
