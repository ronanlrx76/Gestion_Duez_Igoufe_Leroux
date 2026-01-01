from rest_framework.exceptions import APIException

class AllParametersAreRequiredException(APIException):
    """ Exception levée quand tous les paramètres pour une route ne sont pas dans le body ou sont null. """
    pass
