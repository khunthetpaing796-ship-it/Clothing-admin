import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiEye, FiCheck, FiX, FiTrash2, FiClock, FiShield, FiSliders, FiSearch } from 'react-icons/fi';
import { getPendingUsers, updateUserAction } from '../services/api';

function UserManagementPage() {
  const { showAlert } = useOutletContext();

  // UI state
  const [activeTab, setActiveTab] = useState('pending');
  const [sortType, setSortType] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data state
  const [pendingUsers, setPendingUsers] = useState([]);

  // Persist approved & rejected users in localStorage
  const [approvedUsers, setApprovedUsers] = useState(() => {
    const saved = localStorage.getItem('approvedUsers');
    return saved ? JSON.parse(saved) : [];
  });
  const [rejectedUsers, setRejectedUsers] = useState(() => {
    const saved = localStorage.getItem('rejectedUsers');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever approved/rejected change
  useEffect(() => {
    localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
  }, [approvedUsers]);
  useEffect(() => {
    localStorage.setItem('rejectedUsers', JSON.stringify(rejectedUsers));
  }, [rejectedUsers]);

  // Fetch pending users from backend
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const data = await getPendingUsers();
      setPendingUsers(data);
    } catch (error) {
      showAlert?.(error.message || 'Failed to load pending users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Accept / Reject action (move user from pending to approved/rejected)
  const handleAction = async (userId, action, userName) => {
    try {
      await updateUserAction(userId, action);
      const movedUser = pendingUsers.find(u => u.id === userId);
      if (!movedUser) return;

      // Remove from pending state
      setPendingUsers(prev => prev.filter(u => u.id !== userId));

      // Add to approved or rejected state with lowercase status
      const updatedUser = {
        ...movedUser,
        status: action === 'ACCEPT' ? 'approved' : 'rejected',
        role: movedUser.role || 'USER'
      };

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
  };

  // Delete user from approved tab (also remove from localStorage)
  const handleDeleteUser = (userId, userName) => {
    if (!window.confirm(`Permanently delete user "${userName}"? This action cannot be undone.`)) return;

    if (activeTab === 'approved') {
      setApprovedUsers(prev => prev.filter(u => u.id !== userId));
    } else if (activeTab === 'rejected') {
      setRejectedUsers(prev => prev.filter(u => u.id !== userId));
    }

    showAlert?.(`User "${userName}" has been deleted.`, 'error');
  };

  const formatReadableDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  // Select current user list based on active tab
  let currentUsers = [];
  if (activeTab === 'pending') currentUsers = pendingUsers;
  else if (activeTab === 'approved') currentUsers = approvedUsers;
  else currentUsers = rejectedUsers;

  // Client-side filtering & sorting
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
        <p className="text-xs text-gray-400">Monitor registrations, review records, and configure status parameters.</p>
      </div>

      {/* Tabs + Search + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-6 gap-2 w-full">
        <div className="flex items-center space-x-2 lg:flex-1 justify-start">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery('');
              }}
              className={`px-3 py-2 font-semibold text-sm rounded-xl transition-all capitalize cursor-pointer whitespace-nowrap ${activeTab === tab
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0070f3] border-b-2 border-[#0070f3]'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {activeTab === 'approved' ? (
          <div className="w-full lg:flex-1 flex justify-center max-w-xs mx-auto lg:mx-0">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiSearch size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search approved users..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0070f3] text-gray-800 dark:text-gray-100"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:block lg:flex-1" />
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 lg:flex-1 justify-end">
          <button
            onClick={() => setSortType(sortType === 'az' ? 'default' : 'az')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 flex-1 sm:flex-initial justify-center ${sortType === 'az'
              ? 'bg-[#0070f3] text-white border-[#0070f3] shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <FiSliders size={13} /> <span>A to Z Filter</span>
          </button>
          <button
            onClick={() => setSortType(sortType === 'time' ? 'default' : 'time')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 flex-1 sm:flex-initial justify-center ${sortType === 'time'
              ? 'bg-[#0070f3] text-white border-[#0070f3] shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <FiClock size={13} /> <span>Update Time Filter</span>
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3.5">User ID</th>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Phone</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {loading && activeTab === 'pending' ? (
              <tr><td colSpan="5" className="text-center py-12"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div></td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-sm text-gray-400">No records found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{user.id}</td>
                  <td className="px-5 py-4 flex items-center space-x-3">
                    <img src={user.avatar_url || 'https://via.placeholder.com/40'} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-medium">{user.name || 'N/A'}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{user.phone_no}</td>
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <FiX size={20} />
            </button>
            <h4 className="text-md font-bold text-center mb-5">Full Identity & Registration Validation</h4>
            <div className="flex flex-col items-center mb-6">
              <img src={selectedUser.avatar_url || 'https://via.placeholder.com/80'} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 shadow-sm mb-3" />
              <div className="flex gap-2">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${selectedUser.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedUser.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                  Status: {selectedUser.status?.toUpperCase() || 'PENDING'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0070f3] flex items-center gap-1">
                  <FiShield size={12} /> {selectedUser.role || 'USER'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div><label className="text-xs text-slate-400">User ID</label><p className="text-sm font-mono font-bold text-[#0070f3]">{selectedUser.id}</p></div>
              <div><label className="text-xs text-slate-400">Name</label><p className="text-sm font-medium">{selectedUser.name || 'N/A'}</p></div>
              <div><label className="text-xs text-slate-400">Email</label><p className="text-sm truncate">{selectedUser.email}</p></div>
              <div><label className="text-xs text-slate-400">Phone</label><p className="text-sm">{selectedUser.phone_no}</p></div>
              <div><label className="text-xs text-slate-400">Role</label><p className="text-sm">{selectedUser.role || 'USER'}</p></div>
              <div><label className="text-xs text-slate-400">Status</label><p className="text-sm capitalize">{selectedUser.status}</p></div>
              <div className="sm:col-span-2 border-t pt-2 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-400 flex items-center gap-1"><FiClock size={12} /> Joined</label><p className="text-xs">{formatReadableDate(selectedUser.created_at)}</p></div>
                <div><label className="text-xs text-slate-400 flex items-center gap-1"><FiClock size={12} /> Last Updated</label><p className="text-xs">{formatReadableDate(selectedUser.updated_at)}</p></div>
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-4 border-t">
              {activeTab === 'pending' ? (
                <>
                  <button onClick={() => handleAction(selectedUser.id, 'REJECT', selectedUser.name)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-lg transition">Reject</button>
                  <button onClick={() => handleAction(selectedUser.id, 'ACCEPT', selectedUser.name)} className="flex-1 flex items-center justify-center space-x-2 bg-[#0070f3] hover:bg-blue-600 text-white rounded-lg py-2 transition"><FiCheck size={16} /><span>Approve</span></button>
                </>
              ) : (
                <button onClick={() => setSelectedUser(null)} className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition">Close</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementPage;