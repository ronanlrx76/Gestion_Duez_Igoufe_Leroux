from rest_framework import status
from rest_framework.exceptions import APIException

class EmailAlreadyExistsException(APIException):
    """Exception levée quand l'email est déjà utilisé."""
    status_code = status.HTTP_409_CONFLICT 
    default_detail = "Cet email est déjà utilisé par un autre compte."
    default_code = 'email_already_exists'
