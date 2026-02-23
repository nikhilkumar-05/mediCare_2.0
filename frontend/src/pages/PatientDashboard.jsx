import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../context/SocketContext';
import { getAppointments, bookAppointment, reset } from '../features/appointments/appointmentSlice';
import { getDashboardStats } from '../features/analytics/analyticsSlice';
import { getDoctors } from '../features/doctors/doctorSlice';
import StatsCard from '../components/StatsCard';
import AppointmentItem from '../components/AppointmentItem';
import FileUpload from '../components/FileUpload';
import { toast } from 'react-toastify';
import { FolderOpen, Building2, Search, IndianRupee, FileText, Download } from 'lucide-react';

const PatientDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { appointments, isLoading, isSuccess, isError, message } = useSelector((state) => state.appointments);
    const { stats } = useSelector((state) => state.analytics);
    const { doctors } = useSelector((state) => state.doctors);

    const [bookData, setBookData] = useState({
        doctorId: '',
        date: '',
        timeSlot: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    // Standard clinical departments
    const medicalDepartments = [
        'Cardiology', 'Dermatology', 'Endocrinology', 'General Physician',
        'Neurology', 'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Other'
    ];

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        dispatch(getAppointments());
        dispatch(getDashboardStats('patient'));
        dispatch(getDoctors());

        if (socket) {
            socket.on('appointment_status_updated', (data) => {
                toast.info(data.message);
                dispatch(getAppointments());
                dispatch(getDashboardStats('patient'));
            });
        }

        return () => {
            if (socket) socket.off('appointment_status_updated');
        };
    }, [dispatch, socket]);

    useEffect(() => {
        dispatch(getDoctors(selectedSpecialty));
    }, [dispatch, selectedSpecialty]);

    const onBookChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const onBookSubmit = (e) => {
        e.preventDefault();
        if (!bookData.doctorId || !bookData.date || !bookData.timeSlot) {
            return toast.error('Please fill all fields');
        }
        dispatch(bookAppointment(bookData));
        setBookData({ doctorId: '', date: '', timeSlot: '' });
    };

    useEffect(() => {
        if (isSuccess && message === 'Appointment booked successfully') {
            toast.success('Appointment Booked!');
        }
        if (isError) {
            toast.error(message);
        }
    }, [isSuccess, isError, message]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-[var(--primary)] tracking-tight mb-2">Patient Records</h1>
                <p className="text-[var(--secondary)] font-medium">Secure access to your medical timeline and specialist bookings.</p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <StatsCard
                    title="Active Records"
                    value={stats?.totalAppointments || '0'}
                    icon={<FolderOpen className="w-6 h-6" />}
                    color="bg-[var(--primary)]/5 text-[var(--primary)]"
                />
                <StatsCard
                    title="Scheduled Visits"
                    value={stats?.upcomingAppointments || '0'}
                    icon={<Building2 className="w-6 h-6" />}
                    color="bg-[var(--accent)] text-[var(--accent)]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Specialists Section */}
                <div className="lg:col-span-2 bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] medical-shadow">
                    <div className="flex flex-col mb-8 gap-5">
                        <h2 className="text-sm font-black text-[var(--secondary)] uppercase tracking-[0.2em]"> Specialist Directory </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Search specialists..."
                                className="w-full px-5 py-3.5 rounded-xl bg-[var(--background)] border-none text-sm focus:ring-2 focus:ring-[var(--accent)] transition-all outline-none font-medium placeholder:text-[var(--secondary)]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="w-full px-5 py-3.5 rounded-xl bg-[var(--background)] border-none text-sm focus:ring-2 focus:ring-[var(--accent)] transition-all outline-none font-medium appearance-none"
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {medicalDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[600px] overflow-y-auto pr-3 pb-4 scrollbar-hide">
                        {(() => {
                            const filtered = (doctors || []).filter(dr => {
                                const nameMatch = `${dr.firstName} ${dr.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
                                const specialtyMatch = !selectedSpecialty || dr.specialty === selectedSpecialty;
                                return nameMatch && specialtyMatch;
                            });

                            if (filtered.length === 0) return (
                                <div className="text-center py-10 text-[var(--secondary)] flex flex-col items-center">
                                    <Search className="w-8 h-8 mb-3" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No specialists found</p>
                                </div>
                            );

                            return filtered.map((dr) => (
                                <div
                                    key={dr._id}
                                    className={`group p-6 rounded-[1.5rem] border transition-all duration-500 cursor-pointer overflow-hidden relative flex flex-col justify-between ${bookData.doctorId === dr._id
                                        ? 'border-[var(--accent)] bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/50 scale-[1.02] ring-1 ring-[var(--accent)] z-10'
                                        : 'border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] hover:shadow-xl hover:-translate-y-1'
                                        }`}
                                    onClick={() => setBookData({ ...bookData, doctorId: dr._id })}
                                >
                                    {/* Subtle animated background gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="relative z-10 flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white text-base font-black shadow-lg shadow-slate-200 shrink-0">
                                            {dr.firstName[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-[var(--primary)] truncate">Dr. {dr.firstName} {dr.lastName}</h3>
                                            {dr.specialty ? (
                                                <span className="inline-block mt-1 px-2.5 py-1 bg-[var(--accent)] text-[var(--accent)] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[var(--accent)]">
                                                    {dr.specialty}
                                                </span>
                                            ) : (
                                                <span className="inline-block mt-1 px-2.5 py-1 bg-[var(--background)] text-[var(--secondary)] rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                    General Practitioner
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {(dr.experience || dr.consultationFee) && (
                                        <div className="flex gap-3 mb-3 text-[9px] font-black uppercase tracking-widest text-[var(--secondary)]">
                                            {dr.experience && <span>{dr.experience} yrs exp</span>}
                                            {dr.consultationFee && <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {dr.consultationFee}</span>}
                                        </div>
                                    )}
                                    <button className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${bookData.doctorId === dr._id
                                        ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]'
                                        : 'bg-[var(--background)] text-[var(--secondary)] group-hover:bg-[var(--primary)] group-hover:text-white'
                                        }`}>
                                        {bookData.doctorId === dr._id ? '✓ Selected Specialist' : 'Select'}
                                    </button>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Booking Form & Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] medical-shadow">
                        <h2 className="text-sm font-black text-[var(--secondary)] uppercase tracking-[0.2em] mb-8">Scheduling Office</h2>
                        <form className="space-y-6" onSubmit={onBookSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest mb-2 ml-1">Appointment Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={bookData.date}
                                        onChange={onBookChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-[var(--background)] border-none text-sm focus:ring-2 focus:ring-[var(--accent)] transition-all outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest mb-2 ml-1">Preferred Slot</label>
                                    <select
                                        name="timeSlot"
                                        value={bookData.timeSlot}
                                        onChange={onBookChange}
                                        className="w-full px-5 py-4 rounded-2xl bg-[var(--background)] border-none text-sm focus:ring-2 focus:ring-[var(--accent)] transition-all outline-none font-medium appearance-none"
                                    >
                                        <option value="">Select available time</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!bookData.doctorId}
                                className="w-full bg-[var(--primary)] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[var(--primary)] shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-[var(--secondary)] disabled:shadow-none"
                            >
                                Process Booking
                            </button>
                        </form>
                    </div>

                    <div className="bg-[var(--accent)] p-8 rounded-3xl medical-shadow text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3 opacity-80">Emergency Response</h3>
                            <p className="text-white text-xl font-bold mb-6 leading-tight">24/7 Clinical Support for Critical Incidents</p>
                            <button className="bg-[var(--card)]/10 backdrop-blur-md text-white border border-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[var(--card)] hover:text-[var(--accent)] transition-all w-full">
                                Dispatch Assistance: 112
                            </button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[var(--card)]/10 rounded-full blur-[80px] transition-transform duration-700 group-hover:scale-150"></div>
                    </div>
                </div>

                {/* Appointment List / Reports */}
                <div className="lg:col-span-3 space-y-12 mt-4">
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-sm font-black text-[var(--secondary)] uppercase tracking-[0.2em]">Medical Records Vault</h2>
                            <div className="h-px flex-grow bg-slate-100"></div>
                        </div>
                        <div className="bg-[var(--card)] p-10 rounded-3xl border border-[var(--card-border)] medical-shadow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                                <div className="flex-1 max-w-md">
                                    <h3 className="font-bold text-[var(--primary)] text-lg mb-2">Diagnostic Report Ledger</h3>
                                    <p className="text-sm text-[var(--secondary)] leading-relaxed font-medium mb-6">Archive your clinical documents, lab results, and diagnostic imaging for physician evaluation.</p>

                                    {/* Uploaded Reports List */}
                                    <div className="space-y-3 mt-4">
                                        {user?.medicalProfile?.reports?.length > 0 ? (
                                            user.medicalProfile.reports.map((report, index) => (
                                                <div key={index} className="flex flex-row items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:border-[var(--accent)] transition-all group">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/5 flex items-center justify-center shrink-0">
                                                            <FileText className="w-5 h-5 text-[var(--primary)]" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-[var(--primary)] truncate">{report.name}</p>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary)] mt-0.5">
                                                                {new Date(report.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={report.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 rounded-lg bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center text-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--card)] hover:border-[var(--accent)] transition-all shrink-0"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center p-6 border border-dashed border-[var(--card-border)] rounded-xl bg-[var(--background)]/50 text-[var(--secondary)] text-sm font-medium">
                                                No documents archived yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full md:w-96 shrink-0">
                                    <FileUpload />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-sm font-black text-[var(--secondary)] uppercase tracking-[0.2em]">Consultation History</h2>
                            <div className="h-px flex-grow bg-slate-100"></div>
                        </div>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="animate-pulse flex flex-col gap-4">
                                    {[1, 2].map(n => <div key={n} className="h-24 bg-[var(--background)] rounded-2xl w-full"></div>)}
                                </div>
                            ) : appointments?.length > 0 ? (
                                appointments.map(apt => (
                                    <AppointmentItem key={apt._id} appointment={apt} role="patient" />
                                ))
                            ) : (
                                <div className="bg-[var(--background)]/50 p-20 rounded-3xl border border-dashed border-[var(--card-border)] text-center">
                                    <p className="text-[var(--secondary)] font-bold uppercase tracking-widest text-[10px]">Registry is currently empty</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
