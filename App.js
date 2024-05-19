import { NoteProvider } from "./src/data/store/NoteContext";
import AppNavigation from "./src/navigation/AppNavigation";
export default function App() {
  return (
    <NoteProvider>
      <AppNavigation />
    </NoteProvider>
  );
}
