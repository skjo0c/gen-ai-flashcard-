import { Routes, Route, Link, Navigate } from 'react-router-dom';
import PDFUpload from './components/PDFUpload';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-700">
              <span className="material-symbols-rounded mr-2">upload_file</span>
              <span className="font-semibold">PDF Upload</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-8">
        <Routes>
          <Route path="/" element={<PDFUpload />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;