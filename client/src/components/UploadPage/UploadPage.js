import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  const handleFileUpload = (fieldName, file, metadata, load, error, progress, abort) => {
    const imageData = new FormData();
    imageData.append('image', file, file.name);
    imageData.append("filename", file.name);
    imageData.append("filesize", file.size)

    // console.log(file.size, typeof file.size);

    fetch('http://localhost:5000/user', {
      method: 'POST',
      body: imageData
    }).then(response => {
    
      console.log(response);
      load(file.file);
      // window.location.reload();
    }).catch(err => {
  
      console.error(err);
      error('Error uploading file');
    });
  };

  return (
    <div className="HomePage">
      <nav className="navbar">
        <h1 className="navbar-brand">Google Photos</h1>
        <div className="search-bar">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/upload" className="nav-link">Upload</Link>
          <Link to="/bin" className="nav-link">Bin</Link>
        </div>
      </nav>
      <div>
        <h1 className="text-center">Upload</h1>
        <br />
        <div className="App">
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={10}
            server={{
              process: handleFileUpload
            }}
            name="files"
            labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      </div>
      <footer>
        Designed and Developed by Kishore Kumar S
      </footer>
      <Outlet />
    </div>
  );
};

export default UploadPage;
