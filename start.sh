#!/bin/bash
pip install -r requirements.txt

python manage.py collectstatic --no-input


# Activate the virtual environment
source .venv/bin/activate

gunicorn blackwilbur.wsgi:application --bind 0.0.0.0:8000

