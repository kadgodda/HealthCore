# Body Systems Nutrition Tracker

A mobile-optimized web app for tracking daily nutrition goals based on body systems using Python, FastAPI, and HTMX.

## Features

- **Daily Mission Checklist**: Track food targets for different body systems (Monday = Cardiovascular, Tuesday = Liver/Detox, etc.)
- **Cannabis Session Tracking**: Automatically calculates "buffer foods" needed based on cannabis consumption
- **Smart Shopping List Generator**: Auto-generate weekly grocery lists organized for easy Instacart ordering
- **Progressive Web App**: Install on your phone for offline access
- **Mobile-First Design**: Optimized for one-handed use on smartphones

## Tech Stack

- **Backend**: FastAPI (Python web framework)
- **Frontend**: Jinja2 templates + HTMX (dynamic interactions without JavaScript)
- **Database**: SQLite with SQLAlchemy ORM
- **Styling**: Tailwind CSS (mobile-first responsive design)
- **Icons**: Lucide icons

## Installation

1. Clone the repository:
```bash
cd nutrition-tracker
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python run.py
```

5. Open your browser to http://localhost:8000

## Usage

### Daily Mission

- The app automatically shows today's body system focus
- Tap + or - buttons to track food servings consumed
- Log cannabis sessions to see recommended buffer foods
- Track your energy, focus, and mood throughout the day

### Shopping List

- Navigate to the shopping list via the cart icon
- View all items needed for the week, organized by category
- Export list for Instacart or copy to clipboard
- Adjust household size and cannabis consumption for accurate quantities

### Body Systems Schedule

- **Monday**: Cardiovascular Power (beets, omega-3s, potassium)
- **Tuesday**: Detox & Liver (cruciferous veggies, sulfur foods, bitters)
- **Wednesday**: Immune Defense (vitamin C, zinc, probiotics)
- **Thursday**: Brain & Cognitive (DHA, antioxidants, choline)
- **Friday**: Gut Health (fermented foods, prebiotics, bone broth)
- **Saturday**: Cellular Energy (CoQ10, B-vitamins, magnesium)
- **Sunday**: Hormone Balance (healthy fats, adaptogens, selenium)

## Development

The app is structured as follows:

```
nutrition-tracker/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── database.py          # Database configuration
│   ├── data/
│   │   └── body_systems.py  # Body systems data
│   ├── templates/           # HTML templates
│   └── static/             # Static files (PWA manifest, service worker)
├── requirements.txt
└── run.py
```

### Adding New Features

1. **New Body System Targets**: Edit `app/data/body_systems.py`
2. **New Routes**: Add to `app/main.py` or create new router files
3. **New Templates**: Add to `app/templates/` directory
4. **Database Changes**: Update models in `app/models.py`

## Deployment

The app can be deployed to:

- **Railway**: Add a `railway.json` with start command
- **Render**: Add a `render.yaml` configuration
- **Heroku**: Add a `Procfile` with `web: uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Mobile Installation

1. Open the app in your mobile browser
2. For iOS: Tap Share → Add to Home Screen
3. For Android: Tap menu → Add to Home Screen

The app will work offline for viewing (requires connection for updates).

## License

MIT