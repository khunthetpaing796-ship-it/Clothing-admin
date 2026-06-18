// import React, { useState, useEffect } from 'react';
// import { getUsers, updateUserStatus, deleteUser } from '../services/api';
// import { FiCheckCircle, FiXCircle, FiTrash2, FiEye, FiX } from 'react-icons/fi';

// // Mock data (unchanged, same as before)
// const MOCK_USERS = [
//   { id: 'u1', name: 'Alice Wonderland', email: 'alice@ex.com', phone_no: '+95912345601', status: 'PENDING', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg', created_at: '2025-05-10T08:15:00Z', updated_at: '2025-05-10T08:15:00Z' },
//   { id: 'u2', name: 'Bob Builder', email: 'bob@ex.com', phone_no: '+95912345602', status: 'PENDING', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg', created_at: '2025-05-12T10:30:00Z', updated_at: '2025-05-12T10:30:00Z' },
//   { id: 'u3', name: 'Charlie Brown', email: 'charlie@ex.com', phone_no: '+95912345603', status: 'PENDING', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg', created_at: '2025-05-15T14:45:00Z', updated_at: '2025-05-15T14:45:00Z' },
//   { id: 'u4', name: 'Diana Prince', email: 'diana@ex.com', phone_no: '+95912345604', status: 'PENDING', role: 'ADMIN', avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg', created_at: '2025-05-18T09:20:00Z', updated_at: '2025-05-18T09:20:00Z' },
//   { id: 'u5', name: 'Edward Norton', email: 'edward@ex.com', phone_no: '+95912345605', status: 'APPROVED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/5.jpg', created_at: '2025-04-01T11:00:00Z', updated_at: '2025-04-10T16:30:00Z' },
//   { id: 'u6', name: 'Fiona Gallagher', email: 'fiona@ex.com', phone_no: '+95912345606', status: 'APPROVED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/women/6.jpg', created_at: '2025-04-05T09:45:00Z', updated_at: '2025-05-01T12:00:00Z' },
//   { id: 'u7', name: 'George Costanza', email: 'george@ex.com', phone_no: '+95912345607', status: 'APPROVED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/7.jpg', created_at: '2025-04-10T14:20:00Z', updated_at: '2025-05-05T08:15:00Z' },
//   { id: 'u8', name: 'Hermione Granger', email: 'hermione@ex.com', phone_no: '+95912345608', status: 'APPROVED', role: 'ADMIN', avatar_url: 'https://randomuser.me/api/portraits/women/8.jpg', created_at: '2025-03-15T10:00:00Z', updated_at: '2025-05-20T14:45:00Z' },
//   { id: 'u9', name: 'Ivan Drago', email: 'ivan@ex.com', phone_no: '+95912345609', status: 'REJECTED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/9.jpg', created_at: '2025-05-20T12:30:00Z', updated_at: '2025-05-22T09:00:00Z' },
//   { id: 'u10', name: 'Julia Roberts', email: 'julia@ex.com', phone_no: '+95912345610', status: 'REJECTED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/women/10.jpg', created_at: '2025-05-22T15:45:00Z', updated_at: '2025-05-25T11:20:00Z' },
//   { id: 'u11', name: 'Kevin Hart', email: 'kevin@ex.com', phone_no: '+95912345611', status: 'REJECTED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg', created_at: '2025-05-25T08:00:00Z', updated_at: '2025-05-28T16:10:00Z' },
//   { id: 'u12', name: 'Lisa Simpson', email: 'lisa@ex.com', phone_no: '+95912345612', status: 'REJECTED', role: 'ADMIN', avatar_url: 'https://randomuser.me/api/portraits/women/12.jpg', created_at: '2025-05-28T13:20:00Z', updated_at: '2025-05-30T10:30:00Z' },
// ];

// const USE_MOCK_DATA = true; // set false when backend is ready

// function CustomersPage({ showAlert }) {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('PENDING');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   // Filters
//   const [selectedLetter, setSelectedLetter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('all');

//   const fetchUsers = async (status) => {
//     setLoading(true);
//     try {
//       if (USE_MOCK_DATA) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         const filtered = MOCK_USERS.filter(user => user.status === status);
//         setUsers(filtered);
//       } else {
//         const data = await getUsers(status);
//         setUsers(data);
//       }
//     } catch (error) {
//       showAlert(error.message || 'Failed to load users', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers(activeTab);
//   }, [activeTab]);

