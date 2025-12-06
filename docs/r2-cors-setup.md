# Cloudflare R2 CORS Configuration

## Problem

The image upload is failing with a network error because the R2 bucket doesn't have CORS (Cross-Origin Resource Sharing) configured. This prevents the browser from uploading files directly to R2.

## Solution

You need to configure CORS on your R2 bucket to allow uploads from your application's domain.

### Step 1: Access Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the left sidebar
3. Click on your bucket (the one specified in `R2_BUCKET_NAME`)

### Step 2: Configure CORS Settings

1. Click on the **Settings** tab
2. Scroll down to **CORS Policy**
3. Click **Add CORS Policy** or **Edit**

### Step 3: Add CORS Rules

Add the following CORS configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**Important:** Replace `https://your-production-domain.com` with your actual production domain.

### Step 4: Save and Test

1. Click **Save** to apply the CORS configuration
2. Wait a few seconds for the changes to propagate
3. Try uploading an image again in your admin panel

## Explanation

### Why This is Needed

**CORS (Cross-Origin Resource Sharing)** is a security feature that prevents websites from making requests to different domains unless explicitly allowed. When you upload a file directly from the browser to R2:

1. Your Next.js app generates a **presigned URL** (a temporary, secure URL)
2. The browser makes a **PUT request** directly to R2 (not through your server)
3. R2 checks if your domain is allowed to make this request
4. Without CORS configured, R2 **blocks** the request

### What Each Setting Does

- **AllowedOrigins**: Domains that can upload to your bucket
  - Include `localhost` for development
  - Include your production domain(s)
- **AllowedMethods**: HTTP methods that are permitted
  - `PUT` is required for uploads
  - `GET` is required for viewing images
- **AllowedHeaders**: Which headers the browser can send
  - `*` allows all headers (including `Content-Type`)
- **ExposeHeaders**: Headers that the browser can read from the response
  - `ETag` is useful for caching
- **MaxAgeSeconds**: How long browsers can cache the CORS preflight response
  - `3600` = 1 hour

## Alternative: Upload Through Server

If you prefer not to use direct browser uploads, you can upload through your Next.js server instead:

### Pros:

- No CORS configuration needed
- More control over uploads
- Can add server-side validation

### Cons:

- Slower (file goes through your server)
- Uses more server bandwidth
- More complex implementation

Let me know if you'd like me to implement the server-side upload approach instead!

## Troubleshooting

### Still Getting Errors After CORS Configuration?

1. **Clear browser cache** and try again
2. **Check the browser console** for the exact error message
3. **Verify the domain** matches exactly (including `http://` vs `https://`)
4. **Wait a few minutes** for CORS changes to propagate

### How to Test CORS is Working

Open your browser console and check the logs. You should see:

```
Getting presigned URL for: image.jpg image/jpeg
Presigned URL received: https://...
Sending file to R2...
XHR onload - Status: 200
```

If you see `XHR error event` or `Network error`, CORS is still not configured correctly.
