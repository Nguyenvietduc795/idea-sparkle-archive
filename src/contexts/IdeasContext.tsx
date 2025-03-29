
import React, { createContext, useContext, useState, useEffect } from "react";
import { Idea, IdeaFormData, IdeaStatus, IdeaTag } from "@/types/idea";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface IdeasContextType {
  ideas: Idea[];
  projects: string[];
  tags: IdeaTag[];
  addIdea: (ideaData: IdeaFormData) => void;
  updateIdea: (id: string, ideaData: IdeaFormData) => void;
  deleteIdea: (id: string) => void;
  archiveIdea: (id: string) => void;
  getIdeaById: (id: string) => Idea | undefined;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export const useIdeas = () => {
  const context = useContext(IdeasContext);
  if (!context) {
    throw new Error("useIdeas must be used within an IdeasProvider");
  }
  return context;
};

// Sample data
const sampleIdeas: Idea[] = [
  {
    id: "1",
    title: "Mobile App Redesign",
    description: "Redesign the mobile app interface with a more modern look and improved usability.",
    createdAt: new Date(2023, 10, 15),
    tags: [{ id: "1", name: "Design" }, { id: "2", name: "Mobile" }],
    projectName: "App Refresh",
    status: "In Progress",
  },
  {
    id: "2",
    title: "Blog Content Calendar",
    description: "Create a content calendar for blog posts for the next quarter.",
    createdAt: new Date(2023, 11, 5),
    tags: [{ id: "3", name: "Marketing" }, { id: "4", name: "Content" }],
    projectName: "Content Strategy",
    status: "Not Started",
  },
  {
    id: "3",
    title: "Customer Feedback Integration",
    description: "Implement a system to collect and organize customer feedback for product improvements.",
    createdAt: new Date(2023, 9, 23),
    tags: [{ id: "5", name: "Customer" }, { id: "6", name: "Product" }],
    projectName: "Customer Experience",
    status: "Completed",
  },
];

export const IdeasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const savedIdeas = localStorage.getItem("ideas");
    if (savedIdeas) {
      try {
        const parsedIdeas = JSON.parse(savedIdeas);
        // Convert string dates back to Date objects
        return parsedIdeas.map((idea: any) => ({
          ...idea,
          createdAt: new Date(idea.createdAt),
        }));
      } catch (e) {
        console.error("Error parsing saved ideas:", e);
        return sampleIdeas;
      }
    }
    return sampleIdeas;
  });

  // Extract unique projects and tags
  const projects = [...new Set(ideas.map((idea) => idea.projectName))];
  const tags = Array.from(
    new Set(ideas.flatMap((idea) => idea.tags.map((tag) => JSON.stringify(tag))))
  ).map((tag) => JSON.parse(tag));

  // Save ideas to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);

  const addIdea = (ideaData: IdeaFormData) => {
    const newTags = ideaData.tags.map((tag) => ({
      id: uuidv4(),
      name: tag,
    }));

    const newIdea: Idea = {
      id: uuidv4(),
      ...ideaData,
      tags: newTags,
      createdAt: new Date(),
    };

    setIdeas((prevIdeas) => [...prevIdeas, newIdea]);
    toast.success("Idea added successfully");
  };

  const updateIdea = (id: string, ideaData: IdeaFormData) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id === id) {
          // Convert string tags to tag objects, preserving existing tags where possible
          const updatedTags = ideaData.tags.map((tagName) => {
            const existingTag = idea.tags.find((t) => t.name === tagName);
            return existingTag || { id: uuidv4(), name: tagName };
          });

          return {
            ...idea,
            title: ideaData.title,
            description: ideaData.description,
            tags: updatedTags,
            projectName: ideaData.projectName,
            status: ideaData.status,
          };
        }
        return idea;
      })
    );
    toast.success("Idea updated successfully");
  };

  const deleteIdea = (id: string) => {
    setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    toast.success("Idea deleted successfully");
  };

  const archiveIdea = (id: string) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) =>
        idea.id === id ? { ...idea, status: "Archived" as IdeaStatus } : idea
      )
    );
    toast.success("Idea archived successfully");
  };

  const getIdeaById = (id: string) => {
    return ideas.find((idea) => idea.id === id);
  };

  return (
    <IdeasContext.Provider
      value={{
        ideas,
        projects,
        tags,
        addIdea,
        updateIdea,
        deleteIdea,
        archiveIdea,
        getIdeaById,
      }}
    >
      {children}
    </IdeasContext.Provider>
  );
};
