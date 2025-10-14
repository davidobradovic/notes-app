"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[300px] p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
});

export function QuillEditor({ initialContent, onSave }) {
  const [content, setContent] = useState(initialContent || '');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (initialContent !== undefined) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleChange = (value) => {
    setContent(value);
    if (onSave) {
      onSave(value);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align', 'blockquote', 'code-block',
    'color', 'background', 'link'
  ];

  if (!isClient) {
    return (
      <div className="min-h-[300px] p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Počnite da kucate vašu belešku..."
        style={{
          minHeight: '300px',
        }}
        className="quill-editor"
      />
      <style jsx global>{`
        .quill-editor .ql-editor {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
        }
        
        .quill-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .quill-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border: none;
        }
        
        .quill-editor .ql-editor:focus {
          outline: none;
        }
        
        .quill-editor .ql-toolbar button:hover {
          color: #1f2937;
        }
        
        .quill-editor .ql-toolbar button.ql-active {
          color: #2563eb;
        }
      `}</style>
    </div>
  );
}
