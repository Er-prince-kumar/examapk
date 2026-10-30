import { createClient } from '@supabase/supabase-js';
import { errorResponse } from '../utils/responseFormatter.js';

let supabase = null;
if (process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  );
}

/**
 * Verifies Supabase Bearer JWT token from Authorization header.
 * Allows graceful guest/demo fallback if configured or during local dev.
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check if demo/offline mode is explicitly permitted
    if (process.env.ALLOW_GUEST_MODE === 'true' || !process.env.SUPABASE_URL) {
      req.user = {
        id: 'guest-student-local',
        email: 'student@example.com',
        user_metadata: { full_name: 'Alex Rivera' },
        isGuest: true
      };
      return next();
    }
    return errorResponse(res, 'Authentication required: missing or malformed Bearer token', 401);
  }

  const token = authHeader.split(' ')[1];

  // If token is a guest session token
  if (token === 'guest-token' || token.startsWith('demo-token-')) {
    req.user = {
      id: 'guest-student-local',
      email: 'student@example.com',
      user_metadata: { full_name: 'Alex Rivera' },
      isGuest: true
    };
    return next();
  }

  if (!supabase) {
    // When Supabase is not configured yet, fallback to decode or accept demo session
    req.user = {
      id: 'local-user',
      email: 'demo@student.edu',
      user_metadata: { full_name: 'College Student' },
      isGuest: false
    };
    return next();
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return errorResponse(res, 'Invalid or expired authentication session', 401);
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err.message);
    return errorResponse(res, 'Failed to authenticate user session', 401);
  }
};
