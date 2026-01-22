# Quick Start Guide - Agrovolokno Backend

## 🚀 Getting Started in 5 Minutes

### Step 1: Install PostgreSQL

**Windows**:
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember your postgres password

**macOS**:
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE agro_db;

# Exit
\q
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# Update DB_PASSWORD with your postgres password
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Start the Server

```bash
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:3001/api
```

### Step 6: Test the API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Welcome message
curl http://localhost:3001/api
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-12T...",
  "uptime": 5.123,
  "environment": "development"
}
```

## 🎯 What's Next?

### For Development:
1. **Implement Auth Module**: `nest g module auth`
2. **Implement Users Module**: `nest g module users`
3. **Implement Categories Module**: `nest g module categories`
4. **Implement Products Module**: `nest g module products`

### For Testing:
```bash
# Run tests
npm run test

# Run with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### For Production:
```bash
# Build
npm run build

# Start production server
npm run start:prod
```

## 📚 Useful Commands

### NestJS CLI Commands

```bash
# Generate a new module
nest g module <module-name>

# Generate a controller
nest g controller <controller-name>

# Generate a service
nest g service <service-name>

# Generate a complete resource (CRUD)
nest g resource <resource-name>
```

### Database Commands

```bash
# Check database connection
psql -U postgres -d agro_db -c "SELECT version();"

# List all tables
psql -U postgres -d agro_db -c "\dt"

# Drop database (careful!)
psql -U postgres -c "DROP DATABASE agro_db;"
```

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: 
1. Check if PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env`
3. Check if database exists: `psql -U postgres -l`

### Issue: "Port 3001 already in use"
**Solution**: 
1. Change PORT in `.env` to another port (e.g., 3002)
2. Or kill the process using port 3001

### Issue: "Module not found"
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "TypeORM synchronize not working"
**Solution**: 
1. Ensure `DB_SYNCHRONIZE=true` in `.env`
2. Check entity files have `.entity.ts` extension
3. Restart the server

## 📖 Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **Full Setup**: See `README_SETUP.md`
- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io

## 🆘 Need Help?

1. Check the logs in the terminal
2. Review the documentation files
3. Check NestJS documentation
4. Contact the development team

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `agro_db` created
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts successfully (`npm run start:dev`)
- [ ] Health check endpoint works
- [ ] Ready to implement modules!

## 🎉 Success!

If you've completed all steps and the server is running, you're ready to start building the API modules!

Next recommended steps:
1. Read `ARCHITECTURE.md` to understand the project structure
2. Implement the Authentication module
3. Create the Users module with admin seeding
4. Build out the remaining modules

Happy coding! 🚀

