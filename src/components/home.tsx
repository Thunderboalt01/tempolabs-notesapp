import React, { useEffect, useState } from "react";
import Header from "./Header";
import NotesList from "./NotesList";
import AuthForm from "./auth/AuthForm";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

const Home = () => {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading notes:", error);
      return;
    }

    const formattedNotes = data.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      lastModified: new Date(note.updated_at),
    }));

    setNotes(formattedNotes);
    setFilteredNotes(formattedNotes);
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredNotes(filtered);
  };

  const handleNoteCreate = async (note: { title: string; content: string }) => {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ title: note.title, content: note.content, user_id: user?.id }])
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
      return;
    }

    const newNote: Note = {
      id: data.id,
      title: data.title,
      content: data.content,
      lastModified: new Date(data.updated_at),
    };

    setNotes((prev) => [newNote, ...prev]);
    setFilteredNotes((prev) => [newNote, ...prev]);
  };

  const handleNoteDelete = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
      return;
    }

    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
  };

  const handleNoteEdit = async (
    id: string,
    updatedNote: { title: string; content: string },
  ) => {
    const { error } = await supabase
      .from("notes")
      .update({ title: updatedNote.title, content: updatedNote.content })
      .eq("id", id);

    if (error) {
      console.error("Error updating note:", error);
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            ...updatedNote,
            lastModified: new Date(),
          }
        : note,
    );
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="pt-20 pb-8">
        <NotesList
          notes={filteredNotes}
          onNoteCreate={handleNoteCreate}
          onNoteEdit={handleNoteEdit}
          onNoteDelete={handleNoteDelete}
        />
      </main>
    </div>
  );
};

export default Home;
