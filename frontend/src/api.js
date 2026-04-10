import { localDb } from './localDb';

export const api = {
  get: (path) => localDb.get(path),
  post: (path, body) => localDb.post(path, body),
  put: (path, body) => localDb.put(path, body),
  del: (path) => localDb.del(path),
  upload: (path, formData) => localDb.upload(path, formData),
  download: (id) => localDb.download(id),
};
