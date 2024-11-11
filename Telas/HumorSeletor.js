import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, ScrollView } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';

const HumorSeletor = ({ humor, setHumor, isDarkMode }) => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [modalVisible, setModalVisible] = useState(false);
  const animatedScale = useState(new Animated.Value(1))[0];

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const handleHumorSelection = (selectedHumor) => {
    if (selectedDate === new Date().toDateString() && humor) {
      alert("Você já escolheu um humor hoje!");
      return;
    }

    setHumor(selectedHumor);
    setDiaryEntries(prev => [
      ...prev,
      { date: new Date().toDateString(), humor: selectedHumor, insight: generateInsight(selectedHumor) }
    ]);
    setSelectedDate(new Date().toDateString());

    Animated.sequence([
      Animated.timing(animatedScale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(animatedScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const generateInsight = (selectedHumor) => {
    const insights = {
      '😁': "Mantenha essa energia positiva!",
      '😂': "A risada é o melhor remédio.",
      '😍': "Espalhe amor por onde passar!",
      '🤔': "Refletir é o primeiro passo para a mudança.",
      '🙄': "Não deixe que a negatividade te afete.",
      '🤮': "Às vezes, precisamos de um tempo para nós mesmos.",
      '😭': "Tudo bem chorar, é uma forma de liberar sentimentos.",
      '🤬': "A raiva é válida, mas cuide de como expressá-la."
    };
    return insights[selectedHumor] || "Escolha um humor!";
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.question, styles.fontSubtitle, isDarkMode ? styles.darkText : styles.lightText]}>
        E aí, como você está hoje?
      </Text>
      <View style={styles.emojisRow}>
        {['😁', '😂', '😍', '🤔'].map((emoji) => (
          <TouchableOpacity 
            key={emoji} 
            onPress={() => handleHumorSelection(emoji)} 
            style={[styles.emojiButton, humor === emoji && styles.selectedEmojiButton]} 
          >
            <Animated.Text 
              style={[styles.emoji, { transform: [{ scale: animatedScale }] }]}
            >
              {emoji}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.emojisRow}>
        {['🙄', '🤮', '😭', '🤬'].map((emoji) => (
          <TouchableOpacity 
            key={emoji} 
            onPress={() => handleHumorSelection(emoji)} 
            style={[styles.emojiButton, humor === emoji && styles.selectedEmojiButton]} 
          >
            <Animated.Text 
              style={[styles.emoji, { transform: [{ scale: animatedScale }] }]}
            >
              {emoji}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity onPress={toggleModal} style={styles.historyButton}>
        <Icon name="history" size={20} color={isDarkMode ? '#FFD700' : '#000'} />
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, isDarkMode ? styles.modalviewdark : styles.modalviewlight]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.modalTitledark : styles.modalTitlelight]}>
              Histórico de Humores
            </Text>
            <ScrollView>
              {diaryEntries.length > 0 ? diaryEntries.map((entry, index) => (
                <Text key={index} style={[styles.modalEntry, isDarkMode ? styles.modalEntrydark : styles.modalEntrylight]}>
                  {new Date(entry.date).toLocaleDateString('pt-BR')}: {entry.humor} - {entry.insight}
                </Text>
              )) : (
                <Text style={[styles.modalEntry, isDarkMode ? styles.modalEntrydark : styles.modalEntrylight]}>
                  Nenhuma entrada registrada ainda.
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
  },
  fontSubtitle: {
    fontFamily: 'Poppins_500Medium',
  },
  question: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  emojisRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  emojiButton: {
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 5,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  selectedEmojiButton: {
    borderColor: '#ffb02e',
    backgroundColor: '#ffeeba',
  },
  emoji: {
    fontSize: 25,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  historyButton: {
    position: 'absolute',
    marginTop: 160,
    zIndex: 1,
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalviewlight: {
    width: '80%',
    margin: 20,
    borderWidth: 5,
    borderColor: "#505050",
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalviewdark: {
    width: '80%',
    margin: 20,
    backgroundColor: '#121212',
    borderWidth: 5,
    borderColor: "#505050",
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitlelight: {
    color: 'dark',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalTitledark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalEntrylight: {
    color: "black",
    fontSize: 16,
    marginVertical: 5,
  },
  modalEntrydark: {
    color: "white",
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffb02e',
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HumorSeletor;
