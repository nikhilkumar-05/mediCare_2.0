import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile } from '../features/auth/authSlice';

const FileUpload = ({ folder = 'standard', onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [reportName, setReportName] = useState('');
    const [uploading, setUploading] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return toast.error('Please select a file first');
        if (!onUploadSuccess && !reportName.trim()) return toast.error('Please provide a name for this report');

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user?.token}`,
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            if (data.success) {
                if (onUploadSuccess) {
                    onUploadSuccess(data.url);
                } else {
                    // Update profile with the new report, handling empty profiles safely
                    const newReport = { name: reportName, url: data.url };
                    const currentReports = user?.medicalProfile?.reports || [];

                    await dispatch(updateProfile({
                        medicalProfile: {
                            ...(user?.medicalProfile || {}),
                            reports: [...currentReports, newReport]
                        }
                    })).unwrap();
                }

                toast.success(onUploadSuccess ? 'File uploaded successfully!' : 'Report archived successfully!');
                setFile(null);
                setReportName('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-4 p-6 border-2 border-dashed border-[var(--card-border)] rounded-3xl bg-[var(--background)]/50 transition-all hover:border-[var(--accent)] group">
            <div className="flex flex-col gap-4">
                {!onUploadSuccess && (
                    <input
                        type="text"
                        placeholder="Report Name (e.g. Report, X-Ray)"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl bg-[var(--card)] border border-transparent outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-sm font-medium placeholder:text-[var(--secondary)]/50"
                    />
                )}
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-xs text-[var(--secondary)] file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[var(--primary)] file:text-[var(--primary-foreground)] hover:file:bg-[var(--primary)]/90 cursor-pointer w-full transition-all"
                />
                <button
                    onClick={handleUpload}
                    disabled={uploading || !file || (!onUploadSuccess && !reportName.trim())}
                    className="bg-[var(--accent)] text-[var(--card)] px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--accent)]/20 hover:bg-[var(--accent-hover)] active:scale-95 w-full mt-2"
                >
                    {uploading ? 'Uploading...' : onUploadSuccess ? 'Upload Image' : 'Archive Report'}
                </button>
            </div>
            {file && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                    <p className="text-[10px] text-[var(--secondary)] font-black uppercase tracking-widest truncate max-w-xs">{file.name}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
