export interface User {
    id: string;
    email: string;
    name?: string;
  }
  
  export interface Team {
    id: string;
    name: string;
    members_count: number;
    created_at: string;
  }
  
  export interface TeamMember {
    id: string;
    user_id: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
  }
  
  export interface Document {
    id: string;
    title: string;
    content: string;
    team_id: string;
    creator_id: string;
    creator_email: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ApiError {
    message: string;
    status?: number;
  }