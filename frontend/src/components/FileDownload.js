// client/src/components/FileDownload.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function FileDownload() {
  const [files, setFiles] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    category: '',
    tags: ''
  });

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files/download', { params: filters });
      setFiles(res.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleFilter = (e) => {
    e.preventDefault();
    fetchFiles();
  };

  return (
    <div>
      <h2>Available Files</h2>
      <form onSubmit={handleFilter}>
        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="author" placeholder="Author" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />
        <input name="tags" placeholder="Tags" onChange={handleChange} />
        <button type="submit">Filter</button>
      </form>
      <ul>
        {files.map(file => (
          <li key={file.id}>
            <strong>{file.title}</strong> by {file.author} &mdash; 
            <a href={`http://localhost:5000/${file.file_path}`} target="_blank" rel="noreferrer">
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileDownload;