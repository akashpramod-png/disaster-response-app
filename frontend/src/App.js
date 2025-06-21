import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [formData, setFormData] = useState({
    title: '',
    location_name: '',
    description: '',
    tags: ''
  });
  const [disasters, setDisasters] = useState([]);
  const [geocodeText, setGeocodeText] = useState('');
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [view, setView] = useState('disasters');

  useEffect(() => {
    fetchDisasters();
    socket.on('disaster_updated', fetchDisasters);
    return () => socket.disconnect();
  }, []);

  const fetchDisasters = async () => {
    const res = await axios.get('http://localhost:5000/disasters');
    setDisasters(res.data);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim())
    };
    await axios.post('http://localhost:5000/disasters', payload);
    setFormData({ title: '', location_name: '', description: '', tags: '' });
  };

  const handleGeocode = async () => {
    try {
      const res = await axios.post('http://localhost:5000/disasters/extract-location', {
        description: geocodeText
      });
      setGeocodeResult(res.data);
    } catch {
      setGeocodeResult({ error: 'Location extraction failed.' });
    }
  };

  const handleImageVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/disasters/verify-image', {
        image_url: imageUrl
      });
      setVerificationResult(res.data);
    } catch {
      setVerificationResult({ error: 'Image verification failed.' });
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">Disaster Coordination</div>
        <div className="navbar-links">
          <button onClick={() => setView('disasters')} className="nav-button">Reported Disasters</button>
          <button onClick={() => setView('geocode')} className="nav-button">Extract Location</button>
          <button onClick={() => setView('verify')} className="nav-button">Verify Image</button>
        </div>
      </nav>

      <div className="container">
        {view === 'disasters' && (
          <>
            <h2>Disaster Reporting Form</h2>
            <form onSubmit={handleSubmit}>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
              <input name="location_name" value={formData.location_name} onChange={handleChange} placeholder="Location Name" required />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
              <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" required />
              <button type="submit">Submit Disaster</button>
            </form>
            <h3>Reported Disasters</h3>
            <ul>
              {disasters.map(d => (
                <li key={d.id}>
                  <strong>{d.title}</strong> - {d.location_name}<br />
                  {d.description}<br />
                  Tags: {d.tags?.join(', ')}
                </li>
              ))}
            </ul>
          </>
        )}

        {view === 'geocode' && (
          <>
            <h3>Extract Location from Description</h3>
            <div className="geocode-section">
              <input
                type="text"
                value={geocodeText}
                onChange={(e) => setGeocodeText(e.target.value)}
                placeholder="Enter description for location extraction"
              />
              <button onClick={handleGeocode}>Extract Location</button>
              {geocodeResult && (
                <div className="geocode-result">
                  {geocodeResult.error ? (
                    <p style={{ color: 'red' }}>{geocodeResult.error}</p>
                  ) : (
                    <p><strong>Location:</strong> {geocodeResult.location_name}</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {view === 'verify' && (
          <>
            <h3>Verify Image</h3>
            <div className="geocode-section">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter Image URL"
              />
              <button onClick={handleImageVerify}>Verify</button>
              {verificationResult && (
                <div className="verification-status">
                  {verificationResult.error ? (
                    <p style={{ color: 'red' }}>{verificationResult.error}</p>
                  ) : (
                    <p>{verificationResult.verification}</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
