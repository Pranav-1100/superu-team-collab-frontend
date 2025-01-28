import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Users, FileText } from 'lucide-react'
import useTeamStore from '@/store/teamStore'

export default function Sidebar() {
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const pathname = usePathname()
  const { teams, currentTeam } = useTeamStore()

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4">
        <button
          onClick={() => setShowCreateTeam(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Team</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 space-y-4">
          {teams?.map((team) => (
            <div key={team.id}>
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <Users className="h-4 w-4" />
                <span>{team.name}</span>
              </div>
              
              <div className="mt-2 space-y-1">
                <Link
                  href={`/workspace/${team.id}`}
                  className={`block px-4 py-2 text-sm rounded-md ${
                    pathname === `/workspace/${team.id}`
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Documents</span>
                  </div>
                </Link>
                
                <Link
                  href={`/workspace/${team.id}/members`}
                  className={`block px-4 py-2 text-sm rounded-md ${
                    pathname === `/workspace/${team.id}/members`
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}
