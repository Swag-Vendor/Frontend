import React from 'react';

interface SidebarProps {
    activeItem: string;
}

const Sidebar = ({ activeItem }: SidebarProps) => {
    return (
        <aside style = {{ width: '180px', minHeight: '100vh', backgroundColor: '#FFF8E&', borderRight: '2px solid #E8D5A3', display: 'flex', flexDirection: 'column', padding: '16px', fontFamily: 'monospace', overflow:'hidden' }}>
            <div style = {{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                SwagLab
            </div>
            <nav style = {{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {['Dashboard', 'VendorQuotes', 'Budget', 'Settings'].map((item) => {
                    const isActive = item === activeItem;

                    return (
                    <button key={item} style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', backgroundColor: isActive ? '#4A9EE8' : 'transparent', color: isActive ? 'white' : '#78350f' }}>
                        {item}
                    </button>
                    );
                })}
            </nav>
            <div style = {{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#4A9EE8', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', margin: '16px auto 0', textAlign: 'center'}}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace'}}>Masterfund</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace'}}>$25,000</span>
            </div>
        </aside>
    );
};



export default Sidebar;