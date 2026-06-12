import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiEye, FiCheck, FiX, FiTrash2, FiClock, FiShield, FiSliders, FiSearch } from 'react-icons/fi';
import { getPendingUsers, updateUserAction } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

function UserManagementPage() {
  const { showAlert } = useOutletContext();

  const [activeTab, setActiveTab] = useState('pending');
  const [sortType, setSortType] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState(() => {
    const stored = localStorage.getItem('approvedUsers');
    return stored ? JSON.parse(stored) : [];
  });
  const [rejectedUsers, setRejectedUsers] = useState(() => {
    const stored = localStorage.getItem('rejectedUsers');
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
  });

  const intervalRef = useRef(null);

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const openConfirm = (title, message, onConfirm, confirmText = 'Confirm', confirmVariant = 'danger') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeConfirmDialog();
      },
      onCancel: closeConfirmDialog,
      confirmText,
      cancelText: 'Cancel',
      confirmVariant,
    });
  };

  // Fetch pending users from backend
  const fetchPendingUsers = async (silent = false) => {
    try {
      const data = await getPendingUsers();
      setPendingUsers(data);
      if (!silent) setLoading(false);
    } catch (error) {
      if (!silent) showAlert?.(error.message || 'Failed to load pending users', 'error');
      else console.error('Auto-refresh failed:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Save approved/rejected to localStorage
  useEffect(() => {
    localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
  }, [approvedUsers]);
  useEffect(() => {
    localStorage.setItem('rejectedUsers', JSON.stringify(rejectedUsers));
  }, [rejectedUsers]);

  // Initial load
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Auto-refresh only when pending tab is active (30 seconds)
  useEffect(() => {
    if (activeTab === 'pending') {
      intervalRef.current = setInterval(() => {
        fetchPendingUsers(true); // silent refresh
      }, 30000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTab]);

  // Accept / Reject action with custom confirmation
  const handleAction = async (userId, action, userName) => {
    const isAccept = action === 'ACCEPT';
    const title = isAccept ? 'Approve User' : 'Reject User';
    const message = `Are you sure you want to ${isAccept ? 'approve' : 'reject'} user "${userName}"?`;
    const confirmText = isAccept ? 'Yes, Approve' : 'Yes, Reject';
    const confirmVariant = isAccept ? 'primary' : 'danger';

    openConfirm(title, message, async () => {
      try {
        await updateUserAction(userId, action);
        const movedUser = pendingUsers.find(u => u.id === userId);
        if (!movedUser) return;

        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        const updatedUser = { ...movedUser, status: action === 'ACCEPT' ? 'approved' : 'rejected' };
        if (action === 'ACCEPT') {
          setApprovedUsers(prev => [updatedUser, ...prev]);
          showAlert?.(`User "${userName}" has been approved.`, 'success');
        } else {
          setRejectedUsers(prev => [updatedUser, ...prev]);
          showAlert?.(`User "${userName}" has been rejected.`, 'error');
        }
        setSelectedUser(null);
      } catch (error) {
        showAlert?.(error.message || 'Action failed', 'error');
      }
    }, confirmText, confirmVariant);
  };

  // Delete user (approved or rejected only) with custom confirmation
  const handleDeleteUser = (userId, userName) => {
    openConfirm(
      'Delete User',
      `Permanently delete user "${userName}"? This action cannot be undone.`,
      () => {
        if (activeTab === 'approved') {
          setApprovedUsers(prev => prev.filter(u => u.id !== userId));
        } else if (activeTab === 'rejected') {
          setRejectedUsers(prev => prev.filter(u => u.id !== userId));
        }
        showAlert?.(`User "${userName}" has been deleted.`, 'error');
      },
      'Yes, Delete',
      'danger'
    );
  };

  const formatReadableDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  let currentUsers = [];
  if (activeTab === 'pending') currentUsers = pendingUsers;
  else if (activeTab === 'approved') currentUsers = approvedUsers;
  else currentUsers = rejectedUsers;

  let filteredUsers = [...currentUsers];
  if (activeTab === 'approved' && searchQuery.trim() !== '') {
    filteredUsers = filteredUsers.filter(user =>
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (sortType === 'az') {
    filteredUsers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortType === 'time') {
    filteredUsers.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  const counts = {
    pending: pendingUsers.length,
    approved: approvedUsers.length,
    rejected: rejectedUsers.length,
  };

  return (
    <div className="w-full bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900 rounded-2xl shadow-sm p-6 transition-colors duration-300">
      <div className="pb-3 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">User Management</h3>
        <p className="text-xs text-gray-400">Monitor registrations – auto‑refresh every 30 seconds.</p>
      </div>

      {/* Tabs, Search, Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-6 gap-2 w-full">
        <div className="flex items-center space-x-2 lg:flex-1 justify-start">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery('');
              }}
              className={`px-3 py-2 font-semibold text-sm rounded-xl transition-all capitalize ${activeTab === tab
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0070f3] border-b-2 border-[#0070f3]'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {activeTab === 'approved' && (
          <div className="w-full lg:flex-1 flex justify-center max-w-xs mx-auto lg:mx-0">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search approved users..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 lg:flex-1 justify-end">
          <button
            onClick={() => setSortType(sortType === 'az' ? 'default' : 'az')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 ${sortType === 'az' ? 'bg-[#0070f3] text-white' : 'bg-white dark:bg-gray-800'
              }`}
          >
            <FiSliders size={13} /> A to Z
          </button>
          <button
            onClick={() => setSortType(sortType === 'time' ? 'default' : 'time')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 ${sortType === 'time' ? 'bg-[#0070f3] text-white' : 'bg-white dark:bg-gray-800'
              }`}
          >
            <FiClock size={13} /> Updated
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b text-xs font-semibold text-gray-500 uppercase">
              <th className="px-5 py-3.5">User ID</th>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Phone</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && activeTab === 'pending' ? (
              <tr><td colSpan="5" className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-sm text-gray-400">No records found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-4 font-mono text-sm font-bold">{user.id}</td>
                  <td className="px-5 py-4 flex items-center gap-3">
                    <img src={user.avatar_url || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full object-cover" />
                    <span>{user.name || 'N/A'}</span>
                  </td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4">{user.phone_no}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex flex-row items-center justify-end gap-3">
                      <button onClick={() => setSelectedUser(user)} className="p-2 text-gray-500 hover:text-[#0070f3] hover:bg-blue-50 rounded-lg" title="View Details">
                        <FiEye size={18} />
                      </button>
                      {activeTab !== 'pending' && (
                        <button onClick={() => handleDeleteUser(user.id, user.name)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg" title="Delete">
                          <FiTrash2 size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 max-w-lg w-full rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400"><FiX size={20} /></button>
            <h4 className="text-center font-bold mb-4">Full Identity</h4>
            <div className="flex flex-col items-center mb-4">
              <img src={selectedUser.avatar_url || 'https://via.placeholder.com/80'} className="w-20 h-20 rounded-full object-cover mb-2" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100">PENDING</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
              <div><label className="text-xs text-slate-400">ID</label><p className="text-sm font-mono">{selectedUser.id}</p></div>
              <div><label className="text-xs text-slate-400">Name</label><p className="text-sm">{selectedUser.name}</p></div>
              <div><label className="text-xs text-slate-400">Email</label><p className="text-sm">{selectedUser.email}</p></div>
              <div><label className="text-xs text-slate-400">Phone</label><p className="text-sm">{selectedUser.phone_no}</p></div>
              <div><label className="text-xs text-slate-400">Role</label><p className="text-sm">{selectedUser.role || 'USER'}</p></div>
              <div><label className="text-xs text-slate-400">Joined</label><p className="text-sm">{formatReadableDate(selectedUser.created_at)}</p></div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t">
              {activeTab === 'pending' ? (
                <>
                  <button onClick={() => handleAction(selectedUser.id, 'REJECT', selectedUser.name)} className="flex-1 bg-slate-100 hover:bg-red-50 py-2 rounded-lg">Reject</button>
                  <button onClick={() => handleAction(selectedUser.id, 'ACCEPT', selectedUser.name)} className="flex-1 bg-[#0070f3] hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-1"><FiCheck size={16} /> Accept</button>
                </>
              ) : (
                <button onClick={() => setSelectedUser(null)} className="w-full bg-slate-100 py-2 rounded-lg">Close</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        confirmVariant={confirmDialog.confirmVariant}
      />
    </div>
  );
}

export default UserManagementPage;
