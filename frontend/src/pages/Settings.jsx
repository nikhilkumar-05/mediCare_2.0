import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateProfile, reset } from '../features/auth/authSlice';
import FileUpload from '../components/FileUpload';
import { Camera } from 'lucide-react';

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isSuccess, isError, message } = useSelector((state) => state.auth);

    const goBack = () => {
        if (user?.role === 'doctor') navigate('/doctor-dashboard');
        else if (user?.role === 'admin') navigate('/admin-dashboard');
        else navigate('/patient-dashboard');
    };

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        profilePic: user?.profilePic || '',
        specialty: user?.specialty || '',
        bio: user?.bio || '',
        experience: user?.experience || '',
        consultationFee: user?.consultationFee || 0,
        medicalProfile: {
            bloodGroup: user?.medicalProfile?.bloodGroup || '',
            allergies: user?.medicalProfile?.allergies?.join(', ') || '',
            chronicConditions: user?.medicalProfile?.chronicConditions?.join(', ') || '',
            currentMedications: user?.medicalProfile?.currentMedications?.join(', ') || '',
        }
    });

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success('Profile updated successfully.');
        }
        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const onChange = (e) => {
        if (e.target.name.startsWith('mp_')) {
            const field = e.target.name.replace('mp_', '');
            setFormData({
                ...formData,
                medicalProfile: { ...formData.medicalProfile, [field]: e.target.value }
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const onProfilePicUpload = async (url) => {
        setFormData({ ...formData, profilePic: url });
        const payload = { ...formData, profilePic: url };

        if (user.role === 'patient') {
            const safeSplit = (val) => {
                if (!val) return [];
                if (Array.isArray(val)) return val;
                return val.split(',').map(s => s.trim()).filter(s => s);
            };

            payload.medicalProfile = {
                bloodGroup: formData.medicalProfile.bloodGroup,
                allergies: safeSplit(formData.medicalProfile.allergies),
                chronicConditions: safeSplit(formData.medicalProfile.chronicConditions),
                currentMedications: safeSplit(formData.medicalProfile.currentMedications),
            };
        }

        await dispatch(updateProfile(payload));
        toast.success('Identity Image updated and saved successfully.');
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };

        if (user.role === 'patient') {
            const safeSplit = (val) => {
                if (!val) return [];
                if (Array.isArray(val)) return val;
                return val.split(',').map(s => s.trim()).filter(s => s);
            };

            payload.medicalProfile = {
                bloodGroup: formData.medicalProfile.bloodGroup,
                allergies: safeSplit(formData.medicalProfile.allergies),
                chronicConditions: safeSplit(formData.medicalProfile.chronicConditions),
                currentMedications: safeSplit(formData.medicalProfile.currentMedications),
            };
        }

        dispatch(updateProfile(payload));
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            <header className="mb-12">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors text-[10px] font-black uppercase tracking-widest mb-6 group"
                >
                    <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[var(--primary)] group-hover:text-white flex items-center justify-center transition-all text-sm">←</span>
                    Back to Dashboard
                </button>
                <div className="flex items-center gap-4 mb-3">
                    <span className="bg-[var(--accent)] text-[var(--accent)] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Account Infrastructure</span>
                    <span className="h-px flex-grow bg-slate-100"></span>
                </div>
                <h1 className="text-4xl font-black text-[var(--primary)] tracking-tight mb-2">Internal Configuration</h1>
                <p className="text-[var(--secondary)] font-medium">Manage your clinical presence and security protocols.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Avatar & Overview */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[var(--card)] p-10 rounded-[2.5rem] border border-[var(--card-border)] medical-shadow text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden group">
                                {formData.profilePic ? (
                                    <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--secondary)] font-black text-4xl">
                                        {formData.firstName[0]}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[var(--accent)] text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                                <Camera className="w-4 h-4" />
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-[var(--primary)] mb-1">{formData.firstName} {formData.lastName}</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-6">{user?.role}</p>

                        <div className="pt-6 border-t border-[var(--card-border)]">
                            <p className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest mb-4">Update Identity Image</p>
                            <FileUpload onUploadSuccess={onProfilePicUpload} />
                        </div>
                    </div>

                    <div className="bg-[var(--primary)] p-8 rounded-[2.5rem] text-white medical-shadow relative overflow-hidden group">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Clinical Access</h3>
                        <p className="text-sm font-medium mb-1 opacity-90">Authenticated via</p>
                        <p className="text-lg font-bold tracking-tight mb-4">{user?.email}</p>
                        <div className="h-1 w-12 bg-[var(--accent)] rounded-full"></div>
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[var(--card)]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>
                </div>

                {/* Right Column: Detailed Fields */}
                <div className="lg:col-span-8">
                    <form onSubmit={onSubmit} className="space-y-8">
                        {/* Section: Personal Identification */}
                        <div className="bg-[var(--card)] p-10 rounded-[2.5rem] border border-[var(--card-border)] medical-shadow">
                            <h3 className="text-sm font-black text-[var(--secondary)] uppercase tracking-[0.2em] mb-8">Personal Identification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-3 ml-1">Legal First Name</label>
                                    <input name="firstName" value={formData.firstName} onChange={onChange} className="w-full px-6 py-4 rounded-xl bg-[var(--background)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-3 ml-1">Legal Last Name</label>
                                    <input name="lastName" value={formData.lastName} onChange={onChange} className="w-full px-6 py-4 rounded-xl bg-[var(--background)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-3 ml-1">Communications Email</label>
                                    <input name="email" type="email" value={formData.email} onChange={onChange} className="w-full px-6 py-4 rounded-xl bg-[var(--background)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium" />
                                </div>
                            </div>
                        </div>

                        {/* Section: Medical / Professional Profile */}
                        {user?.role === 'doctor' ? (
                            <div className="bg-[var(--card)] p-10 rounded-[2.5rem] border border-[var(--card-border)] medical-shadow">
                                <h3 className="text-sm font-black text-[var(--secondary)] uppercase tracking-[0.2em] mb-8">Clinical Credentials</h3>
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-3 ml-1">Primary Specialty</label>
                                            <select
                                                name="specialty"
                                                value={formData.specialty}
                                                onChange={onChange}
                                                className="w-full px-6 py-4 rounded-xl bg-[var(--background)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium appearance-none"
                                            >
                                                <option value="" disabled>Select your specialty</option>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Dermatology">Dermatology</option>
                                                <option value="Endocrinology">Endocrinology</option>
                                                <option value="General Physician">General Physician</option>
                                                <option value="Neurology">Neurology</option>
                                                <option value="Oncology">Oncology</option>
                                                <option value="Ophthalmology">Ophthalmology</option>
                                                <option value="Orthopedics">Orthopedics</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="Psychiatry">Psychiatry</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-3 ml-1">Years of Practice</label>
                                            <input type="number" name="experience" value={formData.experience} onChange={onChange} className="w-full px-6 py-4 rounded-xl bg-[var(--background)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-3 ml-1">Consultation Fee (INR)</label>
                                            <input type="number" name="consultationFee" value={formData.consultationFee} onChange={onChange} className="w-full px-6 py-4 rounded-xl bg-[var(--accent)]/50 border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-bold text-[var(--accent)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-3 ml-1">Professional Narrative (Bio)</label>
                                        <textarea name="bio" value={formData.bio} onChange={onChange} rows="5" className="w-full px-6 py-5 rounded-[1.5rem] bg-[var(--background)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium resize-none placeholder:italic" placeholder="Summarize your medical philosophy and clinical background..."></textarea>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[var(--card)] p-10 rounded-[2.5rem] border border-[var(--card-border)] medical-shadow">
                                <h3 className="text-sm font-black text-[var(--secondary)] uppercase tracking-[0.2em] mb-8">Clinical Configuration (EHR Lite)</h3>
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-3 ml-1">Blood Group Ledger</label>
                                        <select name="mp_bloodGroup" value={formData.medicalProfile.bloodGroup} onChange={onChange} className="w-full px-6 py-4 rounded-xl bg-[var(--background)] border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium appearance-none">
                                            <option value="">Status Unknown</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                <option key={bg} value={bg}>{bg} Blood Group</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-red-400 mb-3 ml-1">Immunological Hypersensitivities</label>
                                            <input name="mp_allergies" value={formData.medicalProfile.allergies} onChange={onChange} placeholder="e.g. Penicillin, Latex..." className="w-full px-6 py-4 rounded-xl bg-red-50/30 border-none outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm font-medium" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3 ml-1">Chronic Pathologies</label>
                                            <input name="mp_chronicConditions" value={formData.medicalProfile.chronicConditions} onChange={onChange} placeholder="e.g. Hypertension..." className="w-full px-6 py-4 rounded-xl bg-amber-50/30 border-none outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-3 ml-1">Active Pharmacological Regiment</label>
                                        <textarea name="mp_currentMedications" value={formData.medicalProfile.currentMedications} onChange={onChange} rows="4" className="w-full px-6 py-5 rounded-[1.5rem] bg-[var(--accent)]/30 border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-sm font-medium resize-none" placeholder="List medications being currently administered..."></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <button type="submit" className="w-full bg-[var(--primary)] text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-[var(--primary)] transition-all active:scale-[0.98]">
                                Update Profile
                            </button>
                            <p className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Last updated: {new Date(user?.updatedAt || Date.now()).toLocaleString()}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