//   const getFilteredUsers = () => {
//     let filtered = [...users];
//     if (selectedLetter !== 'all') {
//       filtered = filtered.filter(user =>
//         user.name && user.name.toLowerCase().startsWith(selectedLetter.toLowerCase())
//       );
//     }
//     if (dateFilter !== 'all') {
//       const days = parseInt(dateFilter);
//       const cutoff = new Date();
//       cutoff.setDate(cutoff.getDate() - days);
//       filtered = filtered.filter(user => new Date(user.updated_at) >= cutoff);
//     }
//     return filtered;
//   };

//   const handleStatusChange = async (userId, newStatus) => {
//     try {
//       if (USE_MOCK_DATA) {
//         await new Promise(resolve => setTimeout(resolve, 300));
//         setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus, updated_at: new Date().toISOString() } : u));
//         showAlert(`User ${newStatus.toLowerCase()} successfully`, 'success');
//         fetchUsers(activeTab);
//       } else {
//         await updateUserStatus(userId, newStatus);
//         showAlert(`User ${newStatus.toLowerCase()} successfully`, 'success');
//         fetchUsers(activeTab);
//       }
//       // If the current modal user is the one changed, close modal to reflect update
//       if (selectedUser && selectedUser.id === userId) {
//         setModalOpen(false);
//         setSelectedUser(null);
//       }
//     } catch (error) {
//       showAlert(error.message || 'Status update failed', 'error');
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         if (USE_MOCK_DATA) {
//           await new Promise(resolve => setTimeout(resolve, 300));
//           setUsers(prev => prev.filter(u => u.id !== userId));
//           showAlert('User deleted successfully', 'success');
//           fetchUsers(activeTab);
//         } else {
//           await deleteUser(userId);
//           showAlert('User deleted successfully', 'success');
//           fetchUsers(activeTab);
//         }
//         if (selectedUser && selectedUser.id === userId) {
//           setModalOpen(false);
//           setSelectedUser(null);
//         }
//       } catch (error) {
//         showAlert(error.message || 'Delete failed', 'error');
//       }
//     }
//   };

//   const openUserDetails = (user) => {
//     setSelectedUser(user);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedUser(null);
//   };

//   const tabs = [
//     { key: 'PENDING', label: 'Pending' },
//     { key: 'APPROVED', label: 'Approved' },
//     { key: 'REJECTED', label: 'Rejected' },
//   ];

//   const letters = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//   const dateOptions = [
//     { value: 'all', label: 'Any time' },
//     { value: '7', label: 'Last 7 days' },
//     { value: '30', label: 'Last 30 days' },
//     { value: '90', label: 'Last 90 days' },
//   ];

//   const displayedUsers = getFilteredUsers();

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
//         <p className="text-gray-500 dark:text-gray-400">Manage customer accounts – approve/reject from details modal</p>
//       </div>

//       {/* Tabs and filter row */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
//           {tabs.map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
//                 activeTab === tab.key
//                   ? 'bg-primary-600 text-white'
//                   : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-wrap gap-3">
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-600 dark:text-gray-400">Name starts with:</span>
//             <select
//               value={selectedLetter}
//               onChange={(e) => setSelectedLetter(e.target.value)}
//               className="px-3 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-600 text-sm"
//             >
//               {letters.map(letter => (
//                 <option key={letter} value={letter}>
//                   {letter === 'all' ? 'All' : letter}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-600 dark:text-gray-400">Updated in:</span>
//             <select
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//               className="px-3 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-600 text-sm"
//             >
//               {dateOptions.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* User Table */}
//       <div className="card overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//           </div>
//         ) : displayedUsers.length === 0 ? (
//           <div className="text-center py-20 text-gray-500 dark:text-gray-400">
//             No users match the selected filters.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 dark:bg-gray-800/50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {displayedUsers.map(user => (
//                   <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-3">
//                         <img src={user.avatar_url || 'https://via.placeholder.com/40'} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
//                         <span className="font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
//                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.phone_no}</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         user.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
//                         user.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
//                         'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
//                       }`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => openUserDetails(user)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                           title="View Details"
//                         >
//                           <FiEye size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(user.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                           title="Delete User"
//                         >
//                           <FiTrash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* User Details Modal with Approve/Reject buttons */}
//       {modalOpen && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
//             >
//               <FiX size={24} />
//             </button>
//             <div className="text-center mb-4">
//               <img
//                 src={selectedUser.avatar_url || 'https://via.placeholder.com/80'}
//                 alt={selectedUser.name}
//                 className="w-20 h-20 rounded-full mx-auto object-cover"
//               />
//               <h3 className="text-xl font-bold mt-2 text-gray-800 dark:text-white">{selectedUser.name || 'No Name'}</h3>
//               <p className="text-gray-500 dark:text-gray-400">{selectedUser.role}</p>
//               <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
//                 selectedUser.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
//                 selectedUser.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
//                 'bg-yellow-100 text-yellow-800'
//               } dark:bg-opacity-30`}>
//                 {selectedUser.status}
//               </span>
//             </div>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
//                 <span className="font-medium">Email:</span>
//                 <span>{selectedUser.email}</span>
//               </div>
//               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
//                 <span className="font-medium">Phone:</span>
//                 <span>{selectedUser.phone_no}</span>
//               </div>
//               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
//                 <span className="font-medium">User ID:</span>
//                 <span className="text-xs break-all">{selectedUser.id}</span>
//               </div>
//               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
//                 <span className="font-medium">Joined:</span>
//                 <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between pb-2">
//                 <span className="font-medium">Last Updated:</span>
//                 <span>{new Date(selectedUser.updated_at).toLocaleDateString()}</span>
//               </div>
//             </div>

//             {/* Approve/Reject buttons (only for PENDING users) */}
//             {selectedUser.status === 'PENDING' && (
//               <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                   onClick={() => handleStatusChange(selectedUser.id, 'APPROVED')}
//                   className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
//                 >
//                   <FiCheckCircle size={18} /> Approve
//                 </button>
//                 <button
//                   onClick={() => handleStatusChange(selectedUser.id, 'REJECTED')}
//                   className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
//                 >
//                   <FiXCircle size={18} /> Reject
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CustomersPage;


// // import React, { useState, useEffect } from 'react';
// // import { getUsers, updateUserStatus, deleteUser } from '../services/api';
// // import { FiCheckCircle, FiXCircle, FiTrash2, FiRefreshCw, FiEye, FiX, FiArrowUp, FiArrowDown } from 'react-icons/fi';

// // const MOCK_USERS = [
// //   // ========== PENDING ==========
// //   {
// //     id: 'user-001',
// //     name: 'Alice Wonderland',
// //     email: 'alice@example.com',
// //     phone_no: '+95912345601',
// //     status: 'PENDING',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
// //     created_at: '2025-05-10T08:15:00Z',
// //     updated_at: '2025-05-10T08:15:00Z',
// //   },
// //   {
// //     id: 'user-002',
// //     name: 'Bob Builder',
// //     email: 'bob@example.com',
// //     phone_no: '+95912345602',
// //     status: 'PENDING',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
// //     created_at: '2025-05-12T10:30:00Z',
// //     updated_at: '2025-05-12T10:30:00Z',
// //   },
// //   {
// //     id: 'user-003',
// //     name: 'Charlie Brown',
// //     email: 'charlie@example.com',
// //     phone_no: '+95912345603',
// //     status: 'PENDING',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
// //     created_at: '2025-05-15T14:45:00Z',
// //     updated_at: '2025-05-15T14:45:00Z',
// //   },
// //   {
// //     id: 'user-004',
// //     name: 'Diana Prince',
// //     email: 'diana@example.com',
// //     phone_no: '+95912345604',
// //     status: 'PENDING',
// //     role: 'ADMIN',
// //     avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg',
// //     created_at: '2025-05-18T09:20:00Z',
// //     updated_at: '2025-05-18T09:20:00Z',
// //   },

// //   // ========== APPROVED ==========
// //   {
// //     id: 'user-005',
// //     name: 'Edward Norton',
// //     email: 'edward@example.com',
// //     phone_no: '+95912345605',
// //     status: 'APPROVED',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/men/5.jpg',
// //     created_at: '2025-04-01T11:00:00Z',
// //     updated_at: '2025-04-10T16:30:00Z',
// //   },
// //   {
// //     id: 'user-006',
// //     name: 'Fiona Gallagher',
// //     email: 'fiona@example.com',
// //     phone_no: '+95912345606',
// //     status: 'APPROVED',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/women/6.jpg',
// //     created_at: '2025-04-05T09:45:00Z',
// //     updated_at: '2025-05-01T12:00:00Z',
// //   },
// //   {
// //     id: 'user-007',
// //     name: 'George Costanza',
// //     email: 'george@example.com',
// //     phone_no: '+95912345607',
// //     status: 'APPROVED',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/men/7.jpg',
// //     created_at: '2025-04-10T14:20:00Z',
// //     updated_at: '2025-05-05T08:15:00Z',
// //   },
// //   {
// //     id: 'user-008',
// //     name: 'Hermione Granger',
// //     email: 'hermione@example.com',
// //     phone_no: '+95912345608',
// //     status: 'APPROVED',
// //     role: 'ADMIN',
// //     avatar_url: 'https://randomuser.me/api/portraits/women/8.jpg',
// //     created_at: '2025-03-15T10:00:00Z',
// //     updated_at: '2025-05-20T14:45:00Z',
// //   },

// //   // ========== REJECTED ==========
// //   {
// //     id: 'user-009',
// //     name: 'Ivan Drago',
// //     email: 'ivan@example.com',
// //     phone_no: '+95912345609',
// //     status: 'REJECTED',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/men/9.jpg',
// //     created_at: '2025-05-20T12:30:00Z',
// //     updated_at: '2025-05-22T09:00:00Z',
// //   },
// //   {
// //     id: 'user-010',
// //     name: 'Julia Roberts',
// //     email: 'julia@example.com',
// //     phone_no: '+95912345610',
// //     status: 'REJECTED',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/women/10.jpg',
// //     created_at: '2025-05-22T15:45:00Z',
// //     updated_at: '2025-05-25T11:20:00Z',
// //   },
// //   {
// //     id: 'user-011',
// //     name: 'Kevin Hart',
// //     email: 'kevin@example.com',
// //     phone_no: '+95912345611',
// //     status: 'REJECTED',
// //     role: 'USER',
// //     avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg',
// //     created_at: '2025-05-25T08:00:00Z',
// //     updated_at: '2025-05-28T16:10:00Z',
// //   },
// //   {
// //     id: 'user-012',
// //     name: 'Lisa Simpson',
// //     email: 'lisa@example.com',
// //     phone_no: '+95912345612',
// //     status: 'REJECTED',
// //     role: 'ADMIN',
// //     avatar_url: 'https://randomuser.me/api/portraits/women/12.jpg',
// //     created_at: '2025-05-28T13:20:00Z',
// //     updated_at: '2025-05-30T10:30:00Z',
// //   },
// // ];


// // function CustomersPage({ showAlert }) {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('PENDING');
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [modalOpen, setModalOpen] = useState(false);



// //   // Sorting state
// //   const [sortField, setSortField] = useState('name');   // 'name' or 'updated_at'
// //   const [sortOrder, setSortOrder] = useState('asc');    // 'asc' or 'desc'


// //   const USE_MOCK_DATA = true; // set to false to use real backend

// //   const fetchUsers = async (status) => {
// //     setLoading(true);
// //     try {
// //       if (USE_MOCK_DATA) {
// //         // Simulate network delay
// //         await new Promise(resolve => setTimeout(resolve, 500));
// //         const filtered = MOCK_USERS.filter(user => user.status === status);
// //         setUsers(filtered);
// //       } else {
// //         const data = await getUsers(status);
// //         setUsers(data);
// //       }
// //     } catch (error) {
// //       showAlert(error.message || 'Failed to load users', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // const fetchUsers = async (status) => {
// //   //   setLoading(true);
// //   //   try {
// //   //     const data = await getUsers(status);
// //   //     setUsers(data);
// //   //   } catch (error) {
// //   //     showAlert(error.message || 'Failed to load users', 'error');
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };

