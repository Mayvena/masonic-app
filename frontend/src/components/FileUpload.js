// client/src/components/FileUpload.js
import React, { useState } from 'react';
import api from '../services/api';

function FileUpload() {
  const [fileData, setFileData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    tags: '',
    requiredAccess: 0,
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFileData({ ...fileData, file: files[0] });
    } else {
      setFileData({ ...fileData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in fileData) {
      formData.append(key, fileData[key]);
    }
    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <input type="text" name="author" placeholder="Author" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} />
        <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
        <input type="number" name="requiredAccess" placeholder="Required Access Level" onChange={handleChange} />
        <input type="file" name="file" onChange={handleChange} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;