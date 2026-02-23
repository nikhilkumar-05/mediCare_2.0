import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'patient', // Default role
    });

    const { firstName, lastName, email, password, role } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            const role = user?.role || user?.data?.role;
            if (role === 'admin') navigate('/admin-dashboard');
            else if (role === 'doctor') navigate('/doctor-dashboard');
            else navigate('/patient-dashboard');
            toast.success('Registration successful!');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { firstName, lastName, email, password, role };
        dispatch(register(userData));
    };

    return (
        <div className="min-h-[90vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-tr from-[var(--background)] to-[var(--primary)]/5">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-[var(--accent)] text-white p-3 rounded-xl shadow-lg">
                        <UserPlus className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                    Create a new account
                </h2>
                <p className="mt-2 text-sm text-[var(--secondary)]">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-[var(--primary)] hover:text-[var(--accent)] transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[var(--card)] py-8 px-6 medical-shadow sm:rounded-2xl sm:px-10 border border-[var(--card-border)]">
                    <form className="space-y-6" onSubmit={onSubmit}>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--foreground)]">First Name</label>
                                <input
                                    type="text"
                                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent sm:text-sm transition-all"
                                    name="firstName"
                                    value={firstName}
                                    onChange={onChange}
                                    placeholder="Jane"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--foreground)]">Last Name</label>
                                <input
                                    type="text"
                                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent sm:text-sm transition-all"
                                    name="lastName"
                                    value={lastName}
                                    onChange={onChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)]">Email address</label>
                            <input
                                type="email"
                                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent sm:text-sm transition-all"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="jane.doe@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)]">Password</label>
                            <input
                                type="password"
                                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent sm:text-sm transition-all"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Create a secure password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--foreground)]">I am a...</label>
                            <select
                                name="role"
                                value={role}
                                onChange={onChange}
                                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none bg-[var(--card)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent sm:text-sm rounded-lg transition-all"
                            >
                                <option value="patient">Patient seeking care</option>
                                <option value="doctor">Medical Professional</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[var(--primary)] hover:bg-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50 cursor-pointer transition-all uppercase tracking-wide"
                            >
                                {isLoading ? 'Processing...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