// //   useEffect(() => {
// //     fetchUsers(activeTab);
// //   }, [activeTab]);

// //   // Apply sorting to the current users list
// //   const getSortedUsers = () => {
// //     const sorted = [...users];
// //     if (sortField === 'name') {
// //       sorted.sort((a, b) => {
// //         const nameA = (a.name || '').toLowerCase();
// //         const nameB = (b.name || '').toLowerCase();
// //         if (sortOrder === 'asc') return nameA.localeCompare(nameB);
// //         else return nameB.localeCompare(nameA);
// //       });
// //     } else if (sortField === 'updated_at') {
// //       sorted.sort((a, b) => {
// //         const dateA = new Date(a.updated_at).getTime();
// //         const dateB = new Date(b.updated_at).getTime();
// //         return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
// //       });
// //     }
// //     return sorted;
// //   };

// //   const handleStatusChange = async (userId, newStatus) => {
// //     try {
// //       await updateUserStatus(userId, newStatus);
// //       showAlert(`User ${newStatus.toLowerCase()} successfully`, 'success');
// //       fetchUsers(activeTab);
// //     } catch (error) {
// //       showAlert(error.message || 'Status update failed', 'error');
// //     }
// //   };

// //   const handleDelete = async (userId) => {
// //     if (window.confirm('Are you sure you want to delete this user?')) {
// //       try {
// //         await deleteUser(userId);
// //         showAlert('User deleted successfully', 'success');
// //         fetchUsers(activeTab);
// //       } catch (error) {
// //         showAlert(error.message || 'Delete failed', 'error');
// //       }
// //     }
// //   };

