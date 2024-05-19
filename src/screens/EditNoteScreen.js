import React, {
  useContext,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { NoteContext } from "../data/store/NoteContext";
import { formatDistanceToNow, format } from "date-fns";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Label from "../components/Label";
const EditNote = ({ navigation, route }) => {
  const context = useContext(NoteContext);
  const { notes, labels, colors } = context;
  const data = notes.find((note) => note.id === route.params.id);
  const [note, setNote] = useState(data.content);
  const contentRef = useRef(null);
  const [isBookmarked, setIsBookmarked] = useState(data.isBookmarked);
  // bottom sheet
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);

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
  const handleBookmarkToggle = () => {
    setIsBookmarked((prev) => !prev);
    context.editNote(data.id, {
      ...data,
      content: note,
      updatedAt: new Date().toString(),
      isBookmarked: !isBookmarked,
    });
  };

  const handleColorChange = (color) => {
    context.editNote(data.id, {
      ...data,
      content: note,
      updatedAt: new Date().toString(),
      color: color,
    });
  };
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    []
  );
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <Label labelIds={data.labelIds} />
        <TextInput
          placeholder="Update the content here"
          ref={contentRef}
          value={note}
          onChangeText={(text) => {
            setNote(text);
            context.editNote(data.id, {
              ...data,
              content: text,
              updatedAt: new Date().toString(),
            });
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: "#f0f0f0",
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
          }}
        >
          Edit {timeDisplay(data.updatedAt)}
        </Text>
        <TouchableOpacity onPress={handleBookmarkToggle}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={25}
            color={data.color}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => sheetRef.current?.expand()}>
          <Ionicons
            name="ellipsis-vertical-outline"
            size={25}
            color={data.color}
          />
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        borderRadius={10}
        backdropComponent={renderBackdrop}
        onChange={(index) => console.log("snapped to index:", index)}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "transparent" }}
        enableDismissOnClose={false}
        style={{ borderRadius: 10, borderWidth: 1, borderColor: "gray" }}
      >
        <View style={{ backgroundColor: "white", height: "100%", padding: 10 }}>
          <FlatList
            horizontal
            data={colors}
            style={{ maxHeight: 70 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleColorChange(item)}>
                <View
                  style={{
                    backgroundColor: item || "white",
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    margin: 5,
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  {item === null && (
                    <Ionicons
                      name="ban-outline"
                      size={32}
                      color="#ababab"
                      style={{ position: "absolute" }}
                    />
                  )}

                  {item === data.color && (
                    <Ionicons name="checkmark" size={30} color="black" />
                  )}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Label labelIds={data.labelIds} />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#f0f0f0",
              marginRight: 5,
              marginBottom: 5,
            }}
            onPress={() => {
              navigation.navigate("ManageLabels", {
                id: data.id,
              });
            }}
          >
            <Text
              style={{
                padding: 4,
                textAlign: "center",
              }}
            >
              +Manage labels
            </Text>
          </TouchableOpacity>
          <ScrollView
            style={{
              flex: 1,
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => {
                sheetRef.current?.close();
              }}
            >
              <Ionicons name="clipboard-outline" size={25} />
              <Text style={styles.textOption}>Copy to clipboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => {
                sheetRef.current?.close();
              }}
            >
              <Ionicons name="share-social-outline" size={25} />
              <Text style={styles.textOption}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => {
                context.deleteNote(data.id);
                navigation.goBack();
              }}
            >
              <Ionicons name="trash" size={25} />
              <Text style={styles.textOption}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => {
                Alert.alert("Copied to clipboard");
              }}
            >
              <Ionicons name="copy" size={25} />
              <Text style={styles.textOption}>Make a copy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => {
                sheetRef.current?.close();
              }}
            >
              <Ionicons name="pin-outline" size={25} />
              <Text style={styles.textOption}>Pin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => {
                sheetRef.current?.close();
              }}
            >
              <Ionicons name="alarm-outline" size={25} />
              <Text style={styles.textOption}>Create a reminder</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetOption: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    marginBottom: 5,
  },
  textOption: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default EditNote;
