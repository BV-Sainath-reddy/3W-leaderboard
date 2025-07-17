import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data.sort((a, b) => b.points - a.points));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchUserHistory = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}/history`);
      setUserHistory(res.data);
      setSelectedUserId(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async () => {
    if (!selectedUser) return;
    try {
      await axios.post(`http://localhost:5000/api/users/${selectedUser}/claim`);
      fetchLeaderboard();
      if (selectedUserId === selectedUser) {
        fetchUserHistory(selectedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', { name: newUserName });
      setNewUserName('');
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="leaderboard-container">Loading...</div>;

  return (
    <div className="leaderboard-container">
      <div className="main-content">
        {/* History Panel - Now on the left */}
        <div className="history-panel">
          {selectedUserId ? (
            <div className="history-section">
              <h3>
                {users.find(u => u._id === selectedUserId)?.name}'s History
                <button 
                  className="close-history"
                  onClick={() => setSelectedUserId(null)}
                >
                  ×
                </button>
              </h3>
              
              {userHistory.length === 0 ? (
                <p>No history available</p>
              ) : (
                <div className="history-list">
                  {userHistory.map((record, index) => (
                    <div key={index} className="history-item">
                      <span className="history-points">+{record.points} points</span>
                      <span className="history-date">
                        {new Date(record.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-history">
              <p>Click a user to view their point history</p>
            </div>
          )}
        </div>

        {/* Leaderboard - Now on the right */}
        <div className="leaderboard-panel">
          <div className="controls">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
            
            <button onClick={handleClaim} disabled={!selectedUser}>
              Claim Points
            </button>
          </div>

          <form onSubmit={handleAddUser} className="controls">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="New user name"
              required
            />
            <button type="submit">Add User</button>
          </form>

          <div className="leaderboard-list">
            {users.map((user) => (
              <div 
                key={user._id} 
                className={`leaderboard-item ${selectedUserId === user._id ? 'selected' : ''}`}
                onClick={() => fetchUserHistory(user._id)}
              >
                <div className="user-info">
                  <div className="user-avatar">{user.name.charAt(0)}</div>
                  <span>{user.name}</span>
                </div>
                <span className="user-points">{user.points.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;