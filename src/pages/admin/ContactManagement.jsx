import React, { useState, useEffect } from 'react';
import '../../styles/ContactManagement.css';

const ContactManagement = () => {
  const [contactInfo, setContactInfo] = useState({
    dean: '',
    associateDean: '',
    director: '',
    email: '',
    officeHours: ''
  });
  // const [mapFile, setMapFile] = useState(null);
  // const [currentMap, setCurrentMap] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      const data = await response.json();
      
      if (response.ok) {
        setContactInfo({
          dean: data.dean || '',
          associateDean: data.associateDean || '',
          director: data.director || '',
          email: data.email || '',
          officeHours: data.officeHours || ''
        });
        // setCurrentMap(data.mapUrl || '');
      } else {
        setError(data.message || 'Failed to fetch contact information');
      }
    } catch (error) {
      setError('An error occurred while fetching contact information');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleMapChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setMapFile(file);
  //     // Create a preview URL for the selected file
  //     const previewUrl = URL.createObjectURL(file);
  //     setCurrentMap(previewUrl);
  //   }
  // };

  const handleSaveContactInfo = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: 'admin', // This should be replaced with the actual admin's department
          contactInfo
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Contact information updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update contact information');
      }
    } catch (error) {
      setError('An error occurred while updating contact information');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  // const handleMapUpload = async (e) => {
  //   e.preventDefault();
  //   if (!mapFile) return;

  //   try {
  //     setSaving(true);
  //     const formData = new FormData();
  //     formData.append('map', mapFile);

  //     const response = await fetch('/api/admin/contact/map', {
  //       method: 'PUT',
  //       body: formData,
  //     });

  //     const data = await response.json();
      
  //     if (response.ok) {
  //       setSuccessMessage('Campus map updated successfully');
  //       setTimeout(() => setSuccessMessage(''), 3000);
  //     } else {
  //       setError(data.message || 'Failed to update campus map');
  //     }
  //   } catch (error) {
  //     setError('An error occurred while updating campus map');
  //     console.error('Error:', error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  if (loading) {
    return <div className="loading">Loading contact information...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="contact-management">
      <div className="header">
        <h1>Contact Management</h1>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>

      <div className="content-wrapper">
        <section className="contact-info-section">
          <h2>Contact Information</h2>
          <form onSubmit={handleSaveContactInfo}>
            <div className="form-group">
              <label htmlFor="dean">Dean</label>
              <input
                type="text"
                id="dean"
                name="dean"
                value={contactInfo.dean}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="associateDean">Associate Dean</label>
              <input
                type="text"
                id="associateDean"
                name="associateDean"
                value={contactInfo.associateDean}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="director">Director</label>
              <input
                type="text"
                id="director"
                name="director"
                value={contactInfo.director}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Department Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="officeHours">Office Hours</label>
              <textarea
                id="officeHours"
                name="officeHours"
                value={contactInfo.officeHours}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>

        {/* <section className="map-section">
          <h2>Campus Map</h2>
          <form onSubmit={handleMapUpload}>
            <div className="map-preview">
              {currentMap ? (
                <img 
                  src={currentMap} 
                  alt="Current Campus Map" 
                  className="map-image"
                />
              ) : (
                <div className="no-map">No map uploaded</div>
              )}
            </div> */}

            {/* <div className="form-group">
              <label htmlFor="map">Upload New Map</label>
              <input
                type="file"
                id="map"
                name="map"
                accept="image/*,.pdf"
                onChange={handleMapChange}
              />
            </div> */}

            {/* <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={!mapFile || saving}
              >
                {saving ? 'Uploading...' : 'Upload Map'}
              </button>
            </div>
          </form>
        </section> */}
      </div>
    </div>
  );
};

export default ContactManagement; 