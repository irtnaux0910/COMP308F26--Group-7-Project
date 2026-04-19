import IssueForm from '../components/IssueForm';
import IssueList from '../components/IssueList'; // <-- Import the new list

export default function ResidentDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-blue-900">CivicCase Resident Portal</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded font-semibold hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Render the Submission Form */}
        <IssueForm />
        
        {/* Render the Resident's Tracking List */}
        <IssueList />
        
      </div>
    </div>
  );
}