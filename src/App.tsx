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
      
      await loadNotes();
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = async (event: React.MouseEvent, noteId: string) => {
    event.stopPropagation();
    if (!noteId) return;

    try {
      await notesService.delete(noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (!user) {
    return <Auth />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Lilypad Notes</h1>
          <div className="flex items-center gap-6">
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'create' 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                onClick={() => setActiveView('create')}
              >
                Create Note
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'view' 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                onClick={() => setActiveView('view')}
              >
                View Notes ({notes.length})
              </button>
            </div>
            <Auth />
          </div>
        </header>

        <main className="grid lg:grid-cols-2 gap-8">
          {activeView === 'create' ? (
            <div className="bg-white rounded-xl shadow-xl p-6">
              <form 
                className="space-y-4" 
                onSubmit={(event)=> 
                  selectedNote 
                    ? handleUpdateNote(event)
                    : handleSubmit(event)
                }
              >
                <div>
                  <input
                    value={title}
                    onChange={(event)=> 
                      setTitle(event.target.value)
                    }
                    placeholder="Title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(event.target.value)
                     }
                    placeholder="Content"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                {selectedNote ? (
                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Note
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className="lg:col-span-2">
              {notes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-xl p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2v-4a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2zm0 0h14a2 2 0 002 2v8a2 2 0 01-2-2H6a2 2 0 00-2-2V6a2 2 0 002-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No notes yet</h3>
                  <p className="text-gray-500">Click "Create Note" to add your first note!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {notes.map((note) => (
                    <div 
                      key={note.id}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedNote(note);
                        setTitle(note.title);
                        setContent(note.content);
                        setActiveView('create');
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-2">{note.title}</h3>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteNote(event, note.id || '');
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-600 line-clamp-4 mb-3">{note.content}</p>
                      <div className="text-sm text-gray-400">
                        {note.updatedAt?.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
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
