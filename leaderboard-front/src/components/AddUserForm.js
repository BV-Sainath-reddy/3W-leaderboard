import React, { useState } from 'react';
import axios from 'axios';

const AddUserForm = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', { name });
      setName('');
      setError('');
      onUserAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter user name"
        required
      />
      <button type="submit">Add User</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default AddUserForm;
