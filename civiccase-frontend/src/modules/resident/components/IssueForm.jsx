import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_ISSUE = gql`
  mutation CreateIssue($title: String!, $description: String!, $category: IssueCategory, $priority: Priority, $location: LocationInput!) {
    createIssue(title: $title, description: $description, category: $category, priority: $priority, location: $location) {
      id
      title
      status
    }
  }
`;

export default function IssueForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [priority, setPriority] = useState('MEDIUM');
  const [location, setLocation] = useState({ longitude: -79.3832, latitude: 43.6532, address: 'Toronto, ON' });

  const [createIssue, { loading, error, data }] = useMutation(CREATE_ISSUE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIssue({
        variables: {
          title,
          description,
          category,
          priority,
          location: {
            longitude: parseFloat(location.longitude),
            latitude: parseFloat(location.latitude),
            address: location.address
          }
        }
      });
      setTitle('');
      setDescription('');
      alert("Issue reported successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Report an Issue</h2>
      
      <input className="border p-2 rounded" type="text" placeholder="Issue Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="border p-2 rounded h-24" placeholder="Describe the issue..." value={description} onChange={(e) => setDescription(e.target.value)} required />
      
      <div className="flex gap-4">
        <select className="border p-2 rounded w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="POTHOLE">Pothole</option>
          <option value="STREETLIGHT">Streetlight</option>
          <option value="FLOODING">Flooding</option>
          <option value="SAFETY">Safety</option>
          <option value="OTHER">Other</option>
        </select>
        
        <select className="border p-2 rounded w-full" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>

      {error && <p className="text-red-500 text-sm">Error: {error.message}</p>}
      {data && <p className="text-green-600 text-sm">Success! Issue #{data.createIssue.id.slice(-4)} created.</p>}
    </form>
  );
}