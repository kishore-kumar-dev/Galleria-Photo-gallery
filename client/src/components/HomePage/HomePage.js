import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import LightGallery from 'lightgallery/react';


import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgShare from 'lightgallery/plugins/share';
import lgRotate from 'lightgallery/plugins/rotate';


import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';

import './HomePage.css';

const HomePage = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalSize, setTotalSize] = useState(0);

  


  useEffect(() => {
    fetch("http://localhost:5000/user")
      .then(res => res.json())
      .then(res => {
       
        setApiResponse(res);
      });
  }, []);

  useEffect(() => {
    let total = 0;
    apiResponse.forEach(file => {
      if(!file.isBin){
      total += file.filesize;
      }
    });
    setTotalSize(total);
  }, [apiResponse]);
  console.log(totalSize);

  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredImages = apiResponse.filter(item => {
    return item.filename.toLowerCase().includes(searchQuery.toLowerCase());
  });


  const TrashImg = (image) => {
    fetch(`http://localhost:5000/user/${image._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: image.name,
        avatar: image.imgUrl,
        cloudinary_id: image.cloudinary_id,
        isBin: image.isBin,
        // filesize: image.size
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('PUT request succeeded with response:', data);
      alert('Image deleted successfully!');
      window.location.reload();
        
    })
    .catch(error => {
      console.error('Error making PUT request:', error);
    });
  };

  useEffect(() => {
    const deleteIcon = '<span id="lg-delete" class="lg-icon lg-delete"><svg width="24px" height="24px" viewBox="0 0 24 24"><path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z"></path></svg></span>';

    const toolbar = document.querySelector('.lg-toolbar');
    if (toolbar && !document.getElementById('lg-delete')) {
      toolbar.insertAdjacentHTML('beforeend', deleteIcon);

      const deleteBtn = document.getElementById('lg-delete');
      deleteBtn.addEventListener('click', () => {
        
        const currentImage = apiResponse.find(item => item.imgUrl === document.querySelector('.lg-current img').src);
        if (currentImage) {
          TrashImg(currentImage);
        }
      });
    }

    return () => {
      const deleteBtn = document.getElementById('lg-delete');
      if (deleteBtn) {
        deleteBtn.removeEventListener('click', TrashImg);
        deleteBtn.parentNode.removeChild(deleteBtn);
      }
    };
  }, [apiResponse]);

  return (
    <div className="HomePage">
      <nav className="navbar" style={{ backgroundColor: 'black' }}>
        <h1 className="navbar-brand">Google Photos</h1>
        <div className="search-bar">
          <input type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/upload" className="nav-link">Upload</Link>
          <Link to="/bin" className="nav-link">Bin</Link>
        </div>
      </nav>
      <div>
        <h1 className="text-center">Gallery</h1>
        <br />
        <div className="App">
          <LightGallery
            speed={500}
            plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen, lgRotate, lgShare]}
          >
          {searchQuery !== '' ? (
            filteredImages.map(item => {
              if (!item.isBin) {
                return (
                  <a href={item.imgUrl} key={item._id}>
                  <img alt={item._id} src={item.imgUrl} />
                  </a>
                );
              } else {
                return null; 
              }
            })
          ) : (
          apiResponse.map(item => {
            if (!item.isBin) {
              return (
                <a href={item.imgUrl} key={item._id}>
                <img alt={item._id} src={item.imgUrl} />
                </a>
              );
            } else {
              return null; 
            }
          })
        )}
          </LightGallery>
        </div>
      </div>
      <footer>
        Storage: <span id="storage-used">{(totalSize / 1024).toFixed(0)} KB</span>
      </footer>

      <Outlet />
    </div>
  );
};

export default HomePage;
