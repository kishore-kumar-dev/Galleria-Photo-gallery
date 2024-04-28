import React from 'react';

const ImagePreview = ({ imageUrl, onDelete }) => {
  return (
    <div className="image-preview">
      <img src={imageUrl} alt="Uploaded" />
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default ImagePreview;
