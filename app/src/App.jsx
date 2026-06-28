import { useState } from 'react'
import Home from './screens/Home'
import AlarmRing from './screens/AlarmRing'
import WakeComplete from './screens/WakeComplete'

export default function App() {
  const [screen, setScreen] = useState('home')

  return (
    <>
      {screen === 'home'     && <Home onNavigate={setScreen} />}
      {screen === 'ring'     && <AlarmRing onNavigate={setScreen} />}
      {screen === 'complete' && <WakeComplete onNavigate={setScreen} />}
    </>
  )
}
