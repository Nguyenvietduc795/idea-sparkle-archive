
import React from "react";
import { Idea } from "@/types/idea";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArchiveRestore } from "lucide-react";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: Idea;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onEdit, onDelete, onArchive }) => {
  const getStatusClass = () => {
    switch (idea.status) {
      case "Not Started":
        return "status-not-started";
      case "In Progress":
        return "status-in-progress";
      case "Completed":
        return "status-completed";
      case "Archived":
        return "status-archived";
      default:
        return "";
    }
  };

  return (
    <Card className={cn("idea-card", idea.status === "Archived" ? "opacity-60" : "")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">{idea.title}</CardTitle>
          <Badge variant="outline" className={getStatusClass()}>
            {idea.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(idea.createdAt, { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 mb-2">{idea.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {idea.tags.map((tag) => (
            <span key={tag.id} className="tag">
              {tag.name}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {idea.projectName}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(idea.id)}
          className="h-8 px-2"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        {idea.status !== "Archived" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchive(idea.id)}
            className="h-8 px-2"
          >
            <ArchiveRestore className="h-4 w-4 mr-1" />
            Archive
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(idea.id)}
          className="h-8 px-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
