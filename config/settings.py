INSTALLED_APPS = [
    'rest_framework',
    'api'
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'nom_de_ta_bd',
        'USER': 'ton_user',
        'PASSWORD': 'ton_mdp',
        'HOST': 'localhost',  
        'PORT': '3306',
    }
}

DEBUG = True  # sécurité activée pour prod
ALLOWED_HOSTS = []  # liste des hôtes autorisés

ROOT_URLCONF = 'config.urls'
