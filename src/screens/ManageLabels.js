import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NoteContext } from "../data/store/NoteContext";

export default function ManageLabels({ navigation, route }) {
  const context = useContext(NoteContext);
  const { labels, notes } = context;
  const id = route.params.id;
  
  const note = notes.find((note) => note.id === id);
  const noteRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [filteredLabels, setFilteredLabels] = useState(labels);

  useEffect(() => {
    if (searchText) {
      const filtered = labels.filter((label) =>
        label.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredLabels(filtered);
    } else {
      setFilteredLabels(labels);
    }
  }, [searchText, labels]);

  const handleLabelToggle = (labelId) => {
    if (note.labelIds.includes(labelId)) {
      note.labelIds = note.labelIds.filter((id) => id !== labelId);
    } else {
      note.labelIds.push(labelId);
    }
    context.editNote(note);
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Labels</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search labels or create new label"
        ref={noteRef}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />

      <View style={styles.labelInfo}>
        <Text>
          {labels.length} total, {note.labelIds.length} selected
        </Text>
      </View>

      <FlatList
        data={filteredLabels}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.labelList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.labelItem,
              note.labelIds.includes(item.id) ? styles.selectedLabel : styles.unselectedLabel,
            ]}
            onPress={() => handleLabelToggle(item.id)}
          >
            <Text
              style={[
                styles.labelText,
                note.labelIds.includes(item.id) ? styles.selectedLabelText : styles.unselectedLabelText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10,
  },
  searchInput: {
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  labelInfo: {
    padding: 10,
  },
  labelList: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  labelItem: {
    padding: 10,
    margin: 5,
    elevation: 2,
    flex: 1,
    borderRadius: 10,
  },
  selectedLabel: {
    backgroundColor: "blue",
  },
  unselectedLabel: {
    backgroundColor: "lightblue",
  },
  labelText: {
    textAlign: "center",
  },
  selectedLabelText: {
    color: "lightblue",
  },
  unselectedLabelText: {
    color: "blue",
  },
});
