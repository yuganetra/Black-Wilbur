#!/bin/bash
pip install -r requirements.txt

python manage.py collectstatic --no-input

python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

