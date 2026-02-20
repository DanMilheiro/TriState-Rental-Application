# Deploying Rental Tracker Pro to Fly.io

This guide will walk you through deploying your Rental Tracker Pro application to Fly.io.

## Prerequisites

1. **Install flyctl** (Fly.io CLI):
   - Windows: `powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"`
   - Mac: `brew install flyctl`
   - Linux: `curl -L https://fly.io/install.sh | sh`

2. **Sign up/Login to Fly.io**:
   ```bash
   flyctl auth signup
   # or if you already have an account
   flyctl auth login
   ```

## Deployment Steps

### Step 1: Prepare Your Environment Variables

Your app uses Supabase for the database. You'll need to set these environment variables in Fly.io:

```bash
flyctl secrets set VITE_SUPABASE_URL="your-supabase-url"
flyctl secrets set VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to Settings > API
- Copy the Project URL, anon/public key, and service_role key

### Step 2: Create Your Fly.io App

From the project directory, run:

```bash
flyctl launch
```

This command will:
- Detect your `fly.toml` configuration
- Ask you to confirm the app name (default: `rental-tracker-pro`)
- Ask you to select a region (closest to you or your users)
- Ask if you want to deploy now - **say NO** for now

### Step 3: Create Persistent Storage Volume

Your app needs persistent storage for backups:

```bash
flyctl volumes create rental_tracker_data --region iad --size 1
```

**Note:** Change `iad` to match the region you selected in Step 2.

### Step 4: Deploy Your Application

Now deploy your app:

```bash
flyctl deploy
```

This will:
- Build your Docker image
- Push it to Fly.io
- Deploy your application
- Start your app on the configured port (8080)

### Step 5: Monitor Your Deployment

Check if your app is running:

```bash
flyctl status
```

View logs:

```bash
flyctl logs
```

Open your app in a browser:

```bash
flyctl open
```

## Common Commands

- **View app status:** `flyctl status`
- **View logs:** `flyctl logs`
- **View logs (follow/live):** `flyctl logs -f`
- **SSH into your app:** `flyctl ssh console`
- **Scale your app:** `flyctl scale count 2` (run 2 instances)
- **Update secrets:** `flyctl secrets set KEY=value`
- **List secrets:** `flyctl secrets list`
- **Deploy changes:** `flyctl deploy`

## Troubleshooting

### App won't start
Check logs for errors:
```bash
flyctl logs
```

### Environment variables not set
Verify secrets are configured:
```bash
flyctl secrets list
```

### Database connection issues
Make sure your Supabase URL and keys are correct:
```bash
flyctl secrets set VITE_SUPABASE_URL="your-url"
flyctl secrets set VITE_SUPABASE_ANON_KEY="your-key"
```

### Memory issues
Increase memory allocation in `fly.toml`:
```toml
[[vm]]
  memory = '2gb'  # Changed from 1gb
```

Then redeploy:
```bash
flyctl deploy
```

## Scaling and Performance

### Auto-stop/start
Your app is configured to keep at least 1 machine running at all times:
```toml
auto_stop_machines = 'off'
auto_start_machines = true
min_machines_running = 1
```

### Scaling up
To handle more traffic:
```bash
flyctl scale count 2  # Run 2 instances
flyctl scale memory 2048  # Increase memory to 2GB
```

## Costs

Fly.io offers a free tier that includes:
- 3 shared-cpu-1x VMs with 256MB RAM each
- 3GB persistent volume storage
- 160GB outbound data transfer

Your current configuration uses:
- 1 VM with 1GB RAM (may require paid plan)
- 1GB persistent volume

Check current pricing at: https://fly.io/docs/about/pricing/

## Additional Resources

- **Fly.io Documentation:** https://fly.io/docs/
- **Fly.io Status:** https://status.flyio.net/
- **Fly.io Community:** https://community.fly.io/

## Next Steps After Deployment

1. Test all features of your app
2. Set up custom domain (optional): `flyctl certs add yourdomain.com`
3. Configure automatic deployments from GitHub (optional)
4. Set up monitoring and alerts
5. Test backup functionality (check `/app/backups` via SSH)

---

**Your app URL will be:** `https://rental-tracker-pro.fly.dev` (or your custom app name)
