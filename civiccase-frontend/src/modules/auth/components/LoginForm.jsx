import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        role
        fullName
      }
    }
  }
`;

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      localStorage.setItem('token', data.login.token);
      
      if (data.login.user.role === 'MUNICIPAL_STAFF') {
        navigate('/staff');
      } else {
        navigate('/resident');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">CivicCase Login</h2>
        
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="border p-2 rounded"
          required
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="border p-2 rounded"
          required
        />
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error.message}</p>}
      </form>
    </div>
  );
}