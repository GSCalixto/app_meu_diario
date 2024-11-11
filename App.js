import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, useColorScheme, Animated, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import HomeTela from './Telas/HomeTela';
import NotasTela from './Telas/NotasTela';
import TarefasTela from './Telas/TarefasTela';

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const colorScheme = useColorScheme();
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        console.log("Notification permissions not granted");
      }
    })();
  }, []);

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete!",
        body: 'Não se esqueça de completar suas tarefas de hoje!',
      },
      trigger: { seconds: 10 },
    });
  };

  const toggleDarkMode = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDarkMode(!isDarkMode);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const addNote = (title, content) => {
    setNotes([...notes, { id: notes.length.toString(), title, content }]);
  };

  const addTask = (task, date) => {
    setTasks([...tasks, { id: tasks.length.toString(), task, date, completed: false }]);
  };

  const editTask = (id, newTask, newDate) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, task: newTask, date: newDate } : task));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <NavigationContainer>
      <Animated.View style={[styles.container, { opacity: fadeAnim }, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <Tab.Navigator
         initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Notas') {
                iconName = focused ? 'document-text' : 'document-text-outline';
              } else if (route.name === 'Tarefas') {
                iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: isDarkMode ? '#FFD700' : '#000',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: isDarkMode ? '#121212' : '#FFFAFA',
              borderTopWidth: 0,
              elevation: 0,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Notas">
            {() => <NotasTela isDarkMode={isDarkMode} notes={notes} />}
          </Tab.Screen>
          <Tab.Screen name="Home">
            {() => <HomeTela isDarkMode={isDarkMode} addNote={addNote} addTask={addTask} toggleDarkMode={toggleDarkMode} scheduleNotification={scheduleNotification} />}
          </Tab.Screen>
          <Tab.Screen name="Tarefas">
            {() => <TarefasTela isDarkMode={isDarkMode} tasks={tasks} editTask={editTask} toggleTask={toggleTask} removeTask={removeTask} />}
          </Tab.Screen>
        </Tab.Navigator>
      </Animated.View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
});