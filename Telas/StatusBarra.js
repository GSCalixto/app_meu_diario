import React from 'react';
import { Animated, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomStatusBar = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <Animated.View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000' : '#fff'}
      />
      <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeButton}>
        <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  darkModeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default CustomStatusBar;
