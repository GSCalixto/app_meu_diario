import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';

const DesafiosDiarios = ({ isDarkMode }) => {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const desafios = useMemo(() => [
    { id: '1', texto: 'Medite por 10 minutos.', icon: 'person' },
    { id: '2', texto: 'Beba 2 litros de água.', icon: 'water' },
    { id: '3', texto: 'Leia um capítulo de um livro.', icon: 'book' },
    { id: '4', texto: 'Assista a filmes e séries.', icon: 'film' },
    { id: '5', texto: 'Fazer um lanche saudável.', icon: 'nutrition' },
    { id: '6', texto: 'Desconectar das redes sociais por 1 hora.', icon: 'phone-portrait' },
    { id: '7', texto: 'Fazer 15 minutos de exercícios.', icon: 'bicycle' },
    { id: '8', texto: 'Pratique um hobby.', icon: 'brush' },
    { id: '9', texto: 'Escutar uma nova música.', icon: 'musical-notes' },
    { id: '10', texto: 'Experimentar uma nova receita.', icon: 'restaurant' },
    { id: '11', texto: 'Fazer uma atividade criativa.', icon: 'color-palette' },
    { id: '12', texto: 'Organizar uma parte da casa.', icon: 'home' },
    { id: '13', texto: 'Assistir a um documentário.', icon: 'tv' },
    { id: '14', texto: 'Fazer um ato de bondade.', icon: 'heart' },
    { id: '15', texto: 'Aprender uma palavra nova em outra língua.', icon: 'language' },
    { id: '16', texto: 'Praticar uma habilidade que você quer melhorar.', icon: 'school' },
    { id: '17', texto: 'Fazer uma pausa para respirar profundamente.', icon: 'leaf' },
    { id: '18', texto: 'Jogar um jogo de tabuleiro com a família.', icon: 'game-controller' },
    { id: '19', texto: 'Fazer um planejamento para a semana.', icon: 'calendar' },
    { id: '20', texto: 'Cultive relacionamentos saudáveis.', icon: 'chatbubbles-outline' },
  ], []);

  // Seleciona apenas 3 desafios aleatórios por dia
  const desafiosDiarios = useMemo(() => {
    return desafios.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [desafios]);

  // Animação de fade-in
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Animated.View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer, { opacity: fadeAnim }]}>
      <Text style={[styles.title, styles.fontSubtitle, isDarkMode ? styles.darkText : styles.lightText]}>Desafios Diários</Text>
      {desafiosDiarios.map((desafio) => (
        <View key={desafio.id} style={styles.desafioContainer}>
          <Ionicons name={desafio.icon} size={24} color={isDarkMode ? '#fff' : '#000'} style={styles.icon} />
          <Text style={[styles.desafioText, styles.fontRegular, isDarkMode ? styles.darkText : styles.lightText]}>{desafio.texto}</Text>
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '90%',
    alignItems: 'flex-start',
    padding: 15,
    borderRadius: 30,
  },
  fontRegular: {
    fontFamily: 'Poppins_400Regular',
  },
  fontSubtitle: {
    fontFamily: 'Poppins_500Medium',
  },
  darkContainer: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: "#303030",
  },
  lightContainer: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: "#c6c6c6",
  },
  title: {
    fontSize: 22.5,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  desafioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
    
  },
  icon: {
    fontSize: 30,
    marginRight: 10,
    paddingLeft: 10,
  },
  desafioText: {
    flexWrap: 'wrap',
    maxWidth: '80%',
    fontSize: 15,
  },
});

export default DesafiosDiarios;
