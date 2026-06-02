export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
}

//Story
export interface Story {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  avgRating?: number;
  totalRatings?: number;
  genre: string | null;
  tags: string[];
  isPublished: boolean;
  wordCount: number;
  authorId: string;
  author: Pick<User, "id" | "username" | "name" | "avatar">;
  forkedFromId: string | null;
  forkedFrom?: {
    id: string;
    title: string;
    author: { username: string };
  } | null;
  branches?: Branch[];
  collaborators?: Collaborator[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    forks: number;
    branches: number;
  };
}

//Branch
export interface Branch {
  id: string;
  name: string;
  isDefault: boolean;
  storyId: string;
  latestCommitId: string | null;
  createdAt: string;
  updatedAt: string;
  commits?: Commit[];
  _count?: {
    commits: number;
  };
}

//Commit
export interface Commit {
  id: string;
  message: string;
  content: string;
  wordCount: number;
  branchId: string;
  authorId: string;
  author: Pick<User, "id" | "username" | "avatar">;
  parentId: string | null;
  parent?: Pick<Commit, "id" | "message"> | null;
  children?: Pick<Commit, "id" | "message">[];
  createdAt: string;
}

//Collaborator
export interface Collaborator {
  id: string;
  role: "VIEWER" | "EDITOR";
  storyId: string;
  userId: string;
  user: Pick<User, "id" | "username" | "name" | "avatar">;
  createdAt: string;
}

//Publishing
export interface Publishing {
  id: string;
  finalContent: string;
  publishedAt: string;
  isActive: boolean;
  branchId: string;
  branch: Pick<Branch, "id" | "name">;
  avgRating?: number;
  totalRatings?: number;
  userRating?: number | null;
}

//Rating
export interface Rating {
  id: string;
  stars: number;
  publishingId: string;
  userId: string;
  user: Pick<User, "id" | "username" | "avatar">;
  createdAt: string;
}

//BranchTree(For Visualization)
export interface BranchTreeNode {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  commits: {
    id: string;
    message: string;
    parentId: string | null;
    createdAt: string;
    wordCount: number;
    author: Pick<User, "username" | "avatar">;
  }[];
}

//Api Response
export interface ApiError {
  message: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
