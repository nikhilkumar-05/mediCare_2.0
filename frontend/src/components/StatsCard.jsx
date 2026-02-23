const StatsCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--card-border)] medical-shadow medical-card-hover flex items-center gap-6">
            <div className={`p-4 rounded-2xl ${color} flex items-center justify-center text-xl shadow-lg shadow-slate-100`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--secondary)] mb-1">{title}</p>
                <p className="text-3xl font-black text-[var(--primary)] tracking-tighter">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;
