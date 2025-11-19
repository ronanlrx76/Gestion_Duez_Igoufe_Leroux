from django.urls import path
from .views import LoginView, RootView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', RootView.as_view(), name='root')
]
