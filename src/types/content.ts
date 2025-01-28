export interface ContentItem {
    id: string;
    title: string;
    url: string;
    created_at: string;
    updated_at: string;
    meta?: Record<string, any>;
  }
  
  export interface ContentListResponse {
    content: ContentItem[];
  }
  
  export interface ContentDetailsResponse {
    content: {
      id: string;
      title: string;
      url: string;
      team_id: string;
      meta: Record<string, any>;
      tree: {
        id: string;
        title: string;
        type: string;
        level: number;
        children: Array<any>;
      };
      created_at: string;
      updated_at: string;
    };
  }
  
  export interface NodeContentResponse {
    node: {
      id: string;
      title: string;
      content: string;
      type: string;
      level: number;
    };
  }