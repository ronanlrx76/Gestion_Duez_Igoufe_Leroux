from rest_framework import status
from rest_framework.exceptions import APIException

class InvalidEmailOrPasswordException(APIException):
    """
    Docstring for InvalidEmailOrPasswordException
    """
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Email ou mot de passe incorrect."
    default_code = 'authentication_failed'
