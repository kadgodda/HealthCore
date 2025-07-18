# HealthCore Usage Guide

## Quick Start

Run the application with:
```bash
./start-healthcore.sh
```

**Important**: Do NOT use `source ./start-healthcore.sh` - this will cause issues with background processes.

## If the Script Hangs

If the script hangs at "Waiting for frontend to start...", you can run the services manually:

### Terminal 1 - Backend:
```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Troubleshooting

1. **Script hangs on frontend start**: This usually means the frontend is waiting for user input. Check `frontend.log` for any prompts.

2. **Python not found**: The script will automatically detect `python3` or `python`. If neither works, check your Python installation.

3. **Port already in use**: The script automatically kills processes on ports 8000 and 5173-5175. If issues persist, manually kill the processes:
   ```bash
   lsof -ti:8000 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   ```

4. **CORS errors**: Make sure the backend is running and the frontend URL matches one of the allowed origins in `backend/main.py`.

## URLs

- Frontend: http://localhost:5173 (or 5174/5175 if 5173 is taken)
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs