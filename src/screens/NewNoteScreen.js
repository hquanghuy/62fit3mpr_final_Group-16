import React, { useState, useContext, useRef } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NoteContext } from "../data/store/NoteContext";

const NewNoteScreen = ({ navigation }) => {
  const context = useContext(NoteContext);
  const [content, setContent] = useState("");
  const inputRef = useRef();

  const handleAddNote = () => {
    if (content.trim() === "") {
      return;
    }
    context.addNote({
      colors: null,
      labels: [],
      content: content,
      updatedAt: new Date().toString(),
      isBookmarked: false,
    });
    setContent("");
    inputRef.current.focus();

    // Navigate to the Notes screen
    navigation.navigate("Notes");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add new note here"
        multiline={true}
        value={content}
        onChangeText={(text) => setContent(text)}
        ref={inputRef}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddNote} // Corrected function name
      >
        <Ionicons name="checkmark-circle" size={50} color="lightgreen" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    padding: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});

export default NewNoteScreen;
