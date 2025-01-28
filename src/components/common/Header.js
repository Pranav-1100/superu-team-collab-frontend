import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Bell, User, Settings, Users, Plus, Layout, LogOut } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useTeamStore from '@/store/teamStore';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { currentTeam, fetchTeamMembers, members } = useTeamStore();
  const [userRole, setUserRole] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      fetchTeamMembers(currentTeam.id).then(() => {
        const currentMember = members.find(m => m.user_id === user?.id);
        setUserRole(currentMember?.role);
      });
    }
  }, [currentTeam, user]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin';

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/workspace" className="text-xl font-semibold">
              Docs Collaboration 
            </Link>

            {currentTeam && (
              <nav className="hidden md:flex items-center gap-4">
                <Link
                  href={`/workspace/${currentTeam.id}/work`}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Your Work
                </Link>

                <Link
                  href={`/workspace/${currentTeam.id}/create`}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Create New
                </Link>

                {isOwnerOrAdmin && (
                  <>
                    <Link
                      href={`/workspace/${currentTeam.id}/team-work`}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    >
                      <Layout className="h-4 w-4 inline mr-1" />
                      Team Work
                    </Link>
                    <Link
                      href={`/workspace/${currentTeam.id}/manage`}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    >
                      <Users className="h-4 w-4 inline mr-1" />
                      Manage Team
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Bell className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block">{user?.email}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    href="/workspace/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
