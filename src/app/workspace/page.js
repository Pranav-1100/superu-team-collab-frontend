'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { 
  Users, LogOut, Plus, Bell, 
  FileText, Clock, Settings,
  FolderPlus, UserPlus, Layout, Edit, Play
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WorkspacePage() {
  const router = useRouter();
  const { 
    user, teams, pendingInvitations, recentActivity,
    logout, fetchUserInfo 
  } = useAuthStore();
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    fetchUserInfo().catch(console.error);
  }, [fetchUserInfo]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTeamName }),
      });

      if (!response.ok) throw new Error('Failed to create team');

      const data = await response.json();
      toast.success('Team created successfully!');
      setShowCreateTeamModal(false);
      setNewTeamName('');
      fetchUserInfo(); // Refresh teams list
    } catch (error) {
      toast.error('Failed to create team');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Workspace</h1>
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <FolderPlus className="h-5 w-5 mr-1" />
                  Create Team
                </button>
                {teams?.length > 0 && (
                  <Link
                    href={`/workspace/${teams[0].team_id}/create`}
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Create Content
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* {pendingInvitations?.length > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-400" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {pendingInvitations.length}
                  </span>
                </div>
              )}
               */}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        {teams?.length > 0 && (
          <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => setShowCreateTeamModal(true)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <FolderPlus className="h-6 w-6 text-blue-500" />
              <span>Create New Team</span>
            </button>
            {/* <Link
              href={`/workspace/${teams[0].team_id}/create`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <Plus className="h-6 w-6 text-green-500" />
              <span>Create New Content</span>
            </Link> */}
            {/* <Link
              href={`/workspace/${teams[0].team_id}/work`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <Layout className="h-6 w-6 text-purple-500" />
              <span>Team Work</span>
            </Link>
            <Link
              href={`/workspace/${teams[0].team_id}/manage`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <Users className="h-6 w-6 text-indigo-500" />
              <span>Manage Team</span>
            </Link> */}
          </div>
        )}

        {/* Teams Section */}
<div className="mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-medium text-gray-900">Your Teams</h2>
    <button 
      onClick={() => setShowCreateTeamModal(true)}
      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Team
    </button>
  </div>
  
  {teams?.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <div
          key={team.team_id}
          className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
        >
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {team.team_name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Joined {formatDate(team.joined_at)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                team.role === 'owner' 
                  ? 'bg-blue-100 text-blue-800'
                  : team.role === 'admin'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {team.role}
              </span>
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/workspace/${team.team_id}/content`}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                <FileText className="h-4 w-4 mr-1" />
                View Content
              </Link>
              <Link
                href={`/workspace/${team.team_id}/team-work`}
                className="text-sm font-medium text-purple-600 hover:text-purple-500 flex items-center"
              >
                <Layout className="h-4 w-4 mr-1" />
                Team Work
              </Link>
              <Link
                href={`/workspace/${team.team_id}/manage`}
                className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center"
              >
                <Users className="h-4 w-4 mr-1" />
                Manage Team
              </Link>
              <Link
                href={`/workspace/${team.team_id}/work`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <Play className="h-4 w-4 mr-1" />
                Work
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new team.
      </p>
      <div className="mt-6">
        <button
          onClick={() => setShowCreateTeamModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Team
        </button>
      </div>
    </div>
  )}
</div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="border-t border-gray-200">
            {recentActivity?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.content_id} className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Content updated
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create New Team
              </h3>
              <form onSubmit={handleCreateTeam} className="mt-5">
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                    Team Name
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="mt-5 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create Team
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateTeamModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}