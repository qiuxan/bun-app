import { useEffect, useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button';

function App() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
    <div>
      <p className="font-bold">{message}</p>
      <Button>Click me</Button>

    </div>
  );
}

export default App
