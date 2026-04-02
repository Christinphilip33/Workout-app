import { useState, useRef } from 'react';
import { exportAllData, importData } from '../utils/dataExport.js';

export default function DataManager() {
  const [status, setStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    setStatus({ type: 'loading', message: 'Exporting...' });
    const result = await exportAllData();
    if (result.success) {
      setStatus({ type: 'success', message: 'Backup downloaded!' });
    } else {
      setStatus({ type: 'error', message: result.error });
    }
    setTimeout(() => setStatus(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('This will replace all your current data. Continue?')) {
      e.target.value = '';
      return;
    }

    setIsImporting(true);
    setStatus({ type: 'loading', message: 'Importing...' });

    const result = await importData(file);

    if (result.success) {
      setStatus({ type: 'success', message: `Restored from ${new Date(result.importedAt).toLocaleDateString()}` });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setStatus({ type: 'error', message: result.error });
      setIsImporting(false);
    }

    e.target.value = '';
  };

  return (
    <div className="glass-card p-5 rounded-2xl">
      <h3 className="text-white font-bold text-sm mb-3">Data Management</h3>
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          disabled={status?.type === 'loading'}
          className="flex-1 bg-gray-800 text-gray-300 font-semibold text-sm py-2.5 px-4 rounded-xl border border-gray-700 hover:bg-gray-700 hover:text-white transition-all disabled:opacity-50"
          aria-label="Export all workout data"
        >
          Export Backup
        </button>
        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="flex-1 bg-gray-800 text-gray-300 font-semibold text-sm py-2.5 px-4 rounded-xl border border-gray-700 hover:bg-gray-700 hover:text-white transition-all disabled:opacity-50"
          aria-label="Import workout data from backup"
        >
          Import Backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
      {status && (
        <p className={`text-xs mt-3 ${
          status.type === 'success' ? 'text-green-400' :
          status.type === 'error' ? 'text-red-400' :
          'text-gray-400'
        }`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
