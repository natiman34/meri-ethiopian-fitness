import React, { useState, useEffect } from 'react';
import { validateImageExists, normalizePath } from '../utils/mediaUtils';

interface ImagePathDebuggerProps {
  paths: string[];
}

const ImagePathDebugger: React.FC<ImagePathDebuggerProps> = ({ paths }) => {
  const [results, setResults] = useState<{path: string, normalized: string, exists: boolean}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaths = async () => {
      const checks = await Promise.all(
        paths.map(async (path) => {
          const normalized = normalizePath(path);
          const exists = await validateImageExists(normalized);
          return { path, normalized, exists };
        })
      );
      setResults(checks);
      setLoading(false);
    };

    checkPaths();
  }, [paths]);

  if (loading) {
    return <div>Checking image paths...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Image Path Diagnostics</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normalized Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.path}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.normalized}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${result.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.exists ? 'Found' : 'Not Found'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImagePathDebugger;