import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../features/analytics/analyticsSlice';
import StatsCard from '../components/StatsCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Users, Stethoscope, CalendarDays, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.analytics);

    useEffect(() => {
        dispatch(getDashboardStats('admin'));
    }, [dispatch]);

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--secondary)]">System Administration</h1>
                <p className="text-[var(--secondary)]">Global overview of mediCare 2.0 platform performance.</p>
            </header>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Patients"
                    value={stats?.users?.patients || '0'}
                    icon={<Users className="w-6 h-6" />}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Total Doctors"
                    value={stats?.users?.doctors || '0'}
                    icon={<Stethoscope className="w-6 h-6" />}
                    color="bg-indigo-500"
                />
                <StatsCard
                    title="Total Appointments"
                    value={stats?.appointments?.total || '0'}
                    icon={<CalendarDays className="w-6 h-6" />}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Recent (7 Days)"
                    value={stats?.appointments?.recent || '0'}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Distribution Chart */}
                <div className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 italic">Appointment Status Distribution</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.appointments?.distribution || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {(stats?.appointments?.distribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Growth Mock Chart (Professional Filler for UI) */}
                <div className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 italic">Platform Activity (Growth)</h2>
                    <div className="h-80 text-center flex flex-col justify-center text-[var(--secondary)]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.appointments?.distribution || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
