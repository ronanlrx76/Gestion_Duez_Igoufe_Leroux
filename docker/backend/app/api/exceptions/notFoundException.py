from rest_framework import status
from rest_framework.exceptions import APIException

class NotFoundException(APIException):
    """
    Docstring for NotFoundException
    """
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "Ressource non trouvée"
    default_code = 'Ressource non trouvée'
