import { useEffect, useState } from 'react'
// @ts-ignore: allow CSS side-effect import without type declarations
import './Budget.css'
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
  return `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function formatSigned(value: number) {
  const sign = value < 0 ? '-' : '+'
  return `${sign}${formatPlain(value)}`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function amountClass(type: string) {
  if (type === 'Deposit') return 'amount deposit'
  if (type.includes('Pending')) return 'amount pending'
  return 'amount expense'
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
    <main className="budget-page">
      <header className="budget-header">
        <div>
          <h1>Budget</h1>
          <p className="subtitle">Master fund overview and approved expense tracking</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-outline"
            disabled={!isDirector}
            title={fundButtonTitle}
            onClick={() => setShowEditFund(true)}
          >
            Edit Master Fund
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!isDirector}
            title={fundButtonTitle}
            onClick={() => setShowLogExpense(true)}
          >
            Log Expense
          </button>
        </div>
      </header>

      {error && (
        <div className="live-balance-note">
          Could not reach backend — is it running on {API_BASE}?
        </div>
      )}

      {!error && !summary && <div className="live-balance-note">Loading budget data…</div>}

      {summary && (
        <section className="panel fund-remaining">
          <span className="fund-remaining-label">MASTER FUND REMAINING</span>
          <span className="fund-remaining-value">{formatPlain(summary.remaining)}</span>
          <span className="fund-remaining-formula">
            {formatPlain(summary.fundTotal)} (fund) − {formatPlain(summary.approvedTotal)} (approved) − {formatPlain(summary.pendingTotal)} (pending) = {formatPlain(summary.remaining)}
          </span>
        </section>
      )}

      {summary && (
        <section className="panel">
          <span className="panel-title">Fund Usage</span>
          <div className="usage-bar-track">
            <div className="usage-bar-fill" style={{ width: `${summary.usedPct}%` }} />
            <span className="usage-bar-label">{summary.usedPct}% USED</span>
          </div>
          <p className="usage-caption">
            {formatPlain(summary.approvedTotal)} approved / {formatPlain(summary.pendingTotal)} pending / {formatPlain(summary.remaining)} left of {formatPlain(summary.fundTotal)}
          </p>
        </section>
      )}

      {categories && (
        <section className="panel">
          <span className="panel-title">Approved Spend by Category</span>
          {categories.length === 0 ? (
            <p className="usage-caption">No approved spend yet.</p>
          ) : (
            <div className="category-list">
              {categories.map((cat) => (
                <div className="category-row" key={cat.category}>
                  <span className="category-label">{cat.category}</span>
                  <div className="category-bar-track">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${(cat.amount / maxCategoryAmount) * 100}%` }}
                    />
                  </div>
                  <span className="category-amount">${cat.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {ledger && (
        <section className="panel">
          <span className="panel-title">Fund Ledger</span>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row, i) => (
                <tr key={i}>
                  <td>{formatDate(row.date)}</td>
                  <td>{row.description}</td>
                  <td>{row.type}</td>
                  <td className={amountClass(row.type)}>{formatSigned(row.amount)}</td>
                  <td>${row.runningBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            {summary && (
              <tfoot>
                <tr>
                  <td colSpan={4}>REMAINING BALANCE</td>
                  <td>{formatPlain(summary.remaining)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </section>
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
