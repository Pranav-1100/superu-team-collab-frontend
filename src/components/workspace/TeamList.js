import Link from 'next/link';
import { Users, ChevronRight } from 'lucide-react';

export default function TeamsList({ teams }) {
  if (!teams?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No teams yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Create a new team to get started with collaboration.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/workspace/${team.id}/work`}
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-500">{team.members_count} members</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}