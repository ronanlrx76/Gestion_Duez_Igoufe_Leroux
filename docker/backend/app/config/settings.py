import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise Exception("SECRET_KEY is missing")

DEBUG = True

ALLOWED_HOSTS = []

# APPS
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api',
    'drf_spectacular'
]

# MIDDLEWARE (obligatoire pour contenttypes, auth, sessions, messages)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

# Templates (Django en a BESOIN même si tu n'utilises pas l'admin)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ROOT_URLCONF = 'config.urls'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get("DB_DATABASE"),
        'USER': 'root',
        'PASSWORD': os.environ.get("DB_PASSWORD"),
        'HOST': os.environ.get('DB_CONTAINER'),
        'PORT': os.environ.get('DB_PORT'),
    }
}

# Django REST
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        'api.config.safeJWTAuthentication.SafeJWTAuthentication',
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    'EXCEPTION_HANDLER': 'api.exceptions.customExceptionHandler.CustomExceptionHandler',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'
}

# Static files
STATIC_URL = "/static/"

# Primary key type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SPECTACULAR_SETTINGS = {
    'TITLE': 'API Bibliothèque',
    'DESCRIPTION': 'Documentation des routes de gestion d\'emprunts',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    # Optionnel : pour que Swagger gère ton JWT
    'COMPONENT_SPLIT_PATCH': True,
}
