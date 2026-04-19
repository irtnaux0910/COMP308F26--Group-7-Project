import { useQuery, gql } from '@apollo/client';

const GET_MY_ISSUES = gql`
  query GetMyIssues {
    me {
      id
    }
    issues {
      id
      title
      status
      category
      createdAt
      reportedBy {
        id
      }
    }
  }
`;

export default function IssueList() {
  const { loading, error, data } = useQuery(GET_MY_ISSUES);

  if (loading) return <p className="text-gray-600 mt-8 text-center">Loading your reports...</p>;
  if (error) return <p className="text-red-500 mt-8 text-center">Error loading reports: {error.message}</p>;

  // Filter the master list so the resident only sees their own reports
  const myIssues = data.issues.filter(issue => issue.reportedBy.id === data.me.id);

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">My Reported Issues</h2>
      
      {myIssues.length === 0 ? (
        <p className="text-gray-600 bg-white p-6 rounded-lg shadow-sm border text-center">
          You haven't reported any issues yet. Use the form above to submit your first report!
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myIssues.map(issue => (
            <div key={issue.id} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800 truncate pr-2">{issue.title}</h3>
                
                {/* Dynamic badge color based on status */}
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  issue.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                  issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  issue.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {issue.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{issue.category}</span>
                <span>
                  {/* Format the MongoDB timestamp into a readable date */}
                  {new Date(Number(issue.createdAt) || issue.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}