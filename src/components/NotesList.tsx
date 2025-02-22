import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

interface NotesListProps {
  notes?: Note[];
  onNoteCreate?: (note: { title: string; content: string }) => void;
  onNoteEdit?: (id: string, note: { title: string; content: string }) => void;
  onNoteDelete?: (id: string) => void;
}

const NotesList = ({
  notes = [
    {
      id: '1',
      title: 'Welcome Note',
      content: 'Welcome to your new note-taking app! Click the + button to create a new note.',
      lastModified: new Date()
    },
    {
      id: '2',
      title: 'Getting Started',
      content: 'Click on any note to edit its contents. Your changes will be saved automatically.',
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ],
  onNoteCreate = () => {},
  onNoteEdit = () => {},
  onNoteDelete = () => {}
}: NotesListProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSave = (note: { title: string; content: string }) => {
    if (!note.title.trim() && !note.content.trim()) {
      setIsEditorOpen(false);
      setEditingNote(null);
      return;
    }
    if (editingNote) {
      onNoteEdit(editingNote.id, note);
    } else {
      onNoteCreate(note);
    }
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background min-h-screen">
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNote} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Note
        </Button>
      </div>

      {isEditorOpen ? (
        <NoteEditor
          title={editingNote?.title}
          content={editingNote?.content}
          onSave={handleSave}
          onBack={() => setIsEditorOpen(false)}
          isOpen={isEditorOpen}
        />
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              content={note.content}
              lastModified={note.lastModified}
              onClick={() => handleNoteClick(note)}
              onDelete={() => onNoteDelete(note.id)}
            />
          ))}>
        </div>
      )}
    </div>
  );
};

export default NotesList;
