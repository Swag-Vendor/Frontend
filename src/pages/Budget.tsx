import { useEffect, useState, type CSSProperties } from 'react'
import { useAuth } from '../auth/AuthContext'
import { authFetch } from '../auth/authFetch'
import FundAdjustmentModal from '../components/FundAdjustmentModal'
import { API_BASE } from '../config'

interface Summary {
  fundTotal: number
  approvedTotal: number
  pendingTotal: number
  remaining: number
  usedPct: number
}

interface CategorySpend {
  category: string
  amount: number
}

interface LedgerEntry {
  date: string
  description: string
  type: string
  amount: number
  runningBalance: number
}

function formatPlain(value: number) {
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function formatSigned(value: number) {
  const sign = value < 0 ? '-' : '+'
  return `${sign}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function amountColor(type: string) {
  if (type === 'Deposit') return '#15803d'
  if (type.includes('Pending')) return '#b45309'
  return '#b91c1c'
}

const panelStyle: CSSProperties = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
}

const panelTitleStyle: CSSProperties = {
  margin: '0 0 12px',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#1e3a5f',
}

function Budget() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [categories, setCategories] = useState<CategorySpend[] | null>(null)
  const [ledger, setLedger] = useState<LedgerEntry[] | null>(null)
  const [error, setError] = useState(false)
  const [showEditFund, setShowEditFund] = useState(false)
  const [showLogExpense, setShowLogExpense] = useState(false)
  const { user, token, logout } = useAuth()
  const isDirector = user?.role === 'director'

  const loadData = () => {
    if (!token) return
    Promise.all([
      authFetch(`${API_BASE}/master-fund/summary`, token),
      authFetch(`${API_BASE}/master-fund/categories`, token),
      authFetch(`${API_BASE}/master-fund/ledger`, token),
    ])
      .then(async ([summaryRes, categoriesRes, ledgerRes]) => {
        if (summaryRes.status === 401 || categoriesRes.status === 401 || ledgerRes.status === 401) {
          logout()
          return
        }
        const [s, c, l] = await Promise.all([summaryRes.json(), categoriesRes.json(), ledgerRes.json()])
        setSummary(s)
        setCategories(c)
        setLedger(l)
        setError(false)
      })
      .catch(() => setError(true))
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const fundButtonTitle = !user
    ? 'Requires login'
    : !isDirector
      ? 'Requires director role'
      : undefined

  const maxCategoryAmount = categories?.length
    ? Math.max(...categories.map((c) => c.amount))
    : 1

  return (
    <main style={{ flex: 1, padding: '24px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px' }}>Budget</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>Master fund overview and approved expense tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            disabled={!isDirector}
            title={fundButtonTitle}
            onClick={() => setShowEditFund(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #4A9EE8',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: isDirector ? 'pointer' : 'not-allowed',
              backgroundColor: 'white',
              color: '#4A9EE8',
              opacity: isDirector ? 1 : 0.5,
            }}
          >
            Edit Master Fund
          </button>
          <button
            type="button"
            disabled={!isDirector}
            title={fundButtonTitle}
            onClick={() => setShowLogExpense(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: isDirector ? 'pointer' : 'not-allowed',
              backgroundColor: '#4A9EE8',
              color: 'white',
              opacity: isDirector ? 1 : 0.5,
            }}
          >
            Log Expense
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>
          Could not reach backend — is it running on {API_BASE}?
        </p>
      )}

      {!error && !summary && (
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>Loading budget data…</p>
      )}

      {summary && (
        <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#FEFCE8', border: '2px solid #FDE68A', color: '#713f12', textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 'bold' }}>MASTER FUND REMAINING</p>
          <p style={{ margin: '0 0 4px', fontSize: '36px', fontWeight: 'bold' }}>{formatPlain(summary.remaining)}</p>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.75 }}>
            {formatPlain(summary.fundTotal)} (fund) − {formatPlain(summary.approvedTotal)} (approved) − {formatPlain(summary.pendingTotal)} (pending) = {formatPlain(summary.remaining)}
          </p>
        </div>
      )}

      {summary && (
        <div style={panelStyle}>
          <p style={panelTitleStyle}>Fund Usage</p>
          <div style={{ position: 'relative', height: '26px', width: '100%', backgroundColor: '#f9fafb', borderRadius: '999px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div style={{ height: '100%', width: `${summary.usedPct}%`, backgroundColor: '#4A9EE8', borderRadius: '999px 0 0 999px' }} />
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#fff', mixBlendMode: 'difference' }}>
              {summary.usedPct}% USED
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '12px 0 0' }}>
            {formatPlain(summary.approvedTotal)} approved / {formatPlain(summary.pendingTotal)} pending / {formatPlain(summary.remaining)} left of {formatPlain(summary.fundTotal)}
          </p>
        </div>
      )}

      {categories && (
        <div style={panelStyle}>
          <p style={panelTitleStyle}>Approved Spend by Category</p>
          {categories.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>No approved spend yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map((cat) => (
                <div key={cat.category} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 70px', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px' }}>{cat.category}</span>
                  <div style={{ height: '10px', backgroundColor: '#f9fafb', borderRadius: '999px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <div style={{ height: '100%', width: `${(cat.amount / maxCategoryAmount) * 100}%`, backgroundColor: '#4A9EE8', borderRadius: '999px' }} />
                  </div>
                  <span style={{ fontSize: '13px', textAlign: 'right' }}>${cat.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {ledger && (
        <div style={{ ...panelStyle, overflowX: 'auto' }}>
          <p style={panelTitleStyle}>Fund Ledger</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                {['Date', 'Description', 'Type', 'Amount', 'Running Balance'].map((heading) => (
                  <th key={heading} style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{formatDate(row.date)}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{row.description}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{row.type}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', color: amountColor(row.type) }}>{formatSigned(row.amount)}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>${row.runningBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            {summary && (
              <tfoot>
                <tr>
                  <td colSpan={3}></td>
                  <td colSpan={2} style={{ padding: '12px', fontWeight: 'bold', backgroundColor: '#FEFCE8' }}>
                    REMAINING: {formatPlain(summary.remaining)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {showEditFund && token && (
        <FundAdjustmentModal
          mode="deposit"
          token={token}
          onClose={() => setShowEditFund(false)}
          onSaved={() => {
            setShowEditFund(false)
            loadData()
          }}
          onUnauthorized={() => {
            setShowEditFund(false)
            logout()
          }}
        />
      )}

      {showLogExpense && token && (
        <FundAdjustmentModal
          mode="expense"
          token={token}
          onClose={() => setShowLogExpense(false)}
          onSaved={() => {
            setShowLogExpense(false)
            loadData()
          }}
          onUnauthorized={() => {
            setShowLogExpense(false)
            logout()
          }}
        />
      )}
    </main>
  )
}

export default Budget
