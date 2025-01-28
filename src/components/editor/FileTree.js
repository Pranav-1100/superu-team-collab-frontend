'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, File, Folder, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

const TreeNode = ({ node, level = 0, activeContentId, teamId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer ${
          node.id === activeContentId ? 'bg-blue-50' : ''
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded-md mr-1"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <File className="h-4 w-4 mr-2 text-gray-400" />
        )}
        <span className="text-sm text-gray-900 truncate">{node.title}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              activeContentId={activeContentId}
              teamId={teamId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContentItem = ({ content, teamId, activeContentId, onSelect }) => {
  const [expanded, setExpanded] = useState(activeContentId === content.id);
  const [treeData, setTreeData] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (expanded && !treeData) {
      fetchTreeData();
    }
  }, [expanded]);

  const fetchTreeData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/${content.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch content structure');

      const data = await response.json();
      setTreeData(data.content);
    } catch (error) {
      console.error('Error fetching tree:', error);
      toast.error('Failed to load content structure');
    }
  };

  return (
    <div className="border-b border-gray-200">
      <Link
        href={`/workspace/${teamId}/edit/${content.id}`}
        className={`block px-4 py-3 hover:bg-gray-50 ${
          content.id === activeContentId ? 'bg-blue-50' : ''
        }`}
        onClick={() => {
          setExpanded(true);
          onSelect?.(content);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <File className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate">{content.title}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(!expanded);
              if (!expanded) fetchTreeData();
            }}
            className="p-1 hover:bg-gray-200 rounded-md ml-2"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </Link>
      {expanded && treeData?.tree && (
        <div className="pl-4 pb-2 bg-gray-50">
          <TreeNode node={treeData.tree} teamId={teamId} activeContentId={activeContentId} />
        </div>
      )}
    </div>
  );
};

export default function FileTree({ teamId, activeContentId }) {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (teamId && token) {
      fetchContents();
    }
  }, [teamId, token]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/team/${teamId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch content');

      const data = await response.json();
      console.log('Content list:', data);
      setContents(data.content || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error.message);
      toast.error('Failed to load content list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push(`/workspace/${teamId}/create`);
  };

  const filteredContents = searchQuery
    ? contents.filter(content => 
        content.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contents;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p className="mb-2">{error}</p>
        <button
          onClick={fetchContents}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleCreateNew}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </button>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContents.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredContents.map((content) => (
              <ContentItem
                key={content.id}
                content={content}
                teamId={teamId}
                activeContentId={activeContentId}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No matching content found' : 'No content yet'}
          </div>
        )}
      </div>
    </div>
  );
}