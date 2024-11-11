import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, TextInput, Button, StatusBar, Image } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DesafiosDiarios from './DesafiosDiarios';
import HumorSeletor from './HumorSeletor';

const Header = ({ title, date, isDarkMode, searchQuery, setSearchQuery }) => (
  <View style={styles.headerContainer}>
    <Text style={[styles.plannerTitle, styles.fontSubtitle, isDarkMode ? styles.darkText : styles.lightText]}>
      {title}
    </Text>
    <Text style={[styles.date, styles.fontSubtitle, isDarkMode ? styles.darkText : styles.lightText]}>
      {date}
    </Text>
    <View style={[styles.searchContainer, isDarkMode ? styles.darkSearch : styles.lightSearch]}>
      <Ionicons name="search" size={20} color={isDarkMode ? "#fff" : "#000"} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, isDarkMode ? styles.darksearchInput : styles.lightsearchInput]}
        placeholder="Encontre notas ou tarefas..."
        placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  </View>
);

export default function HomeTela({ isDarkMode, addNote, addTask, toggleDarkMode }) {
  const [mood, setMood] = useState('');
  const [humor, setHumor] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().getHours());
  const [currentDate, setCurrentDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTaskVisible, setModalTaskVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskSteps, setTaskSteps] = useState(['']);
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const capitalizeFirstLetters = (str) => {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFormattedDate = useCallback(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('PT-BR', options);
    return capitalizeFirstLetters(formattedDate);
  }, []);

  useEffect(() => {
    setCurrentDate(getFormattedDate());
  }, [getFormattedDate]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const greeting = () => {
    if (currentTime < 12) {
      return 'BOM DIA!';
    } else if (currentTime < 18) {
      return 'BOA TARDE!';
    } else {
      return 'BOA NOITE!';
    }
  };


  const handleAddNote = () => {
  if (!title || !content) {
    alert('Por favor, preencha todos os campos da nota.');
    return;
  }

  addNote(title, content);
  setTitle('');
  setContent('');
  setModalVisible(false);
};

const handleCancelNote = () => {
  setTitle('');
  setContent('');
  setModalVisible(false);
};

const handleAddTask = () => {
  if (!taskTitle || taskSteps[1, 2, 3, 4, 5]) {
    alert('Por favor, preencha todos os campos da tarefa.');
    return;
  }

  addTask(taskTitle, taskSteps);
  setTaskTitle('');

  setTaskSteps(['']);
  setModalTaskVisible(false);
};

const handleCancelTask = () => {
  setTaskTitle('');
  setTaskDueDate('');
  setTaskSteps(['']);
  setModalTaskVisible(false);
};


  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const addStep = () => {
    if (taskSteps.length < 5) {
      setTaskSteps([...taskSteps, '']);
    } else {
      alert('Você pode adicionar no máximo 5 etapas.');
    }
  };

  const removeStep = (index) => {
    const newSteps = taskSteps.filter((_, i) => i !== index);
    setTaskSteps(newSteps);
  };

  const handleStepChange = (text, index) => {
    const newSteps = [...taskSteps];
    newSteps[index] = text;
    setTaskSteps(newSteps);
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    } else {
      console.log('Imagem não selecionada');
    }
  };

  return (
    <Animated.View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000' : '#fff'}
      />

      <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeButton}>
        <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={25} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={selectImage} style={styles.profileImageButton}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={35} color={isDarkMode ? "#fff" : "#ccc"} />
        )}
      </TouchableOpacity>

      <View style={styles.greetingContainer}>
        <Text style={[styles.greeting, styles.fontRegular, isDarkMode ? styles.darkText : styles.lightText]}>
          {greeting()}
        </Text>
      </View>

      <Header title="Meu Diário" date={currentDate} isDarkMode={isDarkMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <View style={styles.body}>
      <DesafiosDiarios style={styles.desafiosContainer} 
      mood={mood} setMood={setMood} isDarkMode={isDarkMode}
      />

      <HumorSeletor humor={humor} setHumor={setHumor}
       mood={mood} setMood={setMood} isDarkMode={isDarkMode}
       />
      </View>

      <View style={styles.footer} >
        <TouchableOpacity style={styles.noteButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="document-text" size={24} color="green" />
          <Text style={styles.buttonText}>Notas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.taskButton} onPress={() => setModalTaskVisible(true)}>
          <Ionicons name="checkmark-circle" size={24} color="#4d004d" />
          <Text style={styles.buttonText}>Tarefas</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, isDarkMode ? styles.modalviewdark : styles.modalviewlight]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.modalTitledark : styles.modalTitlelight]}>Adicionar Nota</Text>
            <TextInput
            style={[styles.botoesinput, styles.fontRegular, isDarkMode ? styles.darknotaInput : styles.lightnotaInput]}
            placeholder="Título"
            placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
            value={title}
            onChangeText={setTitle}
            />
            <TextInput
            style={[styles.botoesinput, styles.fontRegular, isDarkMode ? styles.darknotaInput : styles.lightnotaInput]}
            placeholder="Comece a Escrever..."
            placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
            value={content}
            onChangeText={setContent}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelNote}>
                <Text style={styles.cancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
                <Text style={styles.salvarText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={modalTaskVisible} onRequestClose={() => setModalTaskVisible(false)} >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, isDarkMode ? styles.modalviewdark : styles.modalviewlight]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.modalTitledark : styles.modalTitlelight]}>Adicionar Tarefa</Text>
            <TextInput
            style={[styles.botoesinput, styles.fontRegular, isDarkMode ? styles.darktarefaInput : styles.lighttarefaInput]}
            placeholder="Título"
            placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
            value={taskTitle}
            onChangeText={setTaskTitle}
            />
          {taskSteps.map((step, index) => (
            <TextInput
              key={index}
              style={[styles.botoesinput, styles.fontRegular, isDarkMode ? styles.darktarefaInput : styles.lighttarefaInput]}
              placeholder={`Etapa ${index + 1}`}
              placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
              value={step}
              onChangeText={(text) => handleStepChange(text, index)}
            />
          ))}
          <View style={styles.stepButtonRow}>
            <TouchableOpacity onPress={addStep}>
              <Ionicons name="add-outline" size={25} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeStep(taskSteps.length - 1)}>
              <Ionicons name="remove-outline" size={25} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>
          <View style={styles.datePickerContainer}>
            <Text style={[styles.botoesinput, styles.prazo, styles.fontRegular, isDarkMode ? styles.darkText : styles.lightText]}>
              {dueDate ? dueDate.toDateString() : ''}
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons style={styles.calendar} name="calendar" size={24} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelTask}>
              <Text style={styles.cancelarText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
              <Text style={styles.salvarText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  lightContainer: {
    backgroundColor: '#FFFAFA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkModeButton: {
    position: 'absolute',
    top: 43,
    right: 20,
    zIndex: 1,
  },
  profileImageButton: {
    position: 'absolute',
    top: 35,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  greetingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  greeting: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: -10,
    padding: 0,
  },
  plannerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  date: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

    padding: 10,
    marginTop: -10,
  },
  desafiosContainer: {
    justifyContent: 'center',
  },
  lightnotaInput: {
    backgroundColor: '#fff',
  },
  darknotaInput: {
  color: '#fff',
  backgroundColor: '#121212',
  },
  lighttarefaInput: {
    backgroundColor: '#fff',
  },
  darktarefaInput: {
  color: '#fff',
  backgroundColor: '#121212',
  },
  fontRegular: {
    fontFamily: 'Poppins_400Regular',
  },
  fontSubtitle: {
    fontFamily: 'Poppins_500Medium',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  darksearchInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  lightsearchInput: {
    color: '333',
  },
  lightSearch: {
    backgroundColor: '#f2f2f2',
    borderColor: "#c6c6c6",
  },
  darkSearch: {
    backgroundColor: '#333',
    borderColor: "#303030",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 17.5,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalviewlight: {
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
  botoesinput: {
    height: 40,
    width: 175,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingRight: 10,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    width: '80%',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 10,
    marginLeft: 20,
  },
  saveButton: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
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
  noteButton: {
    backgroundColor: '#e6ffe6',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  taskButton: {
    backgroundColor: '#f9e6ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  prazo: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  calendar: {
    marginLeft: -30,
    marginTop: -10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
  },
  stepButtonRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '40%',
    fontWeight: 'bold',
    marginLeft: -20,
    marginBottom: 5,
  },
  salvarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelarText: {
    color: 'white',
    fontWeight: 'bold',
  },
});