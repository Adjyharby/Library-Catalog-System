import { useState, useEffect } from 'react';
import axios from 'axios';
import './library.css'; // Assume this file adds additional styling

export default function Accounts() {
  // Change this value to test different behavior.
  // Only "librarian" will see and access admin functions.
  const currentUser = { Name: 'librarian' }; // or { Name: 'admin1' } for non-librarian

  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ Name: '', Password: '' });
  const [editingAccount, setEditingAccount] = useState(null);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost/API/admin.php', {
        params: { currentUser: currentUser.Name }
      });
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingAccount) {
      setEditingAccount({ ...editingAccount, [name]: value });
    } else {
      setNewAccount({ ...newAccount, [name]: value });
    }
  };

  const handleCreateAccount = async () => {
    if (!newAccount.Name || !newAccount.Password) return;
    try {
      // For account creation, pass currentUser as a GET parameter.
      await axios.post('http://localhost/API/admin.php?currentUser=' + currentUser.Name, newAccount);
      fetchAccounts();
      setNewAccount({ Name: '', Password: '' });
    } catch (error) {
      console.error("Error creating account:", error);
      alert(error.response.data.error);
    }
  };

  const handleDeleteAccount = async (AdminID) => {
    try {
      await axios.delete('http://localhost/API/admin.php', {
        params: { AdminID, currentUser: currentUser.Name }
      });
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(error.response.data.error);
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount.Name || !editingAccount.Password) return;
    try {
      // Include currentUser in the PUT data
      await axios.put('http://localhost/API/admin.php', {
        ...editingAccount,
        currentUser: currentUser.Name
      });
      setEditingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error("Error updating account:", error);
      alert(error.response.data.error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAccount) {
      handleUpdateAccount();
    } else {
      handleCreateAccount();
    }
  };

  // Only show full admin functions if the current user is librarian
  const isLibrarian = currentUser.Name.toLowerCase() === 'librarian';

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Accounts</h2>
      {/* Accounts Table */}
      <table className="admin-table" border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Name</th>
            <th>Password</th>
            {isLibrarian && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.AdminID}>
              <td>{account.AdminID}</td>
              <td>{account.Name}</td>
              <td>
                {isLibrarian || account.Name === currentUser.Name
                  ? account.Password
                  : '******'}
              </td>
              {isLibrarian && (
                <td>
                  <button onClick={() => handleEditAccount(account)}>Edit</button>
                  {/* Do not render delete for librarian account */}
                  {account.Name.toLowerCase() !== 'librarian' && (
                    <button onClick={() => handleDeleteAccount(account.AdminID)} style={{ marginLeft: '10px' }}>
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Account Creation / Editing Form (only visible for librarian) */}
      {isLibrarian && (
        <div style={{ marginTop: '20px' }}>
          <h3>{editingAccount ? 'Edit Account' : 'Create Account'}</h3>
          <form onSubmit={handleSubmit} className="account-form">
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="Name"
                placeholder="Name"
                value={editingAccount ? editingAccount.Name : newAccount.Name}
                onChange={handleInputChange}
                disabled={editingAccount && editingAccount.Name.toLowerCase() === 'librarian'} // Prevent editing librarian name
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="password"
                name="Password"
                placeholder="Password"
                value={editingAccount ? editingAccount.Password : newAccount.Password}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">
              {editingAccount ? 'Update Account' : 'Create Account'}
            </button>
            {editingAccount && (
              <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
