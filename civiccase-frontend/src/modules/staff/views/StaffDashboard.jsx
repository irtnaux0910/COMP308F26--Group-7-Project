import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_ALL_ISSUES = gql`
  query GetAllIssues {
    issues {
      id
      title
      category
      priority
      status
      location {
        address
      }
      reportedBy {
        fullName
      }
    }
  }
`;

// Mutation to change the status of an issue
const UPDATE_STATUS = gql`
  mutation UpdateIssueStatus($id: ID!, $status: IssueStatus!) {
    updateIssueStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_ALL_ISSUES);
  const [updateStatus] = useMutation(UPDATE_STATUS);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ variables: { id, status: newStatus } });
      refetch(); // Refresh the data to show the new status
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status. Check console.");
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading issues...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading data! {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Municipal Staff Dashboard</h1>
          <button onClick={handleLogout} className="text-red-600 hover:underline font-semibold">
            Logout
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-4 border-b">Title</th>
                <th className="p-4 border-b">Category</th>
                <th className="p-4 border-b">Priority</th>
                <th className="p-4 border-b">Location</th>
                <th className="p-4 border-b">Reporter</th>
                <th className="p-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 border-b">
                  <td className="p-4 font-medium">{issue.title}</td>
                  <td className="p-4">{issue.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${issue.priority === 'URGENT' ? 'bg-red-200 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{issue.location.address || 'N/A'}</td>
                  <td className="p-4 text-sm">{issue.reportedBy.fullName}</td>
                  <td className="p-4">
                    <select 
                      className="border p-1 rounded text-sm cursor-pointer"
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {data.issues.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No issues reported yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}