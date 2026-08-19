const https = require('https');
const { URL } = require('url');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gotrpjxnrmocsrfxauyz.supabase.co';
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdHJwanhucm1vY3NyZnhhdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjI1MDgsImV4cCI6MjEwMTQ5ODUwOH0.h5FE6bQp6wp7DyQJaec-CT9pmhrlm1S42u4dWwKGOrU';
const EXPECTED_SECRET = process.env.ADMIN_PASSWORD_CHANGE_SECRET;

function validatePasswordStrength(pwd) {
  if (!pwd || pwd.length < 8) return false;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);
  return hasUpper && hasLower && hasNum;
}

function supabaseFetch(endpoint, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(endpoint, SUPABASE_URL);
    const reqHeaders = {
      'apikey': SUPABASE_ANON,
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
    const authHeader = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return (res.status ? res.status(401) : res).json({ success: false, error: 'Authentication token required.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { currentPassword, secretCode, newPassword } = body;

    if (!currentPassword || !secretCode || !newPassword) {
      return (res.status ? res.status(400) : res).json({ success: false, error: 'Missing required parameters.' });
    }

    // 1. Validate Secret Code (Server-Side)
    if (!EXPECTED_SECRET || secretCode !== EXPECTED_SECRET) {
      return (res.status ? res.status(400) : res).json({ success: false, error: 'Security code is invalid.' });
    }

    // 2. Validate Password Strength
    if (!validatePasswordStrength(newPassword)) {
      return (res.status ? res.status(400) : res).json({
        success: false,
        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
      });
    }

    // 3. Validate Caller Session with Supabase Auth
    const userRes = await supabaseFetch('/auth/v1/user', 'GET', {
      'Authorization': `Bearer ${token}`
    });

    if (userRes.status !== 200 || !userRes.data || !userRes.data.id) {
      return (res.status ? res.status(401) : res).json({ success: false, error: 'Invalid or expired session. Please log in again.' });
    }

    const userEmail = userRes.data.email;

    // 4. Verify Current Password by Sign-in attempt with Supabase Auth API
    const signInRes = await supabaseFetch('/auth/v1/token?grant_type=password', 'POST', {}, {
      email: userEmail,
      password: currentPassword
    });

    if (signInRes.status !== 200 || !signInRes.data || !signInRes.data.access_token) {
      return (res.status ? res.status(400) : res).json({ success: false, error: 'Current password is incorrect.' });
    }

    // 5. Update Password in Supabase Auth API
    const updateRes = await supabaseFetch('/auth/v1/user', 'PUT', {
      'Authorization': `Bearer ${token}`
    }, {
      password: newPassword
    });

    if (updateRes.status !== 200) {
      const errMsg = (updateRes.data && (updateRes.data.msg || updateRes.data.error_description || updateRes.data.message)) || 'Failed to update password.';
      return (res.status ? res.status(400) : res).json({ success: false, error: errMsg });
    }

    return (res.status ? res.status(200) : res).json({
      success: true,
      message: 'Password updated successfully. Please log in with your new password.'
    });

  } catch (err) {
    console.error('Password change error:', err);
    return (res.status ? res.status(500) : res).json({ success: false, error: 'An unexpected server error occurred.' });
  }
};

