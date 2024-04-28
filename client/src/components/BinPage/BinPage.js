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

import './BinPage.css';

const BinPage = () => {
  const [apiResponse, setApiResponse] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/user")
      .then(res => res.json())
      .then(res => {
        setApiResponse(res);
      });
  }, []);

  const RestoreImg = (image) => {
    fetch(`http://localhost:5000/user/${image._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: image.name,
        avatar: image.imgUrl,
        cloudinary_id: image.cloudinary_id,
        isBin: image.isBin
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('PUT request succeeded with response:', data);
      alert('Image Restored successfully!');
      window.location.reload();
          
        
        
    })
    .catch(error => {
      console.error('Error making PUT request:', error);
    });
  };

  useEffect(() => {
    const RestoreIcon = '<span id="lg-restore" class="lg-icon lg-delete"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="24px" height="24px" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"/></svg>';

    const toolbar = document.querySelector('.lg-toolbar');
    if (toolbar && !document.getElementById('lg-restore')) {
      toolbar.insertAdjacentHTML('beforeend', RestoreIcon);

      const deleteBtn = document.getElementById('lg-restore');
      deleteBtn.addEventListener('click', () => {
        // Get the image associated with the delete icon
        const currentImage = apiResponse.find(item => item.imgUrl === document.querySelector('.lg-current img').src);
        if (currentImage) {
          RestoreImg(currentImage);
        }
      });
    }

    return () => {
      const restoreBtn = document.getElementById('lg-restore');
      if (restoreBtn) {
        restoreBtn.removeEventListener('click', RestoreImg);
        restoreBtn.parentNode.removeChild(restoreBtn);
      }
    };
  }, [apiResponse]);

  return (
    <div className="HomePage">
      <nav className="navbar" style={{ backgroundColor: 'black' }}>
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
        <h1 className="text-center">Deleted Photos</h1>
        <br />
        <div className="App">
          <LightGallery
            speed={500}
            plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen, lgRotate, lgShare]}
          >
            {apiResponse.map(item => {
              if (item.isBin) {
                return (
                  <a href={item.imgUrl} key={item._id}>
                    <img alt={item._id} src={item.imgUrl} />
                  </a>
                );
              } else {
                return null; 
              }
            })}
          </LightGallery>
        </div>
        <footer>
          Designed and Developed by Kishore Kumar S
        </footer>
      </div>
      <Outlet />
    </div>
  );
};

export default BinPage;
