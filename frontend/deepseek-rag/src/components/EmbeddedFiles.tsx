import { useState, useEffect, useRef } from 'react';

interface EmbeddedFilesProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onToggle: () => void;
  selectedDocuments: string[];
  onSelectionChange: (documents: string[]) => void;
  onFileUploaded: () => void;
}

interface Document {
  document_id: string;
  title: string;
  chunk_ids: string[];
  total_chunks: number;
}

export function EmbeddedFiles({ 
  isDarkMode, 
  isOpen, 
  onToggle,
  selectedDocuments, 
  onSelectionChange,
  onFileUploaded 
}: EmbeddedFilesProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedDocuments));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSelection = (documentId: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(documentId)) {
      newSelection.delete(documentId);
    } else {
      newSelection.add(documentId);
    }
    setSelectedIds(newSelection);
    onSelectionChange(Array.from(newSelection));
  };

  const toggleAllDocuments = () => {
    if (selectedIds.size === documents.length) {
      // If all are selected, deselect all
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      // Otherwise, select all
      const allIds = new Set(documents.map(doc => doc.document_id));
      setSelectedIds(allIds);
      onSelectionChange(Array.from(allIds));
    }
  };

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
      // Select all documents by default
      const allIds = new Set(data.map((doc: Document) => doc.document_id)) as Set<string>;
      setSelectedIds(allIds);
      onSelectionChange(Array.from(allIds));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setDeletingIds(prev => new Set(prev).add(documentId));
      const response = await fetch(`/api/document/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }

      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      try {
        const response = await fetch('/api/document', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload file');
        
        await fetchDocuments();
        onFileUploaded();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload file');
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    fetchDocuments();

    // Add event listener for document refresh
    const handleRefresh = () => {
      fetchDocuments();
    };

    document.addEventListener('refresh-documents', handleRefresh);

    return () => {
      document.removeEventListener('refresh-documents', handleRefresh);
    };
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading documents...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="p-4">
          <p>No documents have been embedded yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 p-4">
        <div className="mb-4">
          <button
            onClick={toggleAllDocuments}
            className={`w-full p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {selectedIds.size === documents.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        {documents.map((doc) => (
          <div
            key={doc.document_id}
            className={`rounded-lg ${
              isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'
            }`}
          >
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedIds.has(doc.document_id)}
                  onChange={() => toggleSelection(doc.document_id)}
                  className={`w-4 h-4 rounded ${
                    isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-100 border-gray-300'
                  }`}
                />
                <p className="font-medium flex-grow">{doc.title}</p>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {doc.total_chunks} chunk{doc.total_chunks !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => deleteDocument(doc.document_id)}
                disabled={deletingIds.has(doc.document_id)}
                className={`mt-2 w-full p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-red-900 text-red-100 hover:bg-red-800'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                } ${deletingIds.has(doc.document_id) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {deletingIds.has(doc.document_id) ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span className="ml-2">Delete</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      data-testid="embedded-files"
      className={`fixed left-0 top-0 h-full w-80 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} shadow-lg z-20`}
    >
      <button
        onClick={onToggle}
        className={`absolute right-0 top-1/2 translate-x-full transform rounded-r-lg p-2 shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
        }`}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>

      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Embedded Documents</h2>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`px-3 py-2 rounded-lg font-medium ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors duration-200`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Add Document'
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
} 