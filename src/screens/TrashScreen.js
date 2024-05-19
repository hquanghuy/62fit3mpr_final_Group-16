import React, { useContext, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { NoteContext } from "../data/store/NoteContext";
import { formatDistanceToNow, format, set } from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import Label from "../components/Label";
import Dialog from "react-native-dialog";
import { id } from "date-fns/locale";
export default function TrashScreen() {
  const context = useContext(NoteContext);
  const { trash } = context;
  const data = trash.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  const timeDisplay = (time) => {
    const updatedAt = new Date(time);
    const now = new Date();

    // Check if updatedAt and now are on the same day
    const isSameDay =
      updatedAt.getDate() === now.getDate() &&
      updatedAt.getMonth() === now.getMonth() &&
      updatedAt.getFullYear() === now.getFullYear();

    const displayText = isSameDay
      ? formatDistanceToNow(updatedAt, { addSuffix: true })
      : format(updatedAt, "MMMM d, yyyy");
    return displayText;
  };
  const [selectedNote, setSelectedNote] = useState(null);
  const [eachItemDialogVisible, setEachItemDialogVisible] = useState(false);
  const [emptyTrashDialogVisible, setEmptyTrashDialogVisible] = useState(false);
  const [restoreDialogVisible, setRestoreDialogVisible] = useState(false);

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#86c7fc",
            fontWeight: "bold",
            flex: 1,
          }}
        >
          {data.length} {data.length === 1 ? "Note" : "Notes"} in Trash
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "red",
            padding: 10,
          }}
          onPress={() => setEmptyTrashDialogVisible(true)}
        >
          <Text>Empty</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginLeft: 10,
            padding: 10,
            backgroundColor: "#86c7fc",
          }}
          onPress={() => setRestoreDialogVisible(true)}
        >
          <Text>Restore</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                padding: 15,
                marginVertical: 10,
                backgroundColor: "white",
                elevation: 2,
                borderRadius: 2,
              }}
              onPress={() => {
                setEachItemDialogVisible(true);
                setSelectedNote(item);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                {item.color && (
                  <View
                    style={{
                      backgroundColor: item.color,
                      padding: 5,
                      borderRadius: 5,
                      marginRight: 5,
                    }}
                  />
                )}
                <Text
                  style={{
                    flex: 1,
                  }}
                >
                  {timeDisplay(item.updatedAt)}
                </Text>
                {item.isBookmarked && (
                  <Ionicons name="bookmark" size={24} color={item.color} />
                )}
              </View>
              <Label labelIds={item.labelIds} />
              <Text>{item.content}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <Dialog.Container visible={eachItemDialogVisible}>
        <Dialog.Description>
          What do you want to do with this note?
        </Dialog.Description>
        <Dialog.Button
          label="Delete"
          onPress={() => {
            context.trashNote(selectedNote.id);
            setEachItemDialogVisible(false);
          }}
          style={{
            color: "red",
          }}
        />
        <Dialog.Button
          label="Restore"
          onPress={() => {
            context.restoreNote(selectedNote.id);

            setEachItemDialogVisible(false);
          }}
        />
      </Dialog.Container>

      <Dialog.Container visible={emptyTrashDialogVisible}>
        <Dialog.Title>Empty Trash</Dialog.Title>
        <Dialog.Description>Do you want to empty trash?</Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => setEmptyTrashDialogVisible(false)}
          style={{
            color: "green",
          }}
        />
        <Dialog.Button
          label="Confirm"
          onPress={() => {
            context.emptyTrash();
            setEmptyTrashDialogVisible(false);
          }}
          style={{
            color: "red",
          }}
        />
      </Dialog.Container>

      <Dialog.Container visible={restoreDialogVisible}>
        <Dialog.Title>Restore all</Dialog.Title>
        <Dialog.Description>Do you want to store all?</Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => setRestoreDialogVisible(false)}
          style={{ color: "red" }}
        />
        <Dialog.Button
          label="Confirm"
          onPress={() => {
            trash.forEach((note) => {
              context.restoreNote(note.id);
            });
            setRestoreDialogVisible(false);
          }}
          style={{ color: "green" }}
        />
      </Dialog.Container>
    </View>
  );
}
