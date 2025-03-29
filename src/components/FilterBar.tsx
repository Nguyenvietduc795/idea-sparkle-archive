
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IdeaStatus } from "@/types/idea";
import { Search, X, Filter } from "lucide-react";
import { useIdeas } from "@/contexts/IdeasContext";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedProject,
  setSelectedProject,
  selectedTag,
  setSelectedTag,
  selectedStatus,
  setSelectedStatus,
  showArchived,
  setShowArchived,
}) => {
  const { projects, tags } = useIdeas();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProject("");
    setSelectedTag("");
    setSelectedStatus("");
    setShowArchived(false);
  };

  const hasActiveFilters = 
    selectedProject !== "" || 
    selectedTag !== "" || 
    selectedStatus !== "" || 
    showArchived;

  return (
    <div className="mb-6 space-y-2">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-2.5"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Button 
          variant={isFilterOpen ? "default" : "outline"} 
          size="icon"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={isFilterOpen ? "bg-idea-yellow text-primary-foreground" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 animate-slide-up">
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.name}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showArchived"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="showArchived">Show Archived</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