// //   const openUserDetails = (user) => {
// //     setSelectedUser(user);
// //     setModalOpen(true);
// //   };

// //   const closeModal = () => {
// //     setModalOpen(false);
// //     setSelectedUser(null);
// //   };

// //   const toggleSortOrder = () => {
// //     setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
// //   };

// //   const handleSortFieldChange = (field) => {
// //     if (sortField === field) {
// //       toggleSortOrder();
// //     } else {
// //       setSortField(field);
// //       setSortOrder('asc');
// //     }
// //   };

// //   const tabs = [
// //     { key: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
// //     { key: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
// //     { key: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
// //   ];

// //   const sortedUsers = getSortedUsers();

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
// //         <p className="text-gray-500 dark:text-gray-400">Manage customer accounts (approve/reject pending users)</p>
// //       </div>

// //       {/* Tabs and Sort Bar */}
// //       <div className="flex flex-wrap justify-between items-center gap-4">
// //         <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
// //           {tabs.map(tab => (
// //             <button
// //               key={tab.key}
// //               onClick={() => setActiveTab(tab.key)}
// //               className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${activeTab === tab.key
// //                 ? 'bg-primary-600 text-white'
// //                 : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
// //                 }`}
// //             >
// //               {tab.label}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Sort controls */}
// //         <div className="flex items-center gap-3">
// //           <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
// //           <button
// //             onClick={() => handleSortFieldChange('name')}
// //             className={`px-3 py-1 rounded-md text-sm font-medium transition ${sortField === 'name'
// //               ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
// //               : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'
// //               }`}
// //           >
// //             Name
// //             {sortField === 'name' && (
// //               <span className="ml-1">
// //                 {sortOrder === 'asc' ? <FiArrowUp size={14} className="inline" /> : <FiArrowDown size={14} className="inline" />}
// //               </span>
// //             )}
// //           </button>
// //           <button
// //             onClick={() => handleSortFieldChange('updated_at')}
// //             className={`px-3 py-1 rounded-md text-sm font-medium transition ${sortField === 'updated_at'
// //               ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
// //               : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'
// //               }`}
// //           >
// //             Last Updated
// //             {sortField === 'updated_at' && (
// //               <span className="ml-1">
// //                 {sortOrder === 'asc' ? <FiArrowUp size={14} className="inline" /> : <FiArrowDown size={14} className="inline" />}
// //               </span>
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* User Table */}
// //       <div className="card overflow-hidden">
// //         {loading ? (
// //           <div className="flex justify-center py-20">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
// //           </div>
// //         ) : sortedUsers.length === 0 ? (
// //           <div className="text-center py-20 text-gray-500 dark:text-gray-400">
// //             No {activeTab.toLowerCase()} users found.
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead className="bg-gray-50 dark:bg-gray-800/50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
// //                 {sortedUsers.map(user => (
// //                   <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex items-center gap-3">
// //                         <img
// //                           src={user.avatar_url || 'https://via.placeholder.com/40'}
// //                           alt={user.name}
// //                           className="w-8 h-8 rounded-full object-cover"
// //                         />
// //                         <span className="font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</span>
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
// //                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.phone_no}</td>
// //                     <td className="px-6 py-4">
// //                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
// //                         user.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
// //                           'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
// //                         }`}>
// //                         {user.status}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.role}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex gap-2">
// //                         <button
// //                           onClick={() => openUserDetails(user)}
// //                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
// //                           title="View Details"
// //                         >
// //                           <FiEye size={18} />
// //                         </button>
// //                         {user.status === 'PENDING' && (
// //                           <>
// //                             <button
// //                               onClick={() => handleStatusChange(user.id, 'APPROVED')}
// //                               className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
// //                               title="Approve"
// //                             >
// //                               <FiCheckCircle size={18} />
// //                             </button>
// //                             <button
// //                               onClick={() => handleStatusChange(user.id, 'REJECTED')}
// //                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
// //                               title="Reject"
// //                             >
// //                               <FiXCircle size={18} />
// //                             </button>
// //                           </>
// //                         )}
// //                         {user.status !== 'PENDING' && (
// //                           <button
// //                             onClick={() => handleStatusChange(user.id, 'PENDING')}
// //                             className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
// //                             title="Reset to Pending"
// //                           >
// //                             <FiRefreshCw size={18} />
// //                           </button>
// //                         )}
// //                         <button
// //                           onClick={() => handleDelete(user.id)}
// //                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
// //                           title="Delete User"
// //                         >
// //                           <FiTrash2 size={18} />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       {/* User Details Modal (unchanged) */}
// //       {modalOpen && selectedUser && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// //           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative">
// //             <button
// //               onClick={closeModal}
// //               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
// //             >
// //               <FiX size={24} />
// //             </button>
// //             <div className="text-center mb-4">
// //               <img
// //                 src={selectedUser.avatar_url || 'https://via.placeholder.com/80'}
// //                 alt={selectedUser.name}
// //                 className="w-20 h-20 rounded-full mx-auto object-cover"
// //               />
// //               <h3 className="text-xl font-bold mt-2 text-gray-800 dark:text-white">{selectedUser.name || 'No Name'}</h3>
// //               <p className="text-gray-500 dark:text-gray-400">{selectedUser.role}</p>
// //               <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
// //                 selectedUser.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
// //                   'bg-yellow-100 text-yellow-800'
// //                 } dark:bg-opacity-30`}>
// //                 {selectedUser.status}
// //               </span>
// //             </div>
// //             <div className="space-y-3 text-sm">
// //               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
// //                 <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
// //                 <span className="text-gray-800 dark:text-white">{selectedUser.email}</span>
// //               </div>
// //               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
// //                 <span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span>
// //                 <span className="text-gray-800 dark:text-white">{selectedUser.phone_no}</span>
// //               </div>
// //               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
// //                 <span className="font-medium text-gray-600 dark:text-gray-400">User ID:</span>
// //                 <span className="text-gray-800 dark:text-white text-xs">{selectedUser.id}</span>
// //               </div>
// //               <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
// //                 <span className="font-medium text-gray-600 dark:text-gray-400">Joined:</span>
// //                 <span className="text-gray-800 dark:text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
// //                 <span className="text-gray-800 dark:text-white">{new Date(selectedUser.updated_at).toLocaleDateString()}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default CustomersPage;

