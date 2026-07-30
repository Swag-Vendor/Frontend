import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Budget from './pages/Budget'

function App() {
  const [masterFundBalance, setMasterFundBalance] = useState<number | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/master-fund')
      .then((res) => res.json())
      .then((data) => setMasterFundBalance(data.balance))
      .catch(() => setMasterFundBalance(null))
  }, [])

  return (
    <>
      <Sidebar active="Budget" masterFundBalance={masterFundBalance} />
      <Budget />
    </>
  )
}

export default App
