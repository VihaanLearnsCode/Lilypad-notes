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
  const [activeView, setActiveView] = useState<'create' | 'view'>('create');

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
        <div className="header-right">
          <div className="view-tabs">
            <button 
              className={`tab-btn ${activeView === 'create' ? 'active' : ''}`}
              onClick={() => setActiveView('create')}
            >
              Create Note
            </button>
            <button 
              className={`tab-btn ${activeView === 'view' ? 'active' : ''}`}
              onClick={() => setActiveView('view')}
            >
              View Notes ({notes.length})
            </button>
          </div>
          <Auth />
        </div>
      </div>
      {activeView === 'create' ? (
        <div className="create-view">
          <form 
            className="note-form" 
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
        </div>
      ) : (
        <div className="view-view">
          <div className="notes-grid">
            {notes.length === 0 ? (
              <div className="no-notes">
                <h3>No notes yet</h3>
                <p>Click "Create Note" to add your first note!</p>
              </div>
            ) : (
              notes.map((note) => (
                <div 
                  key={note.id}
                  className="note-item"
                  onClick={() => {
                    setSelectedNote(note);
                    setTitle(note.title);
                    setContent(note.content);
                    setActiveView('create');
                  }}
                >
                  <div className="notes-header">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNote(event, note.id || '');
                      }}
                      className="delete-btn"
                    >
                      ×
                    </button>
                  </div>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <div className="note-date">
                    {note.updatedAt?.toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
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