// // import React, { useState, useEffect } from 'react';
// // import { getUsers, updateUserStatus, deleteUser } from '../services/api';
// // import { FiCheckCircle, FiXCircle, FiTrash2, FiRefreshCw, FiEye, FiX } from 'react-icons/fi';

// // // Mock data (for testing without backend)
// // const MOCK_USERS = [
// //   // PENDING
// //   { id: 'u1', name: 'Alice Wonderland', email: 'alice@ex.com', phone_no: '+95912345601', status: 'PENDING', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg', created_at: '2025-05-10T08:15:00Z', updated_at: '2025-05-10T08:15:00Z' },
// //   { id: 'u2', name: 'Bob Builder', email: 'bob@ex.com', phone_no: '+95912345602', status: 'PENDING', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg', created_at: '2025-05-12T10:30:00Z', updated_at: '2025-05-12T10:30:00Z' },
// //   { id: 'u3', name: 'Charlie Brown', email: 'charlie@ex.com', phone_no: '+95912345603', status: 'PENDING', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg', created_at: '2025-05-15T14:45:00Z', updated_at: '2025-05-15T14:45:00Z' },
// //   { id: 'u4', name: 'Diana Prince', email: 'diana@ex.com', phone_no: '+95912345604', status: 'PENDING', role: 'ADMIN', avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg', created_at: '2025-05-18T09:20:00Z', updated_at: '2025-05-18T09:20:00Z' },
// //   // APPROVED
// //   { id: 'u5', name: 'Edward Norton', email: 'edward@ex.com', phone_no: '+95912345605', status: 'APPROVED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/5.jpg', created_at: '2025-04-01T11:00:00Z', updated_at: '2025-04-10T16:30:00Z' },
// //   { id: 'u6', name: 'Fiona Gallagher', email: 'fiona@ex.com', phone_no: '+95912345606', status: 'APPROVED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/women/6.jpg', created_at: '2025-04-05T09:45:00Z', updated_at: '2025-05-01T12:00:00Z' },
// //   { id: 'u7', name: 'George Costanza', email: 'george@ex.com', phone_no: '+95912345607', status: 'APPROVED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/7.jpg', created_at: '2025-04-10T14:20:00Z', updated_at: '2025-05-05T08:15:00Z' },
// //   { id: 'u8', name: 'Hermione Granger', email: 'hermione@ex.com', phone_no: '+95912345608', status: 'APPROVED', role: 'ADMIN', avatar_url: 'https://randomuser.me/api/portraits/women/8.jpg', created_at: '2025-03-15T10:00:00Z', updated_at: '2025-05-20T14:45:00Z' },
// //   // REJECTED
// //   { id: 'u9', name: 'Ivan Drago', email: 'ivan@ex.com', phone_no: '+95912345609', status: 'REJECTED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/9.jpg', created_at: '2025-05-20T12:30:00Z', updated_at: '2025-05-22T09:00:00Z' },
// //   { id: 'u10', name: 'Julia Roberts', email: 'julia@ex.com', phone_no: '+95912345610', status: 'REJECTED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/women/10.jpg', created_at: '2025-05-22T15:45:00Z', updated_at: '2025-05-25T11:20:00Z' },
// //   { id: 'u11', name: 'Kevin Hart', email: 'kevin@ex.com', phone_no: '+95912345611', status: 'REJECTED', role: 'USER', avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg', created_at: '2025-05-25T08:00:00Z', updated_at: '2025-05-28T16:10:00Z' },
// //   { id: 'u12', name: 'Lisa Simpson', email: 'lisa@ex.com', phone_no: '+95912345612', status: 'REJECTED', role: 'ADMIN', avatar_url: 'https://randomuser.me/api/portraits/women/12.jpg', created_at: '2025-05-28T13:20:00Z', updated_at: '2025-05-30T10:30:00Z' },
// // ];

