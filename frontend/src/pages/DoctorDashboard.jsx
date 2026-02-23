import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../context/SocketContext';
import { getAppointments, updateStatus, reset } from '../features/appointments/appointmentSlice';
import { getDashboardStats } from '../features/analytics/analyticsSlice';
import StatsCard from '../components/StatsCard';
import AppointmentItem from '../components/AppointmentItem';
import { toast } from 'react-toastify';
import { FolderOpen, Clock, BarChart2, RefreshCw } from 'lucide-react';

const DoctorDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { appointments, isLoading, isError, message } = useSelector((state) => state.appointments);
    const { stats } = useSelector((state) => state.analytics);

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        dispatch(getAppointments());
        dispatch(getDashboardStats('doctor'));

        if (socket) {
            socket.on('new_appointment', (data) => {
                toast.info(data.message);
                dispatch(getAppointments());
                dispatch(getDashboardStats('doctor'));
            });
            socket.on('patient_profile_updated', (data) => {
                toast.info(data.message);
                dispatch(getAppointments()); // Refresh to get the latest medicalProfile.reports for the doctor's patients
            });
        }

        return () => {
            if (socket) {
                socket.off('new_appointment');
                socket.off('patient_profile_updated');
            }
        };
    }, [dispatch, socket]);

    const onUpdateStatus = (id, status, data = {}) => {
        dispatch(updateStatus({ id, status, ...data }));
        toast.success(`Appointment marked as ${status}`);
        // Refresh stats after status update
        setTimeout(() => dispatch(getDashboardStats('doctor')), 500);
    };

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-3">
                    <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Physician Portal</span>
                    <span className="h-px flex-grow bg-[var(--card-border)]"></span>
                </div>
                <h1 className="text-4xl font-bold text-[var(--primary)] tracking-tight mb-2">Clinical Management</h1>
                <p className="text-[var(--secondary)] font-medium">Welcome, Dr. {user?.lastName}. Monitoring patient intake and diagnostic schedules.</p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <StatsCard
                    title="Clinical Sessions"
                    value={stats?.totalAppointments || '0'}
                    icon={<FolderOpen className="w-6 h-6" />}
                    color="bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xl shadow-[var(--primary)]/10"
                />
                <StatsCard
                    title="Pending Review"
                    value={stats?.distribution?.find(d => d._id === 'pending')?.count || '0'}
                    icon={<Clock className="w-6 h-6 text-[var(--primary)]" />}
                    color="bg-[var(--card)] text-[var(--primary)] border border-[var(--card-border)]"
                />
                <StatsCard
                    title="Analytics (Comp)"
                    value={stats?.distribution?.find(d => d._id === 'completed')?.count || '0'}
                    icon={<BarChart2 className="w-6 h-6 text-[var(--accent)]" />}
                    color="bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                />
            </div>

            <div className="bg-[var(--card)] rounded-[2rem] border border-[var(--card-border)] medical-shadow overflow-hidden">
                <div className="p-8 border-b border-[var(--card-border)] flex justify-between items-center bg-[var(--background)]">
                    <h2 className="text-sm font-bold text-[var(--secondary)] uppercase tracking-[0.2em]">Active Patient Registry</h2>
                    <button
                        onClick={() => dispatch(getAppointments())}
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-3 h-3" /> Synchronize Data
                    </button>
                </div>

                <div className="p-8 min-h-[400px]">
                    {isLoading ? (
                        <div className="animate-pulse flex flex-col gap-6">
                            {[1, 2, 3].map(n => <div key={n} className="h-24 bg-[var(--background)] rounded-3xl w-full"></div>)}
                        </div>
                    ) : appointments?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {appointments
                                .filter(apt => apt.status === 'Pending')
                                .map(apt => (
                                    <AppointmentItem
                                        key={apt._id}
                                        appointment={apt}
                                        role="doctor"
                                        onUpdateStatus={onUpdateStatus}
                                    />
                                ))
                            }
                            {appointments.filter(apt => apt.status !== 'Pending').length > 0 && (
                                <>
                                    <div className="flex items-center gap-4 mt-12 mb-6">
                                        <h3 className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-[0.3em]">Historical Archive</h3>
                                        <span className="h-px flex-grow bg-[var(--card-border)]"></span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 opacity-70">
                                        {appointments
                                            .filter(apt => apt.status !== 'Pending')
                                            .map(apt => (
                                                <AppointmentItem
                                                    key={apt._id}
                                                    appointment={apt}
                                                    role="doctor"
                                                    onUpdateStatus={onUpdateStatus}
                                                />
                                            ))
                                        }
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-[var(--background)] rounded-3xl border border-dashed border-[var(--card-border)]">
                            <p className="text-[var(--secondary)] font-bold uppercase tracking-widest text-xs mb-2">Operational Queue Clear</p>
                            <p className="text-[var(--secondary)] text-sm font-medium opacity-80">No active patient interactions currently registered.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
