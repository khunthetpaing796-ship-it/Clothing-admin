import React, { useState, useEffect } from 'react';
import { FiEye, FiX, FiSliders, FiPackage, FiUser, FiPlus, FiMinus, FiCheck, FiTrash2 } from 'react-icons/fi';
import { getOrders, updateOrderStatus } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

function OrdersPage({ showAlert }) {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [sortType, setSortType] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [apologyNote, setApologyNote] = useState('');
  const [orders, setOrders] = useState([]);
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

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
      showAlert?.(err.message || 'Failed to load orders', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => loadOrders(), 30000);
    return () => clearInterval(interval);
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

  // Approve / Reject with custom confirm dialog
  const handleUpdateStatus = (orderId, newStatus) => {
    const isReject = newStatus === 'REJECTED';
    const title = isReject ? 'Cancel Order' : 'Approve Order';
    const message = isReject
      ? `Are you sure you want to CANCEL this order?`
      : `Are you sure you want to APPROVE this order?`;
    const confirmText = isReject ? 'Yes, Cancel' : 'Yes, Approve';
    const confirmVariant = isReject ? 'danger' : 'primary';

    openConfirm(title, message, async () => {
      try {
        await updateOrderStatus(orderId, newStatus, apologyNote);
        showAlert?.(`Order ${newStatus === 'REJECTED' ? 'cancelled' : 'approved'} successfully`, 'success');
        await loadOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
          setApologyNote('');
        }
      } catch (err) {
        console.error('Status update failed', err);
        showAlert?.(err.message || 'Failed to update order status', 'error');
      }
    }, confirmText, confirmVariant);
  };

  // Delete order with custom confirm dialog (local deletion – no API)
  const handleDeleteOrder = (orderId, customerName) => {
    openConfirm(
      'Delete Order',
      `Permanently delete order #${orderId} for ${customerName}? This action cannot be undone.`,
      () => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        showAlert?.(`Order ${orderId} deleted from local view.`, 'error');
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
          setApologyNote('');
        }
      },
      'Yes, Delete',
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
        <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white tracking-tight">Orders</h2>
        <p className="text-sm text-[#64748b] dark:text-gray-400 mt-0.5">
          Monitor registrations, review records, and configure status parameters.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-5">
        {/* Tabs + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'].map(tab => {
              const count = orders.filter(o => o.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[#eff6ff] text-[#1d4ed8] font-semibold'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setSortType(sortType === 'newest' ? 'oldest' : 'newest')}
            className="px-4 py-2 text-xs font-medium border border-[#e2e8f0] rounded-lg bg-white text-[#334155] hover:bg-gray-50 flex items-center gap-2 self-end sm:self-auto"
          >
            <FiSliders size={13} className="text-gray-400" />
            <span>{sortType === 'newest' ? 'Newest Activity' : 'Oldest Activity'}</span>
          </button>
        </div>

        {/* Orders Table */}
        <div className="w-full overflow-x-auto border border-[#e2e8f0] rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-sm text-gray-700">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-24 text-gray-400 bg-white">
                    <p className="text-sm text-[#64748b]">No records found.</p>
                  </td>
                </tr>
              ) : (
                sortedOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#f8fafc]/50 transition-all">
                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.user?.avatar_url || 'https://via.placeholder.com/40'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-semibold text-gray-900 text-[15px]">{order.user?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{order.user?.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{order.user?.phone_no}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-[15px]">
                      ${Number(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center justify-center p-2 border border-[#e2e8f0] rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                          title="Inspect Order"
                        >
                          <FiEye size={15} className="text-gray-400" />
                        </button>
                        {activeTab !== 'PENDING' && (
                          <button
                            onClick={() => handleDeleteOrder(order.id, order.user?.name || order.id)}
                            className="inline-flex items-center justify-center p-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-500 transition-all"
                            title="Delete Order"
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

      {/* Order Detail Panel (Drawer) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs flex items-center justify-end z-50 p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white border-l sm:border border-[#e2e8f0] w-full max-w-lg h-full sm:h-[calc(100vh-2rem)] sm:rounded-2xl p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div>
                  <span className="text-sm font-bold tracking-widest text-blue-600 font-mono">{selectedOrder.id}</span>
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mt-0.5">
                    <FiPackage className="text-gray-400" /> Order Details
                  </h4>
                </div>
                <button onClick={() => { setSelectedOrder(null); setApologyNote(''); }} className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-lg">
                  <FiX size={18} />
                </button>
              </div>

              <div className="py-4 space-y-5 overflow-y-auto flex-1 pr-1">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-xl space-y-2">
                  <span className="text-sm uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1.5">
                    <FiUser size={14} /> Customer Info
                  </span>
                  <div className="grid grid-cols-3 gap-y-1.5 text-sm">
                    <span className="text-gray-400">Name:</span>
                    <span className="col-span-2 font-semibold text-gray-900">{selectedOrder.user?.name}</span>
                    <span className="text-gray-400">Email:</span>
                    <span className="col-span-2 font-medium text-gray-900 truncate">{selectedOrder.user?.email}</span>
                    <span className="text-gray-400">Phone:</span>
                    <span className="col-span-2 font-mono font-medium text-gray-900">{selectedOrder.user?.phone_no}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm uppercase font-bold tracking-wider text-gray-400 block">Items Placed</span>
                  {selectedOrder.order_lines.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No products in this order.</p>
                  ) : (
                    selectedOrder.order_lines.map(line => (
                      <div key={line.id} className="p-3 border border-[#e2e8f0] bg-white rounded-xl flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {line.variant?.product?.name || 'Unknown Product'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">Variant: {line.variant?.color || 'N/A'}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 border border-[#e2e8f0] rounded-lg p-1">
                          <button
                            disabled={selectedOrder.status !== 'PENDING'}
                            onClick={() => handleUpdateQuantity(selectedOrder.id, line.id, -1)}
                            className="p-1 rounded-md bg-white border border-[#e2e8f0] text-gray-600 hover:text-rose-600 disabled:opacity-50"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-sm font-mono font-bold text-gray-900 px-1 w-6 text-center">{line.quantity}</span>
                          <button
                            disabled={selectedOrder.status !== 'PENDING'}
                            onClick={() => handleUpdateQuantity(selectedOrder.id, line.id, 1)}
                            className="p-1 rounded-md bg-white border border-[#e2e8f0] text-gray-600 hover:text-blue-600 disabled:opacity-50"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <div className="font-mono font-bold text-gray-900 text-sm whitespace-nowrap">
                          ${(line.price * line.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedOrder.status === 'PENDING' && (
                  <div className="space-y-2 pt-1 ml-1">
                    <label className="text-sm uppercase font-bold tracking-wider text-gray-400 block">
                      Adjustment Note / Apology Message
                    </label>
                    <textarea
                      value={apologyNote}
                      onChange={e => setApologyNote(e.target.value)}
                      placeholder="Type a reason or apology message here..."
                      className="w-full h-24 p-3 text-sm bg-gray-50 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e8f0] bg-white space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Value</span>
                <span className="text-3xl font-mono font-bold text-gray-900">
                  ${Number(selectedOrder.total_amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2.5">
                {selectedOrder.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'REJECTED')}
                      className="flex-1 py-2.5 border border-[#e2e8f0] text-gray-700 hover:text-rose-600 font-semibold text-sm rounded-xl"
                    >
                      Cancel Order
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'APPROVED')}
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-gray-900 text-white hover:text-blue-300 font-semibold text-sm py-2.5 rounded-xl"
                    >
                      <FiCheck size={14} /> <span>Approve Order</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setSelectedOrder(null); setApologyNote(''); }}
                    className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl"
                  >
                    Close Panel
                  </button>
                )}
              </div>
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

export default OrdersPage;
