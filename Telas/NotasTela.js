import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function NotasTela({ notes, setNotes = () => {}, isDarkMode }) {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const [searchText, setSearchText] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [lastDeletedNote, setLastDeletedNote] = useState(null);
  const [showUndoButton, setShowUndoButton] = useState(false); // Estado para controlar a visibilidade do botão

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleSearch = () => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const handleClearSearch = () => {
    setFilteredNotes(notes);
    setSearchText('');
  };

  const toggleNoteColor = (id) => {
    const lightColors = ['#f9f9f9', '#d3a4ce', '#f1a3cd', '#ff9352', '#fef984', '#c8fd87', '#84d4c9', '#85cae7'];
    const darkColors = ['#505050', '#9c2c74', '#3c2c73', '#04749c', '#04852d', '#ccbd1c', '#c4741d', '#bc2c14'];
    const colors = isDarkMode ? darkColors : lightColors;

    const updatedNotes = filteredNotes.map((note) => {
      if (note.id === id) {
        const currentColor = colors.indexOf(note.color);
        const nextColor = (currentColor + 1) % colors.length;
        return { ...note, color: colors[nextColor] };
      }
      return note;
    });
    setFilteredNotes(updatedNotes);
  };

  const handleDeleteNote = (id) => {
    const noteToDelete = notes.find(note => note.id === id);
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    setLastDeletedNote(noteToDelete);
    setShowUndoButton(true); // Mostrar o botão de desfazer
  };

  const undoDelete = () => {
    if (lastDeletedNote) {
      setNotes([...notes, lastDeletedNote]);
      setFilteredNotes([...filteredNotes, lastDeletedNote]);
      setLastDeletedNote(null);
      setShowUndoButton(false); // Ocultar o botão de desfazer
    }
  };

  const numColumns = 2;
  const noteWidth = Dimensions.get('window').width / numColumns - 45;

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Minhas Notas</Text>
        {showUndoButton && (
          <TouchableOpacity onPress={undoDelete} style={styles.undoButton}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TextInput
          style={[styles.searchInput, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Pesquise"
          placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={handleSearch}>
          <Ionicons name="search" size={18} color={isDarkMode ? "#fff" : "#000"} />
          <Text style={[styles.buttonText, isDarkMode ? styles.darkText : styles.lightText]}>Buscar</Text>
        </TouchableOpacity>
        <View style={styles.buttonSpacing} />
        <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={handleClearSearch}>
          <Ionicons name="filter" size={18} color={isDarkMode ? "#fff" : "#000"} />
          <Text style={[styles.buttonText, isDarkMode ? styles.darkText : styles.lightText]}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {filteredNotes.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={[styles.noNotesText, isDarkMode ? styles.darkText : styles.lightText]}>
            Nenhuma nota encontrada.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={({ item }) => (
            <View style={[styles.note, { backgroundColor: item.color || (isDarkMode ? '#505050' : '#f9f9f9'), width: noteWidth }]}>
              <TouchableOpacity onPress={() => toggleNoteColor(item.id)} style={styles.colorToggle}>
                <MaterialIcons name="brush" size={18} color={isDarkMode ? "#fff" : "#000"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={styles.deleteToggle}>
                <MaterialIcons name="delete" size={18} color={isDarkMode ? "#fff" : "#000"} />
              </TouchableOpacity>
              <Text style={[styles.noteTitle, styles.fontMedium, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
              <Text style={[styles.noteContent, styles.fontRegular, isDarkMode ? styles.darkText : styles.lightText]}>{item.content}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    fontFamily: 'Poppins_500Medium',
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  lightContainer: {
    backgroundColor: '#FFFAFA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  listContainer: {
    paddingBottom: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotesText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins_400Regular',
  },
  note: {
    margin: 10,
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 140,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  fontRegular: {
    fontFamily: 'Poppins_400Regular',
  },
  fontMedium: {
    fontFamily: 'Poppins_500Medium',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonSpacing: {
    width: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    fontSize: 16,
    marginRight: 10,
    width: '75%',
  },
  lightInput: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    borderWidth: 1,
    borderColor: "#d2d2d2",
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  lightButton: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: "#c6c6c6",
  },
  darkButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 15,
    color: '#000',
  },
  colorToggle: {
    position: 'absolute',
    top: 10,
    right: 40,
  },
  deleteToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  undoButton: {
    marginTop: 30,
    alignSelf: 'flex-start',
  },
});