from pathlib import Path
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

APPEND_SLASH = False

ALLOWED_HOSTS = ['api.blackwilbur.com','145.223.22.231','blackwilbur.com', 'localhost', '127.0.0.1','mercury-uat.phonepe.com']
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework_simplejwt',
    'rest_framework',  
    'corsheaders',
    'blackwilbur',
    ]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}


from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
AUTH_USER_MODEL = 'blackwilbur.User' 

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://blackwilbur.com",
    "http://blackwilbur.com",
    'https://mercury-uat.phonepe.com',
    'http://127.0.0.1:5000',  # Your local frontend URL
]
CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'blackwilbur.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates', 
        ],
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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'blackwilbur',
        'USER': 'blackwilbur_user',
        'PASSWORD': 'root',
        'HOST': '145.223.22.231',
        'PORT': '3306',
    }
}

WSGI_APPLICATION = 'blackwilbur.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# In Django settings.py or middleware
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = '/static/'  # URL prefix for static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Change 'staticfiles' to your desired directory

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Razorpay Settings
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_CcaiEoRcHpwLa5')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '56CQ6JtFime5odK2A4Vb7L1O')
RAZORPAY_CURRENCY = 'INR'