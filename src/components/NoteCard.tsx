import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface NoteCardProps {
  title?: string;
  content?: string;
  lastModified?: Date;
  onClick?: () => void;
  onDelete?: () => void;
}

const NoteCard = ({
  title = "Untitled Note",
  content = "Click to add content to this note...",
  lastModified = new Date(),
  onClick = () => {},
  onDelete = () => {},
}: NoteCardProps) => {
  return (
    <Card
      className="w-full bg-background hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(lastModified, { addSuffix: true })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{content}</p>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
