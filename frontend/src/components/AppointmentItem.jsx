import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePrescription } from '../features/appointments/appointmentSlice';
import { toast } from 'react-toastify';
import { Calendar, Clock, Video, FileText, Edit, Save, Download } from 'lucide-react';

const AppointmentItem = ({ appointment, role, onUpdateStatus }) => {
    const dispatch = useDispatch();
    const { _id, doctor, patient, date, timeSlot, status } = appointment || {};

    const [showClinicalTools, setShowClinicalTools] = useState(false);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [meetingLink, setMeetingLink] = useState(appointment?.meetingLink || '');

    // Initialize prescription from existing data or blank
    const [prescription, setPrescription] = useState(
        appointment?.prescription?.medications?.length > 0
            ? appointment.prescription
            : { medications: [{ name: '', dosage: '', duration: '' }], notes: '' }
    );

    const statusColors = {
        pending: 'bg-amber-50 text-amber-700 border border-amber-100',
        approved: 'bg-blue-50 text-blue-700 border border-blue-100',
        completed: 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20',
        cancelled: 'bg-red-50 text-red-700 border border-red-100',
    };

    if (!appointment || (!doctor && role === 'patient') || (!patient && role === 'doctor')) {
        return null;
    }

    const addMedication = () => {
        setPrescription({
            ...prescription,
            medications: [...prescription.medications, { name: '', dosage: '', duration: '' }],
        });
    };

    const removeMedication = (index) => {
        const newMeds = prescription.medications.filter((_, i) => i !== index);
        setPrescription({ ...prescription, medications: newMeds.length ? newMeds : [{ name: '', dosage: '', duration: '' }] });
    };

    const handleMedChange = (index, field, value) => {
        const newMeds = [...prescription.medications];
        newMeds[index][field] = value;
        setPrescription({ ...prescription, medications: newMeds });
    };

    // Used on "Initiate Consultation" (pending → completed flow)
    const handleComplete = () => {
        onUpdateStatus(_id, 'Completed', { meetingLink, prescription });
        setShowClinicalTools(false);
    };

    // Used on "Save Prescription" (standalone prescription update)
    const handleSavePrescription = () => {
        const hasMeds = prescription.medications.some(m => m.name.trim());
        if (!hasMeds && !prescription.notes.trim()) {
            return toast.error('Please add at least one medication or a note.');
        }
        dispatch(updatePrescription({ id: _id, prescription }))
            .unwrap()
            .then(() => {
                toast.success('Prescription saved successfully!');
                setShowPrescriptionForm(false);
            })
            .catch((err) => toast.error(err || 'Failed to save prescription'));
    };

    return (
        <div className="bg-[var(--card)] rounded-[2rem] border border-[var(--card-border)] medical-shadow overflow-hidden mb-6 medical-card-hover group">
            {/* ── Main Row ── */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-grow">
                    <div className="flex items-center gap-5 mb-4">
                        <div className="w-14 h-14 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-slate-100">
                            {role === 'doctor' ? (patient?.firstName?.[0] || 'P') : (doctor?.firstName?.[0] || 'D')}
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--primary)] text-lg leading-none mb-1">
                                {role === 'doctor'
                                    ? `${patient?.firstName || 'Unknown'} ${patient?.lastName || 'Patient'}`
                                    : `Dr. ${doctor?.firstName || 'Unknown'} ${doctor?.lastName || 'Physician'}`}
                            </h3>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--secondary)]">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(date).toLocaleDateString()}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--card-border)]"></span>
                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {timeSlot}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {appointment.meetingLink && (
                            <a
                                href={appointment.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-[var(--accent)] text-[var(--card)] rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2 shadow-lg shadow-[var(--accent)]/20"
                            >
                                <Video className="w-3.5 h-3.5" /> Connect to Virtual Suite
                            </a>
                        )}
                        {appointment.prescription?.medications?.some(m => m.name) && (
                            <div className="px-4 py-2.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5" /> Prescription on File
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${statusColors[status?.toLowerCase()] || 'bg-[var(--background)] text-[var(--secondary)]'}`}>
                        {status}
                    </span>

                    {role === 'doctor' && status === 'Pending' && !showClinicalTools && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowClinicalTools(true)}
                                className="px-6 py-3 bg-[var(--primary)] text-[var(--card)] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--primary)]/90 transition-all shadow-xl shadow-[var(--primary)]/10 active:scale-95"
                            >
                                Initiate Consultation
                            </button>
                            <button
                                onClick={() => onUpdateStatus(_id, 'Cancelled')}
                                className="px-5 py-3 bg-[var(--background)] text-[var(--secondary)] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 border border-[var(--card-border)] transition-all"
                            >
                                Rescind
                            </button>
                        </div>
                    )}

                    {/* Prescription button — visible to doctor on any non-cancelled appointment */}
                    {role === 'doctor' && status !== 'Cancelled' && status !== 'Pending' && (
                        <button
                            onClick={() => {
                                setShowPrescriptionForm(v => !v);
                                setShowClinicalTools(false);
                            }}
                            className="px-6 py-3 bg-[var(--accent)] text-[var(--card)] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent)]/20 active:scale-95 flex items-center gap-2"
                        >
                            <Edit className="w-3.5 h-3.5" /> {appointment.prescription?.medications?.some(m => m.name) ? 'Edit Prescription' : 'Add Prescription'}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Initiate Consultation Panel (Pending) ── */}
            {showClinicalTools && role === 'doctor' && (
                <div className="p-10 bg-[var(--background)]/50 border-t border-[var(--card-border)] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--secondary)]">Physician's Environment</h4>
                            <p className="text-xl font-bold text-[var(--primary)] italic tracking-tight">Constructing Clinical Directives</p>
                        </div>
                        <button
                            onClick={() => setShowClinicalTools(false)}
                            className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors bg-[var(--card)] w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border border-[var(--card-border)] shadow-sm"
                        >X</button>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-10">
                        {patient?.medicalProfile && (
                            <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] medical-shadow">
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4 ml-1">Patient Diagnostic Ledger</h5>
                                <div className="space-y-3">
                                    {patient.medicalProfile.reports && patient.medicalProfile.reports.length > 0 ? (
                                        patient.medicalProfile.reports.map((report, idx) => (
                                            <div key={idx} className="flex flex-row items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:border-[var(--accent)] transition-all group">
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
                                            No diagnostic documents found for this patient.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] medical-shadow">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--secondary)] mb-4 ml-1">Telehealth Access URL</label>
                            <p className="text-xs text-[var(--secondary)] mb-3 ml-1 opacity-80">This link will be visible to the patient on their dashboard to start the video consultation.</p>
                            <input
                                type="text"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                placeholder="https://secure-telehealth-portal.com/..."
                                className="w-full px-6 py-4 rounded-xl bg-[var(--background)] border border-transparent outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-sm font-medium placeholder:text-[var(--secondary)]/50"
                            />
                        </div>

                        <PrescriptionForm
                            prescription={prescription}
                            setPrescription={setPrescription}
                            onAdd={addMedication}
                            onRemove={removeMedication}
                            onMedChange={handleMedChange}
                        />

                        <button
                            onClick={handleComplete}
                            className="w-full bg-[var(--primary)] text-[var(--card)] py-6 rounded-3xl font-bold text-xs uppercase tracking-[0.3em] shadow-xl shadow-[var(--primary)]/10 hover:bg-[var(--primary)]/90 transition-all active:scale-[0.98]"
                        >
                            Finalize Session &amp; Transmit Data
                        </button>
                    </div>
                </div>
            )}

            {/* ── Standalone Prescription Panel (Approved / Completed) ── */}
            {showPrescriptionForm && role === 'doctor' && (
                <div className="p-10 bg-[var(--accent)]/30 border-t border-[var(--accent)] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Prescription Module</h4>
                            <p className="text-xl font-bold text-[var(--primary)] italic tracking-tight">
                                {appointment.prescription?.medications?.some(m => m.name) ? 'Update Prescription' : 'New Prescription'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowPrescriptionForm(false)}
                            className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors bg-[var(--card)] w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border border-[var(--card-border)]"
                        >X</button>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {patient?.medicalProfile && (
                            <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] medical-shadow mt-6">
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-4 ml-1">Patient Diagnostic Ledger</h5>
                                <div className="space-y-3">
                                    {patient.medicalProfile.reports && patient.medicalProfile.reports.length > 0 ? (
                                        patient.medicalProfile.reports.map((report, idx) => (
                                            <div key={idx} className="flex flex-row items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:border-[var(--accent)] transition-all group">
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
                                            No diagnostic documents found for this patient.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <PrescriptionForm
                            prescription={prescription}
                            setPrescription={setPrescription}
                            onAdd={addMedication}
                            onRemove={removeMedication}
                            onMedChange={handleMedChange}
                        />

                        <button
                            onClick={handleSavePrescription}
                            className="w-full bg-[var(--accent)] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-[var(--accent)] hover:bg-[var(--accent)] transition-all active:scale-[0.98]"
                        >
                            <span className="flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save Prescription</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ── View Prescription (read-only for both roles) ── */}
            {appointment.prescription?.medications?.some(m => m.name) && !showPrescriptionForm && !showClinicalTools && (
                <div className="p-8 bg-[var(--background)]/30 border-t border-[var(--card-border)]/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center text-[var(--accent)] font-bold text-sm">Rx</div>
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--secondary)]">Verified Clinical Directive</h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            {appointment.prescription.medications.filter(m => m.name).map((m, idx) => (
                                <div key={idx} className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--card-border)] shadow-sm flex justify-between items-center group/med hover:border-[var(--accent)]/30 transition-all">
                                    <div>
                                        <p className="text-sm font-bold text-[var(--primary)] mb-0.5">{m.name}</p>
                                        <p className="text-[10px] text-[var(--secondary)] font-bold uppercase tracking-widest">{m.dosage}</p>
                                    </div>
                                    <div className="px-3 py-1.5 bg-[var(--background)] rounded-lg text-[10px] font-bold text-[var(--secondary)] group-hover/med:bg-[var(--accent)]/10 group-hover/med:text-[var(--accent)] transition-colors uppercase">
                                        {m.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[var(--card)] p-6 rounded-2xl border border-dashed border-[var(--card-border)] flex flex-col">
                            <p className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-[0.2em] mb-4">Physician Notes</p>
                            <p className="text-sm text-[var(--primary)] opacity-80 font-medium italic leading-relaxed">
                                "{appointment.prescription.notes || 'No specific medical notes recorded for this interaction.'}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Shared Prescription Form Sub-component ──
const PrescriptionForm = ({ prescription, setPrescription, onAdd, onRemove, onMedChange }) => (
    <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] medical-shadow">
        <div className="flex items-center justify-between mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                Pharmacological Prescriptions
            </label>
            <button
                onClick={onAdd}
                className="px-4 py-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all"
            >
                + Add Medication
            </button>
        </div>

        <div className="space-y-3 mb-8">
            {prescription.medications.map((med, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-[var(--background)]/80 rounded-2xl border border-[var(--card-border)] items-center">
                    <input
                        placeholder="Medication Name"
                        value={med.name}
                        onChange={(e) => onMedChange(index, 'name', e.target.value)}
                        className="col-span-5 px-4 py-3 text-sm bg-[var(--card)] rounded-xl border border-transparent outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] font-medium"
                    />
                    <input
                        placeholder="Dosage / Regularity"
                        value={med.dosage}
                        onChange={(e) => onMedChange(index, 'dosage', e.target.value)}
                        className="col-span-3 px-4 py-3 text-sm bg-[var(--card)] rounded-xl border border-transparent outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] font-medium"
                    />
                    <input
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => onMedChange(index, 'duration', e.target.value)}
                        className="col-span-3 px-4 py-3 text-sm bg-[var(--card)] rounded-xl border border-transparent outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] font-medium"
                    />
                    <button
                        onClick={() => onRemove(index)}
                        className="col-span-1 flex items-center justify-center text-[var(--secondary)] hover:text-red-400 transition-colors font-bold text-lg"
                        title="Remove"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>

        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--secondary)] mb-4 ml-1">
            Clinical Observations &amp; Directives
        </label>
        <textarea
            placeholder="Enter physician's observations, patient instructions, and follow-up guidance..."
            value={prescription.notes}
            onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })}
            className="w-full px-6 py-5 rounded-2xl bg-[var(--background)] border border-transparent outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-sm font-medium resize-none min-h-[140px] placeholder:text-[var(--secondary)]/50"
        />
    </div>
);

export default AppointmentItem;