// // const USE_MOCK_DATA = true;  // set false when backend is ready

// // function CustomersPage({ showAlert }) {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('PENDING');
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [modalOpen, setModalOpen] = useState(false);

// //   // Filters
// //   const [selectedLetter, setSelectedLetter] = useState('all');
// //   const [dateFilter, setDateFilter] = useState('all'); // 'all', '7', '30', '90'

// //   const fetchUsers = async (status) => {
// //     setLoading(true);
// //     try {
// //       if (USE_MOCK_DATA) {
// //         await new Promise(resolve => setTimeout(resolve, 500));
// //         const filtered = MOCK_USERS.filter(user => user.status === status);
// //         setUsers(filtered);
// //       } else {
// //         const data = await getUsers(status);
// //         setUsers(data);
// //       }
// //     } catch (error) {
// //       showAlert(error.message || 'Failed to load users', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUsers(activeTab);
// //   }, [activeTab]);

// //   // Apply letter and date filters on the current users list
// //   const getFilteredUsers = () => {
// //     let filtered = [...users];

// //     // Filter by first letter
// //     if (selectedLetter !== 'all') {
// //       filtered = filtered.filter(user =>
// //         user.name && user.name.toLowerCase().startsWith(selectedLetter.toLowerCase())
// //       );
// //     }

