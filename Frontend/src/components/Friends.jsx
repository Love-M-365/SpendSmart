import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Spinner } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import './AllUsers.css';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // ✅ New state for showing alert
  const apiUrl = import.meta.env.VITE_API_URL;
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${apiUrl}/api/users`);
        const allUsers = Array.isArray(userRes.data) ? userRes.data : userRes.data.users || [];
        setUsers(allUsers);

        if (currentUserId) {
          const friendRes = await axios.get(`${apiUrl}/api/users/${currentUserId}/friends`);
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
    fetchData();
  }, [currentUserId]);

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post(`${apiUrl}/api/users/${currentUserId}/add-friend`, { friendId });
      const updatedFriends = await axios.get(`${apiUrl}/api/users/${currentUserId}/friends`);
      setAddedFriends(updatedFriends.data);
      setShowAlert(true); // ✅ Show alert
      setTimeout(() => setShowAlert(false), 3000); // ✅ Auto-hide alert after 3 seconds
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };

  const renderUserCard = (user, isFriend = false) => (
    <div className="card user-card shadow-sm" key={user._id}>
      <div className="card-body d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="avatar rounded-circle me-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6 className="mb-0">{user.name}</h6>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>
        {!isFriend && user._id !== currentUserId && (
          <button
            className="btn btn-sm btn-outline-primary"
            title="Add Friend"
            onClick={() => handleAddFriend(user._id)}
          >
            <FaUserPlus /> Add
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      {/* ✅ Bootstrap Success Alert */}
      {showAlert && (
        <div className="container " style={{marginTop:"5rem"}}>
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            🎉 Friend added successfully!
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAlert(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      <div className="container py-5" style={{ marginTop: "3rem" }}>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <section className="mb-5">
              <h4 className="text-primary mb-3">👥 Your Friends</h4>
              {addedFriends.length === 0 ? (
                <p className="text-muted text-center">You haven't added any friends yet.</p>
              ) : (
                <div className="row g-3">
                  {addedFriends.map(friend => (
                    <div className="col-md-6 col-lg-4" key={friend._id}>
                      {renderUserCard(friend, true)}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h4 className="text-primary mb-3">🌍 All Users</h4>
              {users.length === 0 ? (
                <p className="text-muted text-center">No users found.</p>
              ) : (
                <div className="row g-3">
                  {users
                    .filter(u => u._id !== currentUserId && !addedFriends.some(f => f._id === u._id))
                    .map(user => (
                      <div className="col-md-6 col-lg-4" key={user._id}>
                        {renderUserCard(user)}
                      </div>
                    ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}

export default AllUsers;
