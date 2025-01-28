import { create } from 'zustand'
import api from '@/lib/api'

const useTeamStore = create((set, get) => ({
  teams: [],
  currentTeam: null,
  members: [],
  isLoading: false,
  error: null,

  setTeams: (teams) => set({ teams }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setMembers: (members) => set({ members }),

  fetchTeams: async () => {
    set({ isLoading: true });
    try {
      const response = await api.getTeams();
      set({ teams: response.teams, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTeam: async (name) => {
    set({ isLoading: true });
    try {
      const response = await api.createTeam(name);
      set((state) => ({
        teams: [...state.teams, response],
        currentTeam: response,
        isLoading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  inviteTeamMember: async (teamId, email, role) => {
    set({ isLoading: true });
    try {
      const response = await api.inviteTeamMember(teamId, email, role);
      await get().fetchTeamMembers(teamId);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchTeamMembers: async (teamId) => {
    set({ isLoading: true });
    try {
      const response = await api.getTeamMembers(teamId);
      set({ members: response.members, isLoading: false });
      return response.members;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateMemberRole: async (teamId, userId, role) => {
    set({ isLoading: true });
    try {
      await api.updateTeamMemberRole(teamId, userId, role);
      await get().fetchTeamMembers(teamId);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeMember: async (teamId, userId) => {
    set({ isLoading: true });
    try {
      await api.removeTeamMember(teamId, userId);
      set((state) => ({
        members: state.members.filter(member => member.user_id !== userId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useTeamStore;
