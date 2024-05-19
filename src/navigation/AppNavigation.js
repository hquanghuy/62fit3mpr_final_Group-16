import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CustomDrawer from "../components/CustomDrawer";
import HomeScreen from "../screens/HomeScreen";
import NewNoteScreen from "../screens/NewNoteScreen";
import EditNote from "../screens/EditNoteScreen";
import ManageLabels from "../screens/ManageLabels";
import LabelsScreen from "../screens/LabelsScreen";
import TrashScreen from "../screens/TrashScreen";
const Stack = createNativeStackNavigator();
function CreateStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notes"
        component={HomeScreen}
        options={{
          title: "Notes",
          headerShown: false,
        }}
      />
      <Stack.Screen name="NewNote" component={NewNoteScreen} />
      <Stack.Screen name="EditNote" component={EditNote} />
      <Stack.Screen
        name="ManageLabels"
        component={ManageLabels}
        options={{
          title: "Manage Labels",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function AppNavigation() {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={CreateStack}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen name="Labels" component={LabelsScreen} />
        <Drawer.Screen name="Trash" component={TrashScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
