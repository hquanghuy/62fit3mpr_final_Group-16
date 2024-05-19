import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NoteContext } from "../data/store/NoteContext";

export default function Label({ labelIds }) {
  const context = useContext(NoteContext);
  const { labels } = context;

  const getLabelName = (id) => {
    const label = labels.find((label) => label.id === id);
    return label ? label.label : "";
  };

  return (
    <View style={styles.container}>
      {labelIds?.map((labelId) => (
        <View key={labelId} style={styles.labelContainer}>
          <Text style={styles.labelText}>{getLabelName(labelId)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
    justifyContent: 'start',
  },
  labelContainer: {
    backgroundColor: "#f0f0f0",
    marginRight: 5,
    marginBottom: 5,
    width: '30%', // This ensures a max of 3 columns
    alignItems: 'center',
  },
  labelText: {
    padding: 4,
  },
});
