import { useEffect, useState } from 'react'
import './App.css'

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
      <h1>{message}</h1>
    </div>
  );
}

export default App
