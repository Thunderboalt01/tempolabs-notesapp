import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface NoteEditorProps {
  title?: string;
  content?: string;
  onSave?: (note: { title: string; content: string }) => void;
  onBack?: () => void;
  isOpen?: boolean;
}

const NoteEditor = ({
  title = "",
  content = "",
  onSave = () => {},
  onBack = () => {},
  isOpen = true,
}: NoteEditorProps) => {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteContent, setNoteContent] = useState(content);

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-background border shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={onBack} size="icon" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="text-xl font-semibold"
          />
        </div>

        <Textarea
          placeholder="Start writing your note here..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="min-h-[400px] resize-none"
        />

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setNoteTitle("");
              setNoteContent("");
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => onSave({ title: noteTitle, content: noteContent })}
          >
            Save Note
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NoteEditor;
