import { useCallback } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux';

import { uploadPhoto, deletePhoto } from '../../store/photos/actions';
import { blobToFile, parseErrors } from '../index';

const usePhotos = (form, uploader) => {
  const dispatch = useDispatch();

  const upload = useCallback(async (value) => {
    try {
      const blob = await fetch(value).then((r) => r.blob());
      if (!blob.type.includes('image')) throw new Error('Provided file is not an image');
      const f = blobToFile(blob);
      uploader.current.onStart(f);
      const { error, data } = await dispatch(uploadPhoto(f, uploader.current.onProgress));
      if (error?.response?.data?.errors) {
        form.setFields(parseErrors(error.response.data.errors));
      } else if (error) {
        message.error(error.message);
      } else {
        uploader.current.onSuccess(data, f, {});
      }
    } catch (e) {
      message.error(e.message);
    }
  }, [dispatch, form, uploader]);

  const del = useCallback((file) => {
    if (file.response?.id) dispatch(deletePhoto(file.response.id));
  }, [dispatch]);

  return [upload, del];
};

export default usePhotos;
