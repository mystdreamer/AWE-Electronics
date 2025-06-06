// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) setError('Invalid credentials');
  };

  const autofill = (role: 'customer' | 'employee') => {
    if (role === 'customer') {
      setUsername('customer1');
      setPassword('pass123');
    } else {
      setUsername('employee1');
      setPassword('pass456');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in…' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        <strong>Demo Accounts:</strong>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>
            👤 Customer: <code>customer1 / pass123</code>{' '}
            <button type="button" onClick={() => autofill('customer')}>
              Autofill
            </button>
          </li>
          <li>
            👩‍💼 Employee: <code>employee1 / pass456</code>{' '}
            <button type="button" onClick={() => autofill('employee')}>
              Autofill
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
