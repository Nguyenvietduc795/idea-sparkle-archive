
export type IdeaStatus = "Not Started" | "In Progress" | "Completed" | "Archived";

export interface IdeaTag {
  id: string;
  name: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  tags: IdeaTag[];
  projectName: string;
  status: IdeaStatus;
}

export interface IdeaFormData {
  title: string;
  description: string;
  tags: string[];
  projectName: string;
  status: IdeaStatus;
}
