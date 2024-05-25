import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState({ tps: 0, latency: 0 });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="title">Let's #breaksui</div>
      <div className="counter-container">
        <div className="counter">
          <h1>{metrics.tps}</h1>
          <p>Live TPS</p>
        </div>
        <div className="counter">
          <h1>{metrics.latency.toFixed(2)}</h1>
          <p>Latency (s)</p>
        </div>
      </div>
    </div>
  );
}

export default App;

