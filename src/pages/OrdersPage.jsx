import React, { useState, useEffect, useRef } from 'react';
import { FiEye, FiX, FiSliders, FiPackage, FiUser, FiPlus, FiMinus, FiCheck, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { getOrders, updateOrderStatus } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import { useLanguage } from '../context/LanguageContext';

function OrdersPage({ showAlert }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('PENDING');
  const [sortType, setSortType] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [apologyNote, setApologyNote] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30); // countdown timer
  const countdownRef = useRef(null);
  const refreshIntervalRef = useRef(null);

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

  // Load orders – called on initial load, manual refresh, and auto‑refresh
  const loadOrders = async (showFullLoader = true) => {
    if (showFullLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
      showAlert?.(err.message || t('failed_to_load_orders'), 'error');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Reset the countdown after a successful refresh
      setSecondsLeft(30);
    }
  };

  // Manual refresh – resets the countdown
  const handleManualRefresh = () => {
    loadOrders(false);
  };

  // Auto‑refresh using countdown
  useEffect(() => {
    // Initial load
    loadOrders(true);

    // Set up countdown interval (every 1 second)
    countdownRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Time to refresh
          loadOrders(false);
          return 30; // reset after refresh
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleUpdateQuantity = async (orderId, lineId, change) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const updatedLines = order.order_lines.map(line =>
          line.id === lineId
            ? { ...line, quantity: Math.max(0, line.quantity + change) }
            : line
        ).filter(line => line.quantity > 0);
        const newTotal = updatedLines.reduce((sum, l) => sum + l.price * l.quantity, 0);
        const updatedOrder = { ...order, order_lines: updatedLines, total_amount: newTotal };
        if (selectedOrder?.id === orderId) setSelectedOrder(updatedOrder);
        return updatedOrder;
      })
    );
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const isReject = newStatus === 'REJECTED';
    const title = isReject ? t('cancel_order') : t('approve_order');
    const message = isReject
      ? t('confirm_cancel_message')
      : t('confirm_approve_message');
    const confirmText = isReject ? t('yes_cancel') : t('yes_approve');
    const confirmVariant = isReject ? 'danger' : 'primary';

    openConfirm(title, message, async () => {
      try {
        await updateOrderStatus(orderId, newStatus, apologyNote);
        showAlert?.(`Order ${newStatus === 'REJECTED' ? t('cancelled') : t('approved')} ${t('successfully')}`, 'success');
        // Refresh quietly and reset countdown
        loadOrders(false);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
          setApologyNote('');
        }
      } catch (err) {
        console.error('Status update failed', err);
        showAlert?.(err.message || t('failed_to_update_status'), 'error');
      }
    }, confirmText, confirmVariant);
  };

  const handleDeleteOrder = (orderId, customerName) => {
    openConfirm(
      t('delete_order'),
      `${t('confirm_delete_message')} #${orderId} ${t('for')} ${customerName}? ${t('action_undo')}`,
      () => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        showAlert?.(`${t('order')} ${orderId} ${t('deleted_local')}`, 'error');
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
          setApologyNote('');
        }
      },
      t('yes_delete'),
      'danger'
    );
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortType === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-gray-950 min-h-screen pl-2 pr-6 pt-0 pb-8 antialiased">
      <div className="mb-3 w-full pl-1 pt-1">
        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white tracking-tight">{t('orders')}</h2>
        <p className="text-sm text-[#64748b] dark:text-gray-400 mt-0.5">
          {t('monitor_orders')}
        </p>
      </div>

      <div className="w-full bg-white dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-5">
        {/* Tabs + Sort + Refresh Button with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'].map(tab => {
              const count = orders.filter(o => o.status === tab).length;
              const labelKey = tab.toLowerCase(); // 'pending', 'approved', 'completed', 'rejected'
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === tab
                      ? 'bg-[#eff6ff] dark:bg-blue-950/40 text-[#1d4ed8] dark:text-blue-400 font-semibold'
                      : 'text-[#64748b] dark:text-gray-400 hover:text-[#0f172a] dark:hover:text-white'
                    }`}
                >
                  {t(labelKey)} ({count})
                </button>
              );
            })}
            {/* Refresh button with countdown */}
            {/* <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleManualRefresh}
                className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg transition"
                title="Refresh now"
                disabled={refreshing}
              >
                <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
              {refreshing && (
                <span className="text-xs text-gray-400 animate-pulse">Updating...</span>
              )}
              {!refreshing && secondsLeft > 0 && (
                <span className="text-xs text-gray-400 min-w-[80px]">
                  Auto‑refresh in {secondsLeft}s
                </span>
              )}
            </div> */}
          </div>
          <button
            onClick={() => setSortType(sortType === 'newest' ? 'oldest' : 'newest')}
            className="px-4 py-2 text-xs font-medium border border-[#e2e8f0] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-[#334155] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 self-end sm:self-auto"
          >
            <FiSliders size={13} className="text-gray-400 dark:text-gray-500" />
            <span>{sortType === 'newest' ? t('newest_activity') : t('oldest_activity')}</span>
          </button>
        </div>

        {/* Orders Table – unchanged */}
        <div className="w-full overflow-x-auto border border-[#e2e8f0] dark:border-gray-700 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-gray-800/50 border-b border-[#e2e8f0] dark:border-gray-700 text-xs font-semibold text-[#64748b] dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">{t('order_id')}</th>
                <th className="px-6 py-4">{t('name')}</th>
                <th className="px-6 py-4">{t('email')}</th>
                <th className="px-6 py-4">{t('phone')}</th>
                <th className="px-6 py-4">{t('total_amount')}</th>
                <th className="px-6 py-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-24 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900">
                    <p className="text-sm text-[#64748b] dark:text-gray-400">{t('no_records')}</p>
                  </td>
                </tr>
              ) : (
                sortedOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#f8fafc]/50 dark:hover:bg-gray-800/30 transition-all">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.user?.avatar_url || 'https://via.placeholder.com/40'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <span className="font-semibold text-gray-900 dark:text-white text-[15px]">{order.user?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{order.user?.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{order.user?.phone_no}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-[15px]">
                      ${Number(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center justify-center p-2 border border-[#e2e8f0] dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all"
                          title={t('inspect_order')}
                        >
                          <FiEye size={15} className="text-gray-400 dark:text-gray-500" />
                        </button>
                        {activeTab !== 'PENDING' && (
                          <button
                            onClick={() => handleDeleteOrder(order.id, order.user?.name || order.id)}
                            className="inline-flex items-center justify-center p-2 border border-red-200 dark:border-red-900/40 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-all"
                            title={t('delete_order')}
                          >
                            <FiTrash2 size={15} />
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
      </div>

      {/* Order Detail Panel – unchanged (fully translated) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/30 dark:bg-black/60 backdrop-blur-xs flex items-center justify-end z-50 p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 border-l sm:border border-[#e2e8f0] dark:border-gray-800 w-full max-w-lg h-full sm:h-[calc(100vh-2rem)] sm:rounded-2xl p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] dark:border-gray-800">
                <div>
                  <span className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 font-mono">{selectedOrder.id}</span>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <FiPackage className="text-gray-400 dark:text-gray-500" /> {t('order_details')}
                  </h4>
                </div>
                <button onClick={() => { setSelectedOrder(null); setApologyNote(''); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg">
                  <FiX size={18} />
                </button>
              </div>

              <div className="py-4 space-y-5 overflow-y-auto flex-1 pr-1">
                <div className="bg-[#f8fafc] dark:bg-gray-800/40 border border-[#e2e8f0] dark:border-gray-700 p-4 rounded-xl space-y-2">
                  <span className="text-sm uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <FiUser size={14} className="text-gray-400 dark:text-gray-500" /> {t('customer_info')}
                  </span>
                  <div className="grid grid-cols-3 gap-y-1.5 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">{t('name')}:</span>
                    <span className="col-span-2 font-semibold text-gray-900 dark:text-white">{selectedOrder.user?.name}</span>
                    <span className="text-gray-400 dark:text-gray-500">{t('email')}:</span>
                    <span className="col-span-2 font-medium text-gray-900 dark:text-white truncate">{selectedOrder.user?.email}</span>
                    <span className="text-gray-400 dark:text-gray-500">{t('phone')}:</span>
                    <span className="col-span-2 font-mono font-medium text-gray-900 dark:text-white">{selectedOrder.user?.phone_no}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 block">{t('items_placed')}</span>
                  {selectedOrder.order_lines.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">{t('no_products_in_order')}</p>
                  ) : (
                    selectedOrder.order_lines.map(line => (
                      <div key={line.id} className="p-3 border border-[#e2e8f0] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {line.variant?.product?.name || t('unknown_product')}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('variant')}: {line.variant?.color || 'N/A'}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 border border-[#e2e8f0] dark:border-gray-600 rounded-lg p-1">
                          <button
                            disabled={selectedOrder.status !== 'PENDING'}
                            onClick={() => handleUpdateQuantity(selectedOrder.id, line.id, -1)}
                            className="p-1 rounded-md bg-white dark:bg-gray-800 border border-[#e2e8f0] dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-50"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-sm font-mono font-bold text-gray-900 dark:text-white px-1 w-6 text-center">{line.quantity}</span>
                          <button
                            disabled={selectedOrder.status !== 'PENDING'}
                            onClick={() => handleUpdateQuantity(selectedOrder.id, line.id, 1)}
                            className="p-1 rounded-md bg-white dark:bg-gray-800 border border-[#e2e8f0] dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <div className="font-mono font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                          ${(line.price * line.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedOrder.status === 'PENDING' && (
                  <div className="space-y-2 pt-1 ml-1">
                    <label className="text-sm uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 block">
                      {t('adjustment_note')}
                    </label>
                    <select
                      value={selectedReason}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedReason(value);
                        if (value) {
                          setApologyNote(value);
                        } else {
                          setApologyNote('');
                        }
                      }}
                      className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-[#e2e8f0] dark:border-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                    >
                      <option value="">{t('select_reason')}</option>
                      <option value={t('reason_stock_issue')}>{t('reason_stock_issue')}</option>
                      <option value={t('reason_cancelled_as_requested')}>{t('reason_cancelled_as_requested')}</option>
                      <option value={t('reason_quantity_adjustment')}>{t('reason_quantity_adjustment')}</option>
                      <option value={t('reason_approved_process')}>{t('reason_approved_process')}</option>
                      <option value={t('reason_cannot_fulfill')}>{t('reason_cannot_fulfill')}</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e8f0] dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('total_value')}</span>
                <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
                  ${Number(selectedOrder.total_amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2.5">
                {selectedOrder.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'REJECTED')}
                      className="flex-1 py-2.5 border border-[#e2e8f0] dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 font-semibold text-sm rounded-xl"
                    >
                      {t('cancel_order')}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'APPROVED')}
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-gray-900 dark:bg-primary-600 hover:bg-gray-800 dark:hover:bg-primary-700 text-white font-semibold text-sm py-2.5 rounded-xl"
                    >
                      <FiCheck size={14} /> <span>{t('approve_order')}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setSelectedOrder(null); setApologyNote(''); }}
                    className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {t('close_panel')}
                  </button>
                )}
              </div>
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

export default OrdersPage;