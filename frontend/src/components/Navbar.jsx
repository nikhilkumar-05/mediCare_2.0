import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <nav className="bg-[var(--card)]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--card-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-xl font-black text-[var(--primary)] tracking-tighter uppercase flex items-center gap-2">
                                <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">M</span>
                                mediCare <span className="text-[var(--accent)]">2.0</span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        {user && user.token ? (
                            <>
                                <Link to="/settings" className="text-xs font-black uppercase tracking-widest text-[var(--secondary)] hover:text-[var(--accent)] transition-colors">
                                    Account Settings
                                </Link>
                                <button
                                    className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[var(--primary)] transition-all shadow-lg shadow-slate-100 active:scale-95"
                                    onClick={onLogout}
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-xs font-black uppercase tracking-widest text-[var(--secondary)] hover:text-[var(--primary)] transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[var(--accent)] transition-all shadow-lg shadow-[var(--accent)] active:scale-95"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
