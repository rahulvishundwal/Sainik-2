# 🚀 Deployment Guide for Render

## Step-by-Step Deployment Instructions

### 📋 Prerequisites
- GitHub account with your repository
- Render account (free tier works)
- MySQL database on Render

---

## 1️⃣ Setup MySQL Database on Render

### Create Database:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"** or **"MySQL"** (if available)
3. Fill in:
   - **Name**: `sainik-defense-db`
   - **Database**: `sainik_defense`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: Free tier
4. Click **"Create Database"**
5. Wait for database to provision (2-3 minutes)

### Get Database Credentials:
1. Once created, go to database **"Info"** tab
2. Copy these values:
   - **Hostname** (Internal Database URL)
   - **Port** (usually 3306)
   - **Database Name**
   - **Username**
   - **Password**

---

## 2️⃣ Run Database Schema

### Option A: Using Render Shell
1. Go to your database dashboard
2. Click **"Shell"** tab
3. Copy and paste the entire `database-schema.sql` content
4. Press Enter to execute

### Option B: Using MySQL Client
```bash
mysql -h your-host -u your-user -p your-database < database-schema.sql
```

### Verify Tables Created:
```sql
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM news;
```

---

## 3️⃣ Deploy Web Service on Render

### Create Web Service:
1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Sainik_defense_college`
4. Fill in settings:
   - **Name**: `sainik-defense-college`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier

---

## 4️⃣ Set Environment Variables

### In Render Web Service Settings:
Go to **"Environment"** tab and add these variables:

```env
DB_HOST=your-mysql-hostname-from-step-1
DB_PORT=3306
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=sainik_defense
DB_SSL=true
JWT_SECRET=your-super-secret-random-key-12345
NODE_ENV=production
```

**Important**: 
- Replace all `your-xxx` values with actual credentials from Step 1
- For `JWT_SECRET`, generate a random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## 5️⃣ Deploy!

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repo
   - Run `npm install`
   - Start the server
3. Wait 3-5 minutes for first deployment
4. Check **"Logs"** tab for any errors

---

## 6️⃣ Access Your Site

### Your site will be live at:
```
https://sainik-defense-college.onrender.com
```

### Default Admin Login:
```
Email: admin@sainikdefense.com
Password: admin123
```

**⚠️ IMPORTANT**: Change this password immediately after first login!

---

## 7️⃣ File Structure for GitHub

Make sure your repository has this structure:

```
Sainik_defense_college/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── server.js
├── package.json
├── database-schema.sql
├── .gitignore
├── .env.example
└── README.md
```

---

## 8️⃣ Update GitHub Repository

### Upload/Update these files:

1. **server.js** ✅ (updated with MySQL + PUT endpoint)
2. **package.json** ✅ (removed "type": "module")
3. **public/js/app.js** ✅ (fixed admin dashboard)
4. **public/css/style.css** ✅ (improved styling)
5. **public/index.html** ✅ (removed static navbar)
6. **database-schema.sql** ✅ (NEW - MySQL schema)
7. **.env.example** ✅ (NEW - environment template)
8. **DEPLOYMENT_GUIDE.md** ✅ (this file)

### Commit and Push:
```bash
git add .
git commit -m "Fixed admin panel and added MySQL support"
git push origin main
```

Render will auto-deploy after push!

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: 
- Check environment variables are correct
- Ensure DB_HOST uses **internal hostname** from Render
- Verify database is in same region as web service

### Issue: "Admin login not working"
**Solution**:
- Check database schema was run successfully
- Verify users table exists: `SELECT * FROM users;`
- Password hash might be wrong - regenerate it:
  ```javascript
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('admin123', 10);
  console.log(hash);
  ```

### Issue: "News not showing after login"
**Solution**:
- Clear browser cache and localStorage
- Check browser console for errors (F12)
- Verify JWT_SECRET is set in environment variables

### Issue: "Static files not loading (CSS/JS)"
**Solution**:
- Ensure folder structure is: `public/css/` and `public/js/`
- Check server.js has: `app.use(express.static('public'))`

---

## 📱 Testing Checklist

After deployment, test these:

- [ ] Public home page loads
- [ ] News bulletin shows on home page
- [ ] Admin login works
- [ ] Admin can create news
- [ ] Admin can edit news
- [ ] Admin can delete news
- [ ] Logout works
- [ ] Mobile responsive design works

---

## 🔒 Security Recommendations

### After First Deployment:

1. **Change default admin password**:
   ```sql
   UPDATE users SET password = '$2a$10$NEWHASH' WHERE email = 'admin@sainikdefense.com';
   ```

2. **Generate strong JWT_SECRET**:
   - Use: `openssl rand -base64 32`
   - Update in Render environment variables

3. **Enable HTTPS only** (Render does this automatically)

4. **Add rate limiting** (optional for production)

---

## 📞 Support

If you encounter issues:
1. Check Render **Logs** tab
2. Check browser **Console** (F12)
3. Verify all environment variables are set
4. Ensure database schema was run successfully

---

**Made with ❤️ by Rahul Web Solutions**

Last Updated: February 11, 2026
