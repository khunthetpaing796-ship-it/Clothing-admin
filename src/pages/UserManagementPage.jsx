import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiEye, FiCheck, FiX, FiTrash2, FiClock, FiShield, FiSliders, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { getPendingUsers, updateUserAction } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import { useLanguage } from '../context/LanguageContext';

function UserManagementPage() {
  const { showAlert } = useOutletContext();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('PENDING');
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
  const [refreshing, setRefreshing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);

  const countdownRef = useRef(null);
  const intervalRef = useRef(null);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
  });

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

  const fetchPendingUsers = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const data = await getPendingUsers();
      setPendingUsers(data);
      if (!silent) setLoading(false);
    } catch (error) {
      if (!silent) showAlert?.(error.message || t('failed_to_load_users'), 'error');
      else console.error('Auto-refresh failed:', error);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
      setSecondsLeft(30);
    }
  };

  // Save approved/rejected to localStorage
  useEffect(() => {
    localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
  }, [approvedUsers]);
  useEffect(() => {
    localStorage.setItem('rejectedUsers', JSON.stringify(rejectedUsers));
  }, [rejectedUsers]);

  // Initial load and auto‑refresh with countdown
  useEffect(() => {
    fetchPendingUsers();

    // Countdown every second
    countdownRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          fetchPendingUsers(true); // silent refresh
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleAction = async (userId, action, userName) => {
    const isAccept = action === 'ACCEPT';
    const title = isAccept ? t('approve_user') : t('reject_user');
    const message = t('confirm_action_message', { action: isAccept ? t('approve') : t('reject'), userName });
    const confirmText = isAccept ? t('yes_approve') : t('yes_reject');
    const confirmVariant = isAccept ? 'primary' : 'danger';

    openConfirm(title, message, async () => {
      try {
        await updateUserAction(userId, action);
        const movedUser = pendingUsers.find(u => u.id === userId);
        if (!movedUser) return;

        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        const updatedUser = { ...movedUser, status: action === 'ACCEPT' ? 'APPROVED' : 'REJECTED' };
        if (action === 'ACCEPT') {
          setApprovedUsers(prev => [updatedUser, ...prev]);
          showAlert?.(t('user_approved', { userName }), 'success');
        } else {
          setRejectedUsers(prev => [updatedUser, ...prev]);
          showAlert?.(t('user_rejected', { userName }), 'error');
        }
        setSelectedUser(null);
        // Reset countdown after action
        setSecondsLeft(30);
      } catch (error) {
        showAlert?.(error.message || t('action_failed'), 'error');
      }
    }, confirmText, confirmVariant);
  };

  const handleDeleteUser = (userId, userName) => {
    openConfirm(
      t('delete_user'),
      t('confirm_delete_user', { userName }),
      () => {
        if (activeTab === 'APPROVED') {
          setApprovedUsers(prev => prev.filter(u => u.id !== userId));
        } else if (activeTab === 'REJECTED') {
          setRejectedUsers(prev => prev.filter(u => u.id !== userId));
        }
        showAlert?.(t('user_deleted', { userName }), 'error');
        setSecondsLeft(30);
      },
      t('yes_delete'),
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

  // Manual refresh
  const handleManualRefresh = () => {
    fetchPendingUsers();
  };

  let currentUsers = [];
  if (activeTab === 'PENDING') currentUsers = pendingUsers;
  else if (activeTab === 'APPROVED') currentUsers = approvedUsers;
  else currentUsers = rejectedUsers;

  let filteredUsers = [...currentUsers];
  if (activeTab === 'APPROVED' && searchQuery.trim() !== '') {
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
    PENDING: pendingUsers.length,
    APPROVED: approvedUsers.length,
    REJECTED: rejectedUsers.length,
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 transition-colors duration-300">
      <div className="pb-3 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('user_management')}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">{t('monitor_registrations')}</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-6 gap-2 w-full">
        <div className="flex items-center space-x-2 lg:flex-1 justify-start">
          {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => {
            // tab key ကို lowercase ပြောင်းပြီး ဘာသာပြန်ရန်
            const tabKey = tab.toLowerCase(); // 'pending', 'approved', 'rejected'
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                }}
                className={`px-3 py-2 font-semibold text-sm rounded-xl transition-all capitalize ${activeTab === tab
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0070f3] dark:text-blue-400 border-b-2 border-[#0070f3] dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
              >
                {t(tabKey)} ({counts[tab]})   {/* ဘာသာပြန်ပြီး count ကိုပြသည် */}
              </button>
            );
          })}
          {/* Refresh button with countdown */}
          {/* <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handleManualRefresh}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg transition"
              title={t('refresh_now')}
              disabled={refreshing}
            >
              <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            {refreshing && (
              <span className="text-xs text-gray-400 animate-pulse">{t('updating')}</span>
            )}
            {!refreshing && secondsLeft > 0 && (
              <span className="text-xs text-gray-400 min-w-[80px]">
                {t('auto_refresh_in')} {secondsLeft}s
              </span>
            )}
          </div> */}
        </div>

        {activeTab === 'APPROVED' && (
          <div className="w-full lg:flex-1 flex justify-center max-w-xs mx-auto lg:mx-0">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_approved')}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 lg:flex-1 justify-end">
          <button
            onClick={() => setSortType(sortType === 'az' ? 'default' : 'az')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 ${sortType === 'az'
                ? 'bg-[#0070f3] dark:bg-primary-600 text-white border-[#0070f3] dark:border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <FiSliders size={13} /> {t('a_to_z')}
          </button>
          <button
            onClick={() => setSortType(sortType === 'time' ? 'default' : 'time')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 ${sortType === 'time'
                ? 'bg-[#0070f3] dark:bg-primary-600 text-white border-[#0070f3] dark:border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <FiClock size={13} /> {t('updated')}
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              <th className="px-5 py-3.5">{t('user_id')}</th>
              <th className="px-5 py-3.5">{t('name')}</th>
              <th className="px-5 py-3.5">{t('email')}</th>
              <th className="px-5 py-3.5">{t('phone')}</th>
              <th className="px-5 py-3.5 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading && activeTab === 'PENDING' ? (
              <tr><td colSpan="5" className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">{t('no_records')}</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="px-5 py-4 font-mono text-sm font-bold text-gray-800 dark:text-gray-200">{user.id}</td>
                  <td className="px-5 py-4 flex items-center gap-3">
                    <img src={user.avatar_url || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                    <span className="text-gray-800 dark:text-gray-200">{user.name || 'N/A'}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{user.phone_no}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex flex-row items-center justify-end gap-3">
                      <button onClick={() => setSelectedUser(user)} className="p-2 text-gray-500 hover:text-[#0070f3] dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg" title={t('view_details')}>
                        <FiEye size={18} />
                      </button>
                      {activeTab !== 'PENDING' && (
                        <button onClick={() => handleDeleteUser(user.id, user.name)} className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg" title={t('delete')}>
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
        <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 max-w-lg w-full rounded-2xl p-6 shadow-xl relative border border-gray-200 dark:border-gray-800">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <FiX size={20} />
            </button>
            <h4 className="text-center font-bold text-gray-800 dark:text-white mb-4">{t('full_identity')}</h4>
            <div className="flex flex-col items-center mb-4">
              <img src={selectedUser.avatar_url || 'https://via.placeholder.com/80'} className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-200 dark:border-gray-700" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">{t('pending')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div><label className="text-xs text-slate-400 dark:text-gray-500">{t('user_id')}</label><p className="text-sm font-mono text-gray-800 dark:text-gray-200">{selectedUser.id}</p></div>
              <div><label className="text-xs text-slate-400 dark:text-gray-500">{t('name')}</label><p className="text-sm text-gray-800 dark:text-gray-200">{selectedUser.name}</p></div>
              <div><label className="text-xs text-slate-400 dark:text-gray-500">{t('email')}</label><p className="text-sm text-gray-800 dark:text-gray-200">{selectedUser.email}</p></div>
              <div><label className="text-xs text-slate-400 dark:text-gray-500">{t('phone')}</label><p className="text-sm text-gray-800 dark:text-gray-200">{selectedUser.phone_no}</p></div>
              <div><label className="text-xs text-slate-400 dark:text-gray-500">{t('role')}</label><p className="text-sm text-gray-800 dark:text-gray-200">{selectedUser.role || 'USER'}</p></div>
              <div><label className="text-xs text-slate-400 dark:text-gray-500">{t('joined')}</label><p className="text-sm text-gray-800 dark:text-gray-200">{formatReadableDate(selectedUser.created_at)}</p></div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {selectedUser.status === 'PENDING' ? (
                <>
                  <button onClick={() => handleAction(selectedUser.id, 'REJECT', selectedUser.name)} className="flex-1 bg-slate-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 py-2 rounded-lg transition">
                    {t('reject')}
                  </button>
                  <button onClick={() => handleAction(selectedUser.id, 'ACCEPT', selectedUser.name)} className="flex-1 bg-[#0070f3] dark:bg-primary-600 hover:bg-blue-600 dark:hover:bg-primary-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 transition">
                    <FiCheck size={16} /> {t('accept')}
                  </button>
                </>
              ) : (
                <button onClick={() => setSelectedUser(null)} className="w-full bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 py-2 rounded-lg transition">
                  {t('close')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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