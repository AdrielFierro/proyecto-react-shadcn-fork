import { useState } from 'react'
import { Button } from '@/components/ui/button'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex gap-8">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-24 w-24 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 w-24 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow" alt="React logo" />
        </a>
      </div>
      
      <h1 className="text-4xl font-bold">Vite + React + shadcn/ui</h1>
      
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => setCount((count) => count - 1)}>
            Decrease
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Edit <code className="bg-muted px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <div className="flex flex-col gap-2 items-center">
        <p className="text-sm text-muted-foreground">
          Click on the Vite and React logos to learn more
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://ui.shadcn.com" target="_blank">shadcn/ui Docs</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
