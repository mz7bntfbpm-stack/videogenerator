'use client';

import { PageShell } from '@/components/global/PageShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';
import { useUser, useUpdateUser, useLogout } from '@/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const updateUser = useUpdateUser();
  const logout = useLogout();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Update local state when user data loads
  useState(() => {
    if (user) {
      setDisplayName(user.displayName);
    }
  });

  const handleUpdateProfile = async () => {
    try {
      await updateUser.mutateAsync({ displayName });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    // In a real app, this would call an API
    setShowPassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    alert('Password updated successfully');
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleDeleteAccount = async () => {
    // In a real app, this would call an API to delete the account
    setShowDelete(false);
    await logout.mutateAsync();
    router.push('/');
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="w-48 h-6 bg-slate-200 rounded mb-4" />
                <div className="space-y-3">
                  <div className="w-full h-10 bg-slate-200 rounded" />
                  <div className="w-32 h-10 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="mt-2 text-slate-600">Manage your profile information and account preferences.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-slate-100 text-slate-500 cursor-not-allowed" 
              />
              <p className="text-xs text-slate-500 mt-1">Contact support to change your email address.</p>
            </div>
            <Input 
              label="Display Name" 
              value={displayName || user?.displayName || ''}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <div className="pt-2">
              <Button 
                onClick={handleUpdateProfile}
                disabled={updateUser.isPending || displayName === user?.displayName}
              >
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Security</h2>
          <p className="text-sm text-slate-600 mb-4">Use a strong password to protect your account.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowPassword(true)}>Change Password</Button>
            <Button variant="outline" onClick={handleLogout} disabled={logout.isPending}>
              {logout.isPending ? 'Logging out...' : 'Log Out'}
            </Button>
          </div>
        </div>

        {/* Your Data Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Data</h2>
          <div className="text-slate-600 text-sm space-y-2">
            <p>The following data is stored for your account:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>All generated videos and their metadata (prompts, styles, settings)</li>
              <li>Saved prompt templates</li>
              <li>Usage statistics and generation history</li>
              <li>Account preferences and settings</li>
            </ul>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-sm text-slate-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="danger" onClick={() => setShowDelete(true)}>Delete Account</Button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/my-videos">
            <div className="bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="text-xl mb-1">🎬</div>
              <span className="text-sm font-medium text-slate-700">My Videos</span>
            </div>
          </Link>
          <Link href="/templates">
            <div className="bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="text-xl mb-1">📝</div>
              <span className="text-sm font-medium text-slate-700">Templates</span>
            </div>
          </Link>
          <Link href="/usage">
            <div className="bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="text-xl mb-1">📊</div>
              <span className="text-sm font-medium text-slate-700">Usage</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={showPassword} onClose={() => setShowPassword(false)} title="Change Password" size="md">
        <form className="space-y-4" onSubmit={handleUpdatePassword}>
          <Input 
            type="password" 
            label="Current Password"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
            required
          />
          <Input 
            type="password" 
            label="New Password"
            value={passwordForm.new}
            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
            required
          />
          <Input 
            type="password" 
            label="Confirm New Password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowPassword(false)}>Cancel</Button>
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Account" size="md">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">This action is irreversible.</p>
            <p className="text-sm text-red-700 mt-2">
              All your videos, templates, and usage data will be permanently deleted. This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount}>Delete My Account</Button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}
