import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { NoteContext } from "../data/store/NoteContext";
import { formatDistanceToNow, format } from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import Label from "../components/Label";
export default function HomeScreen({ navigation }) {
  const context = useContext(NoteContext);
  const { notes } = context;

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const [filteredNotes, setFilteredNotes] = useState(notes);

  useEffect(() => {
    const sortedNotes = [...notes]
      .filter((note) =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setFilteredNotes(sortedNotes);
  }, [searchQuery, notes]);

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

  const handleEditNote = (id) => {
    navigation.navigate("EditNote", { id });
  };
  
  return (
    <View
      style={{
        padding: 20,
        flex: 1,
      }}
    >
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} />
        </TouchableOpacity>
        {isSearching ? (
          <TextInput
            style={{
              flex: 1,
              fontSize: 20,
              marginLeft: 10,
              padding: 5,
              borderBottomWidth: 1,
              borderColor: "gray",
            }}
            placeholder="Search notes"
            value={searchQuery}
            onChangeText={setSearchQuery}
            ref={searchRef}
          />
        ) : (
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              flex: 1,
              marginLeft: 20,
            }}
          >
            Notes
          </Text>
        )}

        <TouchableOpacity
          onPress={() => {
            setIsSearching(!isSearching);
            // Clear search query
            setSearchQuery("");
          }}
        >
          <Ionicons name={isSearching ? "close" : "search"} size={28} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {notes.length === 0 ? (
          <Text>Please add a new note</Text>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 16,
                color: "#86c7fc",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </Text>
            <FlatList
              data={filteredNotes}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
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
                    onPress={() => handleEditNote(item.id)}
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
                        <Ionicons
                          name="bookmark"
                          size={24}
                          color={item.color}
                        />
                      )}
                    </View>
                    <Label labelIds={item.labelIds} />
                    <Text>{item.content}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 15,
          right: 15,
        }}
        onPress={() => navigation.navigate("NewNote")}
      >
        <Ionicons name="add-circle" size={50} color={"lightgreen"} />
      </TouchableOpacity>
    </View>
  );
}
