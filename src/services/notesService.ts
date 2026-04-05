import { Note } from '../types';
import { 
  createNote as createNoteInFirestore, 
  getUserNotes, 
  updateNote as updateNoteInFirestore, 
  deleteNote as deleteNoteFromFirestore 
} from '../firebase';
import { Timestamp } from 'firebase/firestore';

export const notesService = {
  create: async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return await createNoteInFirestore(note);
  },

  getAll: async (userId: string): Promise<Note[]> => {
    const firestoreNotes = await getUserNotes(userId);
    return firestoreNotes.map(note => ({
      ...note,
      createdAt: note.createdAt?.toDate(),
      updatedAt: note.updatedAt?.toDate()
    }));
  },

  update: async (noteId: string, updates: Partial<Note>): Promise<void> => {
    // Convert Date objects to Timestamp for Firestore
    const firestoreUpdates = {
      ...updates,
      createdAt: updates.createdAt ? Timestamp.fromDate(updates.createdAt) : undefined,
      updatedAt: updates.updatedAt ? Timestamp.fromDate(updates.updatedAt) : undefined
    };
    await updateNoteInFirestore(noteId, firestoreUpdates);
  },

  delete: async (noteId: string): Promise<void> => {
    await deleteNoteFromFirestore(noteId);
  }
};