// //     // Filter by last updated date
// //     if (dateFilter !== 'all') {
// //       const days = parseInt(dateFilter);
// //       const cutoff = new Date();
// //       cutoff.setDate(cutoff.getDate() - days);
// //       filtered = filtered.filter(user => new Date(user.updated_at) >= cutoff);
// //     }

// //     return filtered;
// //   };

// //   const handleStatusChange = async (userId, newStatus) => {
// //     try {
// //       if (USE_MOCK_DATA) {
// //         // Simulate update
// //         await new Promise(resolve => setTimeout(resolve, 300));
// //         setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus, updated_at: new Date().toISOString() } : u));
// //         showAlert(`User ${newStatus.toLowerCase()} successfully`, 'success');
// //         fetchUsers(activeTab);  // refresh from mock
// //       } else {
// //         await updateUserStatus(userId, newStatus);
// //         showAlert(`User ${newStatus.toLowerCase()} successfully`, 'success');
// //         fetchUsers(activeTab);
// //       }
// //     } catch (error) {
// //       showAlert(error.message || 'Status update failed', 'error');
// //     }
// //   };

// //   const handleDelete = async (userId) => {
// //     if (window.confirm('Are you sure you want to delete this user?')) {
// //       try {
// //         if (USE_MOCK_DATA) {
// //           await new Promise(resolve => setTimeout(resolve, 300));
// //           setUsers(prev => prev.filter(u => u.id !== userId));
// //           showAlert('User deleted successfully', 'success');
// //           fetchUsers(activeTab);
// //         } else {
// //           await deleteUser(userId);
// //           showAlert('User deleted successfully', 'success');
// //           fetchUsers(activeTab);
// //         }
// //       } catch (error) {
// //         showAlert(error.message || 'Delete failed', 'error');
// //       }
// //     }
// //   };

// //   const openUserDetails = (user) => {
// //     setSelectedUser(user);
// //     setModalOpen(true);
// //   };

// //   const closeModal = () => {
// //     setModalOpen(false);
// //     setSelectedUser(null);
// //   };

// //   const tabs = [
// //     { key: 'PENDING', label: 'Pending' },
// //     { key: 'APPROVED', label: 'Approved' },
// //     { key: 'REJECTED', label: 'Rejected' },
// //   ];

// //   const letters = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// //   const dateOptions = [
// //     { value: 'all', label: 'Any time' },
// //     { value: '7', label: 'Last 7 days' },
// //     { value: '30', label: 'Last 30 days' },
// //     { value: '90', label: 'Last 90 days' },
// //   ];

// //   const displayedUsers = getFilteredUsers();

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
// //         <p className="text-gray-500 dark:text-gray-400">Manage customer accounts (approve/reject pending users)</p>
// //       </div>

