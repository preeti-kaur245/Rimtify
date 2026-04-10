const API = '/api';

async function request(method, path, body, isFormData = false) {
  const opts = { method, credentials: 'include' };
  
  if (!isFormData) {
    opts.headers = { 'Content-Type': 'application/json' };
    if (body) opts.body = JSON.stringify(body);
  } else {
    opts.body = body;
  }
  
  const res = await fetch(API + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
  upload: (path, formData) => request('POST', path, formData, true),
};
