import './Sidebar.css'

const NAV_ITEMS = ['Dashboard', 'VendorQuotes', 'Budget', 'Settings']

interface SidebarProps {
  active: string
  masterFundBalance: number | null
}

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function Sidebar({ active, masterFundBalance }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">SwagLab</div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href="#"
            className={item === active ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="sidebar-fund-badge">
        <span className="sidebar-fund-label">Masterfund</span>
        <span className="sidebar-fund-value">
          {masterFundBalance === null ? '...' : formatCurrency(masterFundBalance)}
        </span>
      </div>
    </aside>
  )
}

export default Sidebar