// //       {/* Tabs and filters row */}
// //       <div className="flex flex-wrap justify-between items-center gap-4">
// //         <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
// //           {tabs.map(tab => (
// //             <button
// //               key={tab.key}
// //               onClick={() => setActiveTab(tab.key)}
// //               className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
// //                 activeTab === tab.key
// //                   ? 'bg-primary-600 text-white'
// //                   : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
// //               }`}
// //             >
// //               {tab.label}
// //             </button>
// //           ))}
// //         </div>

// //         <div className="flex flex-wrap gap-3">
// //           {/* Letter filter dropdown */}
// //           <div className="flex items-center gap-2">
// //             <span className="text-sm text-gray-600 dark:text-gray-400">Name starts with:</span>
// //             <select
// //               value={selectedLetter}
// //               onChange={(e) => setSelectedLetter(e.target.value)}
// //               className="px-3 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-600 text-sm"
// //             >
// //               {letters.map(letter => (
// //                 <option key={letter} value={letter}>
// //                   {letter === 'all' ? 'All' : letter}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Date filter dropdown */}
// //           <div className="flex items-center gap-2">
// //             <span className="text-sm text-gray-600 dark:text-gray-400">Updated in:</span>
// //             <select
// //               value={dateFilter}
// //               onChange={(e) => setDateFilter(e.target.value)}
// //               className="px-3 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-600 text-sm"
// //             >
// //               {dateOptions.map(opt => (
// //                 <option key={opt.value} value={opt.value}>{opt.label}</option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>
// //       </div>

// //       {/* User Table */}
// //       <div className="card overflow-hidden">
// //         {loading ? (
// //           <div className="flex justify-center py-20">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
// //           </div>
// //         ) : displayedUsers.length === 0 ? (
// //           <div className="text-center py-20 text-gray-500 dark:text-gray-400">
// //             No users match the selected filters.
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead className="bg-gray-50 dark:bg-gray-800/50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
// //                 {displayedUsers.map(user => (
// //                   <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex items-center gap-3">
// //                         <img src={user.avatar_url || 'https://via.placeholder.com/40'} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
// //                         <span className="font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</span>
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
// //                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.phone_no}</td>
// //                     <td className="px-6 py-4">
// //                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
// //                         user.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
// //                         user.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
// //                         'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
// //                       }`}>
// //                         {user.status}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.role}</td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <div className="flex gap-2">
// //                         <button onClick={() => openUserDetails(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
// //                           <FiEye size={18} />
// //                         </button>
// //                         {user.status === 'PENDING' && (
// //                           <>
// //                             <button onClick={() => handleStatusChange(user.id, 'APPROVED')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
// //                               <FiCheckCircle size={18} />
// //                             </button>
// //                             <button onClick={() => handleStatusChange(user.id, 'REJECTED')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
// //                               <FiXCircle size={18} />
// //                             </button>
// //                           </>
// //                         )}
// //                         {user.status !== 'PENDING' && (
// //                           <button onClick={() => handleStatusChange(user.id, 'PENDING')} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Reset to Pending">
// //                             <FiRefreshCw size={18} />
// //                           </button>
// //                         )}
// //                         <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete User">
// //                           <FiTrash2 size={18} />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       {/* User Details Modal (unchanged) */}
// //       {modalOpen && selectedUser && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// //           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative">
// //             <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400">
// //               <FiX size={24} />
// //             </button>
// //             <div className="text-center mb-4">
// //               <img src={selectedUser.avatar_url || 'https://via.placeholder.com/80'} alt={selectedUser.name} className="w-20 h-20 rounded-full mx-auto object-cover" />
// //               <h3 className="text-xl font-bold mt-2 text-gray-800 dark:text-white">{selectedUser.name || 'No Name'}</h3>
// //               <p className="text-gray-500 dark:text-gray-400">{selectedUser.role}</p>
// //               <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
// //                 selectedUser.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
// //                 selectedUser.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
// //               }`}>
// //                 {selectedUser.status}
// //               </span>
// //             </div>
// //             <div className="space-y-3 text-sm">
// //               <div className="flex justify-between border-b pb-2"><span className="font-medium">Email:</span><span>{selectedUser.email}</span></div>
// //               <div className="flex justify-between border-b pb-2"><span className="font-medium">Phone:</span><span>{selectedUser.phone_no}</span></div>
// //               <div className="flex justify-between border-b pb-2"><span className="font-medium">User ID:</span><span className="text-xs">{selectedUser.id}</span></div>
// //               <div className="flex justify-between border-b pb-2"><span className="font-medium">Joined:</span><span>{new Date(selectedUser.created_at).toLocaleDateString()}</span></div>
// //               <div className="flex justify-between"><span className="font-medium">Last Updated:</span><span>{new Date(selectedUser.updated_at).toLocaleDateString()}</span></div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default CustomersPage;