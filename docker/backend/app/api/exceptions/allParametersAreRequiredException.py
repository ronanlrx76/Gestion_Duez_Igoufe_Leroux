from rest_framework.exceptions import APIException
from rest_framework import status

class AllParametersAreRequiredException(APIException):
    """ Exception levée quand tous les paramètres pour une route ne sont pas dans le body ou sont null. """
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Tous les paramètres sont requis."
    )
    default_code = "missing_parameters"
