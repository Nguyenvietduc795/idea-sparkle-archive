
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import IdeaCard from "@/components/IdeaCard";
import IdeaForm from "@/components/IdeaForm";
import FilterBar from "@/components/FilterBar";
import { IdeasProvider, useIdeas } from "@/contexts/IdeasContext";
import { Plus, Lightbulb } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { ideas, deleteIdea, archiveIdea } = useIdeas();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdeaId, setEditingIdeaId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const handleEditIdea = (id: string) => {
    setEditingIdeaId(id);
    setIsFormOpen(true);
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      deleteIdea(id);
    }
  };

  const handleArchiveIdea = (id: string) => {
    archiveIdea(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingIdeaId(undefined);
  };

  // Filter ideas based on search and filters
  const filteredIdeas = ideas.filter((idea) => {
    // Filter by archived status first
    if (!showArchived && idea.status === "Archived") {
      return false;
    }

    // Apply text search
    const matchesSearch =
      searchTerm === "" ||
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply project filter
    const matchesProject =
      selectedProject === "" || idea.projectName === selectedProject;

    // Apply tag filter
    const matchesTag =
      selectedTag === "" || idea.tags.some((tag) => tag.name === selectedTag);

    // Apply status filter
    const matchesStatus = selectedStatus === "" || idea.status === selectedStatus;

    return matchesSearch && matchesProject && matchesTag && matchesStatus;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Lightbulb className="h-8 w-8 text-idea-yellow mr-2" />
          <h1 className="text-3xl font-bold">Idea Sparkle</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-idea-red hover:bg-idea-red/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> New Idea
        </Button>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />

      {filteredIdeas.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-10 text-center">
          <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No ideas found</h3>
          <p className="text-muted-foreground mb-4">
            {ideas.length === 0 
              ? "Start by adding your first idea!" 
              : "Try adjusting your filters or search term"}
          </p>
          {ideas.length === 0 && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Idea
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={handleEditIdea}
              onDelete={handleDeleteIdea}
              onArchive={handleArchiveIdea}
            />
          ))}
        </div>
      )}

      <IdeaForm
        open={isFormOpen}
        onClose={handleCloseForm}
        editingIdeaId={editingIdeaId}
      />
    </div>
  );
};

const Index = () => {
  return (
    <IdeasProvider>
      <Dashboard />
    </IdeasProvider>
  );
};

export default Index;
