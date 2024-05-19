import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { NoteContext } from "../data/store/NoteContext";
import Dialog from "react-native-dialog";

export default function LabelsScreen({ navigation }) {
  const context = useContext(NoteContext);
  const { labels, addLabel, updateLabel, deleteLabel } = context;

  const [searchText, setSearchText] = useState("");
  const [filteredLabels, setFilteredLabels] = useState(labels);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const searchRef = useRef(null);

  const handleSearch = useCallback(
    (text) => {
      setSearchText(text);
      if (text) {
        const filtered = labels.filter((label) =>
          label.label.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredLabels(filtered);
      } else {
        setFilteredLabels(labels);
      }
    },
    [labels]
  );

  useEffect(() => {
    setFilteredLabels(labels);
  }, [labels]);

  useEffect(() => {
    handleSearch(searchText);
  }, [searchText, handleSearch]);

  const handleCreateLabel = () => {
    if (searchText.trim()) {
      addLabel({ label: searchText.trim() });
      setSearchText("");
      Alert.alert("Success", "Label created successfully.");
    } else {
      Alert.alert("Error", "Label name cannot be empty.");
    }
  };

  const handleEditLabel = () => {
    if (selectedLabel.label.trim()) {
      updateLabel(selectedLabel.id, { label: selectedLabel.label.trim() });
      setDialogVisible(false);
      setSelectedLabel(null);
      Alert.alert("Success", "Label updated successfully.");
    } else {
      Alert.alert("Error", "Label name cannot be empty.");
    }
  };

  const handleDeleteLabel = (id) => {
    deleteLabel(id);
    setDialogVisible(false);
    setSelectedLabel(null);
    Alert.alert("Success", "Label deleted successfully.");
  };

  const openDialog = (label) => {
    setSelectedLabel(label);
    setDialogVisible(true);
  };

  const renderDialog = () => (
    <Dialog.Container visible={dialogVisible}>
      <Dialog.Title>Edit Label</Dialog.Title>
      <Dialog.Input
        placeholder="Edit label here"
        value={selectedLabel?.label}
        onChangeText={(text) =>
          setSelectedLabel((prev) => ({ ...prev, label: text }))
        }
      />
      <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
      <Dialog.Button label="Delete" onPress={() => handleDeleteLabel(selectedLabel.id)} style={{ color: "red" }} />
      <Dialog.Button label="Save" onPress={handleEditLabel} style={{ color: "blue" }} />
    </Dialog.Container>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search labels or create new label"
        style={styles.searchInput}
        value={searchText}
        onChangeText={handleSearch}
        ref={searchRef}
      />
      <View style={styles.header}>
        <Text>{labels.length} total</Text>
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleCreateLabel} style={styles.addNewLabel}>
            <Text style={styles.addNewLabelText}>+Add new label</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredLabels.length > 0 ? (
        <FlatList
          data={filteredLabels}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.labelList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.labelItem} onPress={() => openDialog(item)}>
              <Text style={styles.labelText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No labels found</Text>
        </View>
      )}

      {dialogVisible && renderDialog()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  addNewLabel: {
    marginTop: 10,
  },
  addNewLabelText: {
    color: "blue",
    fontSize: 16,
  },
  labelList: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  labelItem: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "blue",
  },
  labelText: {
    textAlign: "center",
    margin: 10,
    fontSize: 16,
    color: "lightblue",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
  },
});
