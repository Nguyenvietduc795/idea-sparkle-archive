
import React, { useState, useEffect } from "react";
import { IdeaFormData, IdeaStatus } from "@/types/idea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useIdeas } from "@/contexts/IdeasContext";

interface IdeaFormProps {
  open: boolean;
  onClose: () => void;
  editingIdeaId?: string;
}

const defaultFormData: IdeaFormData = {
  title: "",
  description: "",
  tags: [],
  projectName: "",
  status: "Not Started",
};

const IdeaForm: React.FC<IdeaFormProps> = ({ open, onClose, editingIdeaId }) => {
  const { addIdea, updateIdea, getIdeaById, projects } = useIdeas();
  const [formData, setFormData] = useState<IdeaFormData>(defaultFormData);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (editingIdeaId) {
      const idea = getIdeaById(editingIdeaId);
      if (idea) {
        setFormData({
          title: idea.title,
          description: idea.description,
          tags: idea.tags.map((tag) => tag.name),
          projectName: idea.projectName,
          status: idea.status,
        });
      }
    } else {
      setFormData(defaultFormData);
    }
  }, [editingIdeaId, getIdeaById, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdeaId) {
      updateIdea(editingIdeaId, formData);
    } else {
      addIdea(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {editingIdeaId ? "Edit Idea" : "Add New Idea"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter idea title"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your idea..."
              className="w-full min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName">Project</Label>
            <Input
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
              className="w-full"
              list="projects"
              required
            />
            <datalist id="projects">
              {projects.map((project) => (
                <option key={project} value={project} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags and press Enter"
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Press Enter to add a tag
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                {editingIdeaId && (
                  <SelectItem value="Archived">Archived</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-idea-red text-white hover:bg-idea-red/90">
              {editingIdeaId ? "Update" : "Add"} Idea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaForm;
