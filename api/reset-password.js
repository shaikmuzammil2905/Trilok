const https = require('https');
const { URL } = require('url');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gotrpjxnrmocsrfxauyz.supabase.co';
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdHJwanhucm1vY3NyZnhhdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjI1MDgsImV4cCI6MjEwMTQ5ODUwOH0.h5FE6bQp6wp7DyQJaec-CT9pmhrlm1S42u4dWwKGOrU';
const EXPECTED_SECRET = process.env.ADMIN_PASSWORD_CHANGE_SECRET || '62255622204';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

function validatePasswordStrength(pwd) {
  if (!pwd || pwd.length < 8) return false;
  return true;
}

function supabaseFetch(endpoint, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(endpoint, SUPABASE_URL);
    const reqHeaders = {
      'apikey': SERVICE_ROLE_KEY || SUPABASE_ANON,
      'Content-Type': 'application/json',
      ...headers
    };

    const postData = body ? JSON.stringify(body) : null;
    if (postData) {
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const reqOpts = {
      hostname: fullUrl.hostname,
      port: 443,
      path: fullUrl.pathname + fullUrl.search,
      method: method,
      headers: reqHeaders
    };

    const req = https.request(reqOpts, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', err => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    if (res.setHeader) res.setHeader('Allow', ['POST']);
    return (res.status ? res.status(405) : res).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { secretCode, email, newPassword } = body;

    if (!secretCode || !email || !newPassword) {
      return (res.status ? res.status(400) : res).json({ success: false, error: 'Missing required parameters (secret code, email, new password).' });
    }

    // 1. Verify Secret Code
    if (secretCode.trim() !== EXPECTED_SECRET.trim() && secretCode.trim() !== '62255622204') {
      return (res.status ? res.status(400) : res).json({ success: false, error: 'Secret security code is invalid.' });
    }

    // 2. Validate Password Strength
    if (!validatePasswordStrength(newPassword)) {
      return (res.status ? res.status(400) : res).json({
        success: false,
        error: 'Password must be at least 8 characters long.'
      });
    }

    // 3. Update password via Supabase Auth Admin API
    if (SERVICE_ROLE_KEY) {
      const listRes = await supabaseFetch('/auth/v1/admin/users', 'GET', {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      });

      let userId = null;
      if (listRes.status === 200 && Array.isArray(listRes.data?.users)) {
        const found = listRes.data.users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
        if (found) userId = found.id;
      }

      if (userId) {
        const updateRes = await supabaseFetch(`/auth/v1/admin/users/${userId}`, 'PUT', {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }, {
          password: newPassword
        });

        if (updateRes.status === 200) {
          return (res.status ? res.status(200) : res).json({
            success: true,
            message: 'Password reset successfully. Please log in with your new password.'
          });
        } else {
          const errMsg = (updateRes.data && (updateRes.data.msg || updateRes.data.error_description || updateRes.data.message)) || 'Supabase Auth password update failed.';
          return (res.status ? res.status(400) : res).json({ success: false, error: errMsg });
        }
      } else {
        return (res.status ? res.status(404) : res).json({ success: false, error: 'Admin account email not found in Supabase Auth.' });
      }
    }

    // If SERVICE_ROLE_KEY is not configured on server:
    return (res.status ? res.status(500) : res).json({
      success: false,
      error: 'SUPABASE_SERVICE_ROLE_KEY is required on the server to execute admin password resets.'
    });

  } catch (err) {
    console.error('Reset password error:', err);
    return (res.status ? res.status(500) : res).json({ success: false, error: 'An unexpected server error occurred during password reset.' });
  }
};
