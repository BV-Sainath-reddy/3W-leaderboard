import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSelect = ({ onClaim, onUserAdd }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async () => {
    if (!selectedUser) return;
    
    try {
      const res = await axios.post(`http://localhost:5000/api/users/${selectedUser}/claim`);
      onClaim(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', { name: newUserName });
      setNewUserName('');
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-select">
      <select 
        value={selectedUser} 
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select a user</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      
      <button onClick={handleClaim} disabled={!selectedUser}>
        Claim Points
      </button>
      
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel' : 'Add User'}
      </button>
      
      {showAddForm && (
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter user name"
            required
          />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
};

export default UserSelect;