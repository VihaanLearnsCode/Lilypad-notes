import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { Note } from "./types";
import { notesService } from "./services/notesService";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";

const NotesApp: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userNotes = await notesService.getAll(user.uid);
      setNotes(userNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user, loadNotes]);
    
  const handleNoteClick = (note:Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    try {
      await notesService.create({
        title,
        content,
        userId: user.uid
      });
      
      // Reload notes to get the new one with proper ID
      await loadNotes();
      setTitle("");
      setContent("");
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote || !selectedNote.id) return;

    try {
      await notesService.update(selectedNote.id, {
        title,
        content
      });
      
      // Reload notes to get updated version
      await loadNotes();
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null);
  }

  const deleteNote = async (event: React.MouseEvent, noteId: string) => {
    event.stopPropagation();
    if (!noteId) return;

    try {
      await notesService.delete(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  if (!user) {
    return <Auth />;
  }

  if (loading) {
    return <div className="loading">Loading your notes...</div>;
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Lilypad Notes</h1>
        <Auth />
      </div>
    <form 
      className = "note-form" 
      onSubmit={(event)=> 
        selectedNote 
        ? handleUpdateNote(event)
        : handleSubmit(event)
      }
    >
      <input
        value = {title}
        onChange = {(event)=> 
          setTitle(event.target.value)
        }
        placeholder = "title"
        required
      ></input>
      <textarea
        value = {content}
        onChange = {(event) =>
          setContent(event.target.value)
         }
        placeholder = "Content"
        rows = {10}
        required
        ></textarea>
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
        <button type = "submit">Add Note</button>
      )}
    </form>
    <div className = "notes-grid">
      {notes.map((note)=> (
        <div 
         className = "note-item"
         onClick={() => handleNoteClick(note)}
        >
        <div className = "notes-header">
          <button
           onClick={(event) => 
            deleteNote(event, note.id || '')
           }
          >
           x
          </button>
        </div>
        <h2> {note.title} </h2>
        <p> {note.content} </p>
      </div>
      ))}

    </div>
  </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotesApp />
    </AuthProvider>
  );
};

export default App;