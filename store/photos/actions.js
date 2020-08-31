import { UPLOAD_PHOTO, DELETE_PHOTO } from './types';
import { URLS } from '../../utils/constants';

/**
 * @param {File} file
 * @param {Function} onProgress
 */
export const uploadPhoto = (file, onProgress) => {
  const data = new FormData();
  data.append('photo', file);
  return {
    type: UPLOAD_PHOTO,
    request: {
      method: 'POST',
      url: URLS.PHOTOS,
      data,
      onUploadProgress: (e) => onProgress(e, file),
    },
  };
};

/**
 * @param {Number} id
 */
export const deletePhoto = (id) => ({
  type: DELETE_PHOTO,
  request: {
    method: 'DELETE',
    url: `${URLS.PHOTOS}/${id}`,
  },
});
