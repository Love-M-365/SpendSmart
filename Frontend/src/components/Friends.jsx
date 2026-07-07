import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Spinner } from 'react-bootstrap';
import { UserPlus, UserCheck, Search } from 'lucide-react';
import './AllUsers.css';
import { API_BASE } from '../api';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentUserId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const userRes = await axios.get(`${API_BASE}/users`);
      const allUsers = Array.isArray(userRes.data) ? userRes.data : userRes.data.users || [];
      setUsers(allUsers);

      if (currentUserId) {
        const friendRes = await axios.get(`${API_BASE}/users/${currentUserId}/friends`);
        setAddedFriends(friendRes.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setUsers([]);
      setAddedFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUserId]);

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post(`${API_BASE}/users/${currentUserId}/add-friend`, { friendId });
      const updatedFriends = await axios.get(`${API_BASE}/users/${currentUserId}/friends`);
      setAddedFriends(updatedFriends.data);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };

  const renderUserCard = (user, isFriend = false) => (
    <div className="card user-card shadow-sm" key={user._id}>
      <div className="card-body d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center">
          <div className={`avatar rounded-circle me-3 ${isFriend ? 'friend-avatar' : 'stranger-avatar'}`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6 className="user-name mb-0">{user.name}</h6>
            <small className="user-email text-muted">{user.email}</small>
          </div>
        </div>
        
        {isFriend ? (
          <span className="badge bg-success-subtle text-success px-2.5 py-1.5 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
            <UserCheck size={14} /> Friend
          </span>
        ) : user._id !== currentUserId ? (
          <button
            className="btn btn-sm btn-outline-primary btn-add-friend d-flex align-items-center gap-1"
            title="Add Friend"
            onClick={() => handleAddFriend(user._id)}
          >
            <UserPlus size={14} /> Add
          </button>
        ) : (
          <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1.5 rounded-pill" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
            You
          </span>
        )}
      </div>
    </div>
  );

  const filteredStrangerUsers = users
    .filter(u => u._id !== currentUserId && !addedFriends.some(f => f._id === u._id))
    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredFriends = addedFriends
    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <Navbar />

      <div className="container py-5" style={{ marginTop: "5rem", marginBottom: "3rem" }}>
        {/* Alerts section */}
        {showAlert && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3 border-0 shadow-sm" role="alert">
            <UserCheck size={18} className="text-success" />
            <div style={{ fontWeight: 600 }}>🎉 Friend added successfully!</div>
          </div>
        )}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <div>
            <h2 className="fw-bold m-0">👥 Split Partners</h2>
            <p className="text-muted m-0">Search and connect with friends to split bills instantly</p>
          </div>
          
          {/* Custom Search Box */}
          <div className="position-relative" style={{ maxWidth: "350px", width: "100%" }}>
            <input 
              type="text" 
              className="modern-input" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
            <Search size={18} className="position-absolute text-muted" style={{ left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5 p-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3">Loading split network details...</p>
          </div>
        ) : (
          <div className="friends-container">
            {/* Friends list section */}
            <section className="mb-5">
              <h4 className="friends-section-title">Your Friend Network ({filteredFriends.length})</h4>
              {filteredFriends.length === 0 ? (
                <p className="text-muted text-center py-4 bg-card rounded-3 border">
                  {searchQuery ? 'No matching friends found.' : "You haven't added any friends yet. Look below to connect!"}
                </p>
              ) : (
                <div className="row g-3">
                  {filteredFriends.map(friend => (
                    <div className="col-md-6 col-lg-4" key={friend._id}>
                      {renderUserCard(friend, true)}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Other users list section */}
            <section>
              <h4 className="friends-section-title">Discover Other Users ({filteredStrangerUsers.length})</h4>
              {filteredStrangerUsers.length === 0 ? (
                <p className="text-muted text-center py-4 bg-card rounded-3 border">
                  No other users found.
                </p>
              ) : (
                <div className="row g-3">
                  {filteredStrangerUsers.map(user => (
                    <div className="col-md-6 col-lg-4" key={user._id}>
                      {renderUserCard(user, false)}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}

export default AllUsers;
