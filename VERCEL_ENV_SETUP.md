# Vercel Environment Variables Setup

## Required Environment Variables for Backend

Make sure all these environment variables are set in your Vercel project settings:

### 1. Server Configuration
```
NODE_ENV=production
PORT=3000
```

### 2. Database (PostgreSQL)
```
DATABASE_URL=postgresql://user:password@host:5432/database
```
**Note**: Get this from your PostgreSQL provider (e.g., Supabase, Neon, Railway)

### 3. Redis (Upstash or other)
```
REDIS_URL=redis://default:password@host:port
```
**Note**: Get this from Upstash or your Redis provider

### 4. JWT Secret
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```
**Note**: Generate a strong random secret key

### 5. Firebase Admin (CRITICAL)
```
FIREBASE_ADMIN_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```
**Note**: This must be a single-line JSON string. Get from Firebase Console > Project Settings > Service Accounts

### 6. Model API Keys
```
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-...
MOONSHOTAI_API_KEY=...
QWEN_API_KEY=...
```
**Note**: Get from respective AI model providers

### 7. Model Configuration
```
DEFAULT_MODEL=groq/compound-mini
VERIFICATION_MODEL=groq/compound
MAX_RETRIES=3
```

### 8. Rate Limiting
```
GLOBAL_RATE_LIMIT=10000
USER_RATE_LIMIT=200
```

### 9. Caching Configuration
```
CACHE_TTL_POPULAR=7776000
CACHE_TTL_NORMAL=604800
CACHE_TTL_VERIFIED=15552000
```

### 10. Admin & Worker
```
ADMIN_TOKEN=admin-secret-token-change-me
WORKER_CONCURRENCY=5
QUEUE_NAME=quicklearn-jobs
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable one by one:
   - Enter the variable name (e.g., `DATABASE_URL`)
   - Enter the value
   - Select which environments to apply to (Production, Preview, Development)
   - Click "Save"

## Testing Environment Variables

After setting all variables, redeploy your backend:
```bash
vercel --prod
```

Check if the deployment is successful and test the endpoints:
- Health check: `https://your-backend-url.vercel.app/health`
- API test: `https://your-backend-url.vercel.app/api/explain` (POST request)

## Common Issues

### Issue 1: "DATABASE_URL not configured"
**Solution**: Make sure `DATABASE_URL` is set in Vercel environment variables

### Issue 2: "Firebase Admin init failed"
**Solution**: Ensure `FIREBASE_ADMIN_JSON` is properly formatted as a single-line JSON string

### Issue 3: "JWT_SECRET not defined"
**Solution**: Set `JWT_SECRET` in Vercel environment variables

### Issue 4: Backend returns 500 errors
**Solution**: 
1. Check Vercel function logs for detailed error messages
2. Ensure all required environment variables are set
3. Verify database connection by checking logs
4. Test Firebase credentials are valid

## Frontend Environment Variables (.env.local)

These should be set locally and in Netlify (for frontend deployment):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

## Verification Checklist

- [ ] All backend environment variables set in Vercel
- [ ] Frontend environment variables set in Netlify
- [ ] Backend deployed successfully to Vercel
- [ ] Frontend deployed successfully to Netlify
- [ ] Health check endpoint returns 200 OK
- [ ] Login flow works end-to-end
- [ ] Explanation API returns results
- [ ] Database connections are working
- [ ] Redis caching is operational

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test backend endpoints with Postman or curl
