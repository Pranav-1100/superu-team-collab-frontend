const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}
class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  // Auth endpoints
  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/auth/user`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Team endpoints
  async createTeam(name) {
    const response = await fetch(`${this.baseUrl}/team/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse(response);
  }

  async inviteTeamMember(teamId, email, role) {
    const response = await fetch(`${this.baseUrl}/team/invite`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ team_id: teamId, email, role }),
    });
    return this.handleResponse(response);
  }

  async getTeamMembers(teamId) {
    const response = await fetch(`${this.baseUrl}/team/members/${teamId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Content endpoints
  async scrapeContent(url, teamId) {
    const response = await fetch(`${this.baseUrl}/content/scrape`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ url, team_id: teamId }),
    });
    return this.handleResponse(response);
  }

  async getContent(contentId) {
    const response = await fetch(`${this.baseUrl}/content/${contentId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateNodeContent(nodeId, content) {
    const response = await fetch(`${this.baseUrl}/content/node/${nodeId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ content }),
    });
    return this.handleResponse(response);
  }

  async getTeamContent(teamId) {
    const response = await fetch(`${this.baseUrl}/content/team/${teamId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const api = new ApiService();
export default api;