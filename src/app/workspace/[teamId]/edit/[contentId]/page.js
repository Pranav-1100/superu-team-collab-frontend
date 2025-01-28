'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TiptapEditor from '@/components/editor/TiptapEditor';
import FileTree from '@/components/editor/FileTree';
import { FileText, Save, Users, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !params.contentId) return;
    fetchContent();
  }, [params.contentId, token]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/${params.contentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      console.log('Content data:', data);
      setContent(data.content);

    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updatedContent) => {
    if (!token) {
      toast.error('You must be logged in to save content');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/${params.contentId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: updatedContent }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      setLastSaved(new Date());
      toast.success('Content saved');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="space-x-4">
          <button
            onClick={fetchContent}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
          <button
            onClick={() => router.push(`/workspace/${params.teamId}`)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Return to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <div
        className={`${
          showSidebar ? 'w-64' : 'w-0'
        } flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {showSidebar && (
          <FileTree 
            teamId={params.teamId} 
            activeContentId={params.contentId}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {showSidebar ? <ChevronLeft /> : <ChevronRight />}
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>{content?.title || 'Untitled Document'}</span>
                  {content?.url && (
                    <a 
                      href={content.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </h1>
                {content?.meta?.description && (
                  <p className="text-sm text-gray-500 mt-1">{content.meta.description}</p>
                )}
                <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                  <span>Created: {new Date(content?.created_at).toLocaleDateString()}</span>
                  {lastSaved && (
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isSaving ? (
                <span className="text-sm text-gray-500 flex items-center">
                  <Save className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </span>
              ) : (
                <span className="text-sm text-green-600 flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto py-8 px-4">
            <TiptapEditor
              contentId={params.contentId}
              initialContent={content?.content || content?.meta?.description || ''}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}