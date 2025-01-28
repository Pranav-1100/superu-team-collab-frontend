'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token, refreshToken, logout } = useAuthStore();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    if (!params.code) {
      setStatus('invalid');
      return;
    }

    if (!isAuthenticated) {
      router.push(`/auth/login?invite=${params.code}`);
      return;
    }

    acceptInvite();
  }, [params.code, isAuthenticated]);

  const acceptInvite = async () => {
    try {
      let currentToken = token;

      const makeRequest = async (tokenToUse) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/team/accept-invite/${params.code}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokenToUse}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 401) {
          // Token expired, try to refresh
          const error = await response.json();
          if (error.code === 'token_expired') {
            const newToken = await refreshToken();
            return makeRequest(newToken); // Retry with new token
          }
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to accept invitation');
        }

        return response.json();
      };

      const data = await makeRequest(currentToken);
      toast.success('Successfully joined the team!');
      router.push('/workspace');
    } catch (error) {
      console.error('Accept invite error:', error);
      if (error.message === 'Unauthorized') {
        toast.error('Your session has expired. Please log in again.');
        logout();
        router.push(`/auth/login?invite=${params.code}`);
        return;
      }
      setStatus('invalid');
      toast.error(error.message || 'This invitation link is invalid or has expired');
    }
  };

  // Loading state
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Processing invitation...</p>
        </div>
      </div>
    );
  }

  // Invalid/Error state
  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <UserPlus className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-6">
              This invitation link is invalid or has expired.
              Please request a new invitation from your team administrator.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push('/workspace')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Go to Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}