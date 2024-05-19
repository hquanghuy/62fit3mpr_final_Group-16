import React from "react";
import { View, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
export default function CustomDrawer(props) {
  return (
    <DrawerContentScrollView {...props}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Notes App
      </Text>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
