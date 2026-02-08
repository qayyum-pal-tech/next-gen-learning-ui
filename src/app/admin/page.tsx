// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuthStore } from '@/store/auth.store';
// import { useRouter } from 'next/navigation';
// import {
//     Users,
//     BookOpen,
//     BarChart3,
//     Clock,
//     ChevronRight,
//     User as UserIcon,
//     Search,
//     AlertCircle
// } from 'lucide-react';
// import { fetchAdminStats, fetchAdminLogs } from '@/utils/apis/roadmapApi';

// export default function AdminDashboard() {
//     const { user } = useAuthStore();
//     const router = useRouter();
//     const [activeTab, setActiveTab] = useState<'metrics' | 'logs'>('metrics');
//     const [stats, setStats] = useState<any>(null);
//     const [logs, setLogs] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         if (user && user.username !== 'admin') {
//             router.push('/dashboard');
//             return;
//         }

//         const loadData = async () => {
//             setLoading(true);
//             try {
//                 const [statsData, logsData] = await Promise.all([
//                     fetchAdminStats(),
//                     fetchAdminLogs()
//                 ]);
//                 setStats(statsData);
//                 setLogs(logsData);
//             } catch (error) {
//                 console.error('Failed to load admin data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user) loadData();
//     }, [user, router]);

//     if (!user || user.username !== 'admin' || loading) {
//         return (
//             <div className="flex items-center justify-center p-24">
//                 <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
//             </div>
//         );
//     }

//     const filteredLogs = logs.filter(log =>
//         log.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         log.topicTitle?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="space-y-8 animate-in fade-in duration-500">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h2 className="text-3xl font-bold text-white tracking-tight">Organization Oversight</h2>
//                     <p className="text-gray-400 mt-1">Monitor learning engagement and professional development</p>
//                 </div>

//                 <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700">
//                     <button
//                         onClick={() => setActiveTab('metrics')}
//                         className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'metrics'
//                             ? 'bg-blue-600 text-white shadow-lg'
//                             : 'text-gray-400 hover:text-white'
//                             }`}
//                     >
//                         Metrics
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('logs')}
//                         className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'logs'
//                             ? 'bg-blue-600 text-white shadow-lg'
//                             : 'text-gray-400 hover:text-white'
//                             }`}
//                     >
//                         User Logs
//                     </button>
//                 </div>
//             </div>

//             {activeTab === 'metrics' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <StatCard
//                         title="Total Users"
//                         value={stats?.userCount || 0}
//                         icon={<Users className="w-6 h-6" />}
//                         color="blue"
//                     />
//                     <StatCard
//                         title="Active Roadmaps"
//                         value={stats?.roadmapCount || 0}
//                         icon={<BookOpen className="w-6 h-6" />}
//                         color="cyan"
//                     />
//                     <StatCard
//                         title="Global Progress"
//                         value={`${stats?.averageProgress || 0}%`}
//                         icon={<BarChart3 className="w-6 h-6" />}
//                         color="purple"
//                     />
//                     <StatCard
//                         title="Time Invested"
//                         value={`${Math.round((stats?.totalLearningMinutes || 0) / 60)}h`}
//                         icon={<Clock className="w-6 h-6" />}
//                         color="emerald"
//                     />

//                     <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8">
//                         <h3 className="text-xl font-bold text-white mb-6">Learning Activity Insight</h3>
//                         <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-2xl">
//                             <p>Engagement Visualization Coming Soon</p>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl overflow-hidden shadow-xl">
//                     <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         <h3 className="text-xl font-bold text-white">Daily Learning Entries</h3>
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                             <input
//                                 type="text"
//                                 placeholder="Search user or topic..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 pr-4 py-2 bg-gray-950 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
//                             />
//                         </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <thead>
//                                 <tr className="bg-gray-950/50 text-gray-400 text-sm uppercase tracking-wider">
//                                     <th className="px-6 py-4 font-semibold">User</th>
//                                     <th className="px-6 py-4 font-semibold">Topic / Goal</th>
//                                     <th className="px-6 py-4 font-semibold">Claimed</th>
//                                     <th className="px-6 py-4 font-semibold">System Tracked</th>
//                                     <th className="px-6 py-4 font-semibold">Date</th>
//                                     <th className="px-6 py-4 font-semibold">Notes</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-800">
//                                 {filteredLogs.map((log, i) => {
//                                     const isDiscrepant = Math.abs(log.minutesSpent - (log.trackedMinutes || 0)) > 10;
//                                     return (
//                                         <tr key={i} className="hover:bg-blue-600/5 transition-colors group text-sm">
//                                             <td className="px-6 py-4">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600">
//                                                         <UserIcon className="w-4 h-4 text-gray-400" />
//                                                     </div>
//                                                     <span className="text-white font-medium">{log.userId?.username || 'Unknown'}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-300">{log.topicTitle}</td>
//                                             <td className="px-6 py-4">
//                                                 <div className={`flex items-center gap-2 font-mono ${isDiscrepant ? 'text-amber-400' : 'text-blue-400'}`}>
//                                                     {log.minutesSpent}m
//                                                     {isDiscrepant && <AlertCircle className="w-4 h-4" />}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="px-2 py-1 bg-gray-800 text-gray-400 rounded-md text-xs font-mono inline-block">
//                                                     {log.trackedMinutes || 0}m
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-400">
//                                                 {new Date(log.timestamp).toLocaleDateString()}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <p className="text-gray-500 text-sm truncate max-w-xs">{log.notes || '-'}</p>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>

//                         {filteredLogs.length === 0 && (
//                             <div className="p-12 text-center">
//                                 <p className="text-gray-500 italic">No learning entries found matching your criteria.</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// function StatCard({ title, value, icon, color }: any) {
//     const colors: any = {
//         blue: 'from-blue-600/20 text-blue-400 border-blue-500/30',
//         cyan: 'from-cyan-600/20 text-cyan-400 border-cyan-500/30',
//         purple: 'from-purple-600/20 text-purple-400 border-purple-500/30',
//         emerald: 'from-emerald-600/20 text-emerald-400 border-emerald-500/30',
//     };

//     return (
//         <div className={`bg-gradient-to-br ${colors[color].split(' ')[0]} to-transparent border ${colors[color].split(' ')[2]} rounded-3xl p-6 shadow-xl`}>
//             <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 bg-gray-900/50 rounded-xl ${colors[color].split(' ')[1]}`}>
//                     {icon}
//                 </div>
//                 <div className="text-gray-500">
//                     <ChevronRight className="w-5 h-5" />
//                 </div>
//             </div>
//             <div className="space-y-1">
//                 <h4 className="text-gray-400 font-medium text-sm">{title}</h4>
//                 <p className="text-3xl font-bold text-white">{value}</p>
//             </div>
//         </div>
//     );
// }
