import os
import subprocess

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vres.settings")

subprocess.call(["python", "manage.py", "runserver", "0.0.0.0:8000"])