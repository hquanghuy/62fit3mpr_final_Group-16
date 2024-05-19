import { useContext, useReducer } from "react";
import React from "react";
import { NOTES, TRASH, COLORS, LABELS } from "../dummy-data";
import { add } from "date-fns";
import { de, tr } from "date-fns/locale";

const NoteContext = React.createContext({
  notes: NOTES,
  trash: TRASH,
  colors: COLORS,
  labels: LABELS,
  addNote: ({ colors, labels, content, updatedAt, isBookmarked }) => {},
  editNote: (id, { colors, labels, content, updatedAt, isBookmarked }) => {},
  deleteNote: (id) => {},
  restoreNote: (id) => {},
  trashNote: (id) => {},
  addLabel: ({ label }) => {},
  updateLabel: (id, { label }) => {},
  deleteLabel: (id) => {},
  emptyTrash: () => {},
});

function noteReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTE":
      const id = new Date().toString() + Math.random().toString();
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id,
            colors: action.payload.colors,
            labels: action.payload.labels,
            content: action.payload.content,
            updatedAt: action.payload.updatedAt,
            isBookmarked: action.payload.isBookmarked,
          },
        ],
      };
    case "EDIT_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.data }
            : note
        ),
      };
    case "DELETE_NOTE":
      const deletedNote = state.notes.find(
        (note) => note.id === action.payload.id
      );
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload.id),
        trash: [...state.trash, deletedNote],
      };
    case "RESTORE_NOTE":
      const restoredNote = state.trash.find(
        (note) => note.id === action.payload.id
      );
      return {
        ...state,
        trash: state.trash.filter((note) => note.id !== action.payload.id),
        notes: [...state.notes, restoredNote],
      };
    case "TRASH_NOTE":
      const trashedNote = state.notes.find(
        (note) => note.id === action.payload.id
      );
      // just delete the note
      return {
        ...state,
        trash: state.trash.filter((note) => note.id !== action.payload.id),
      };
    case "ADD_LABEL":
      return {
        ...state,
        labels: [
          ...state.labels,
          {
            id: new Date().toString() + Math.random().toString(),
            label: action.payload.label,
          },
        ],
      };
    case "UPDATE_LABEL":
      return {
        ...state,
        labels: state.labels.map((label) =>
          label.id === action.payload.id
            ? { ...label, label: action.payload.label }
            : label
        ),
      };
    case "DELETE_LABEL":
      const updatedNotes = state.notes.map((note) => ({
        ...note,
        labelIds: note.labelIds.filter(
          (labelId) => labelId !== action.payload.id
        ),
      }));
      return {
        ...state,
        labels: state.labels.filter((label) => label.id !== action.payload.id),
        notes: updatedNotes,
      };
    case "EMPTY_TRASH":
      return {
        ...state,
        trash: [],
      };
    default:
      return state;
  }
}

function NoteProvider({ children }) {
  const [state, dispatch] = useReducer(noteReducer, {
    notes: NOTES,
    trash: TRASH,
    colors: COLORS,
    labels: LABELS,
  });

  function addNote({ colors, labels, content, updatedAt, isBookmarked }) {
    dispatch({
      type: "ADD_NOTE",
      payload: { colors, labels, content, updatedAt, isBookmarked },
    });
  }

  function editNote(id, data) {
    dispatch({
      type: "EDIT_NOTE",
      payload: { id, data },
    });
  }

  function deleteNote(id) {
    dispatch({
      type: "DELETE_NOTE",
      payload: { id },
    });
  }

  function restoreNote(id) {
    dispatch({
      type: "RESTORE_NOTE",
      payload: { id },
    });
  }

  function trashNote(id) {
    dispatch({
      type: "TRASH_NOTE",
      payload: { id },
    });
  }
  function addLabel({ label }) {
    dispatch({
      type: "ADD_LABEL",
      payload: { label },
    });
  }

  function updateLabel(id, { label }) {
    dispatch({
      type: "UPDATE_LABEL",
      payload: { id, label },
    });
  }

  function deleteLabel(id) {
    dispatch({
      type: "DELETE_LABEL",
      payload: { id },
    });
  }

  function emptyTrash() {
    dispatch({
      type: "EMPTY_TRASH",
    });
  }
  return (
    <NoteContext.Provider
      value={{
        notes: state.notes,
        trash: state.trash,
        colors: state.colors,
        labels: state.labels,
        addNote,
        editNote,
        deleteNote,
        restoreNote,
        trashNote,
        addLabel,
        updateLabel,
        deleteLabel,
        emptyTrash,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export { NoteProvider, NoteContext };
