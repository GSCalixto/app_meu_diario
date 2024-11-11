import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';

export default function TarefasTela({ isDarkMode, tasks, addTask, editTask, toggleTask, removeTask }) {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // State to track the active tab

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleAddTask = () => {
    if (editMode) {
      editTask(editTaskId, task, date);
      setEditMode(false);
      setEditTaskId(null);
    } else {
      addTask(task, date);
    }
    setTask('');
    setDate('');
    setModalVisible(false);
  };

  const handleEditTask = (task) => {
    setTask(task.task);
    setDate(task.date);
    setEditTaskId(task.id);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleRemoveTask = (id) => {
    Alert.alert(
      "Confirmar Excluir",
      "Você tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => removeTask(id) }
      ]
    );
  };

  const filteredTasks = (() => {
    switch (activeTab) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'incomplete':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  })();

  const sortedTasks = [...filteredTasks].sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Minhas Tarefas</Text>
      
      {/* Tab Bar */}
      <View style={[styles.tabBar, isDarkMode ? styles.darkTabBar : styles.lightTabBar]}>
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}
        >
          <Text style={[styles.tabText, isDarkMode ? styles.darkTabText : styles.lightTabText]}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('incomplete')}
          style={[styles.tabButton, activeTab === 'incomplete' && styles.activeTab]}
        >
          <Text style={[styles.tabText, isDarkMode ? styles.darkTabText : styles.lightTabText]}>Pendentes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('completed')}
          style={[styles.tabButton, activeTab === 'completed' && styles.activeTab]}
        >
          <Text style={[styles.tabText, isDarkMode ? styles.darkTabText : styles.lightTabText]}>Finalizadas</Text>
        </TouchableOpacity>
      </View>
      
      {sortedTasks.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={[styles.noTarefasText, isDarkMode ? styles.darkText : styles.lightText]}>
            Nenhuma tarefa encontrada.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskTextContainer}>
                <View style={[styles.task, item.completed ? styles.completedTask : styles.incompleteTask]}>
                  <Text style={[styles.taskText, styles.fontBold]}>
                    {item.task}
                  </Text>
                  <Text style={[styles.dateText, styles.fontRegular]}>
                    {item.date}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.iconButton}>
                  <Ionicons name="create-outline" size={20} color={isDarkMode ? '#fff' : '#000'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.iconButton}>
                  <Ionicons name={item.completed ? "star" : "star-outline"} size={20} color="gold" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveTask(item.id)} style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalView, isDarkMode ? styles.modalviewdark : styles.modalviewlight]}>
      <Text style={[styles.modalTitle, isDarkMode ? styles.modalTitledark : styles.modalTitlelight]}>
        {editMode ? "Editar Tarefa" : "Adicionar Tarefa"}
      </Text>
      <TextInput
        style={[styles.botoesinput, styles.fontRegular, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Título"
        placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
        value={task}
        onChangeText={setTask}
      />
      <TextInput
        style={[styles.botoesinput, styles.fontRegular, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Etapas..."
        placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
        value={date}
        onChangeText={setDate}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.cancelarText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
          <Text style={styles.salvarText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    fontFamily: 'Poppins_500Medium',
  },
  lightContainer: {
    backgroundColor: '#FFFAFA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginVertical: 10,
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  taskTextContainer: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTarefasText: {
    fontSize: 19,
    textAlign: 'center',
    marginTop: 19,
    fontFamily: 'Poppins_400Regular',
  },
  task: {
    padding: 2.5,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  completedTask: {
    backgroundColor: '#d4edda',
    borderColor: '#bbe5c5',
    borderWidth: 3,
  },
  incompleteTask: {
    backgroundColor: '#f8d7da',
    borderColor: '#ff95a0',
    borderWidth: 3,
  },
  taskText: {
    fontSize: 18,
    paddingHorizontal: 2.5,
    fontWeight: 'bold',
    color: 'black',
  },
  dateText: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: 'black',
  },
  taskActions: {
    marginLeft: 10,
    marginRight: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignSelf: 'flex-end',
  },
  iconButton: {
    padding: 2.5,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  fontRegular: {
    fontFamily: 'Poppins_400Regular',
  },
  fontBold: {
    fontFamily: 'Poppins_500Medium',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    borderRadius: 15,
    marginTop: 22.5,
    overflow: 'hidden',
  },
  lightTabBar: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: "#c6c6c6",
  },
  darkTabBar: {
    backgroundColor: '#333',
  },
  tabButton: {
    padding: 7.5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderRadius: 5,
    borderColor: '#FFD700',
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
  },
  darkTabText: {
    color: '#fff',
  },
  lightTabText: {
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro
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
  salvarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelarText: {
    color: 'white',
    fontWeight: 'bold',
  },
});