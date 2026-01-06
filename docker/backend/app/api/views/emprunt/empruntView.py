from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from ...exceptions import AllParametersAreRequiredException, NotFoundException
from ...serializers import EmpruntSerializer
from ...services import EmpruntService
from ...responses import Responses
from ...config import IsAdminUserRole

class EmpruntView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET' or self.request.method == 'POST':
            return [IsAuthenticated()] # Tout utilisateur connecté
        return [IsAuthenticated(), IsAdminUserRole()] # Admin seulement pour le reste

    def post(self, request):
        # recup user_id dans token JWT
        data = request.data.copy()
        data['id_utilisateur'] = request.user.id_utilisateur
        
        serializer = EmpruntSerializer(data=data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException()

        emprunt = EmpruntService.creer_emprunt(serializer.validated_data)
        if emprunt is None:
            raise NotFoundException("Aucun livre disponible")
        
        return Responses.StandardResponse("success", "Livre emprunté avec succès", EmpruntSerializer(emprunt).data, status.HTTP_201_CREATED)
    
    def get(self, request):
        user_id = request.user.id_utilisateur
        emprunts = EmpruntService.get_emprunts_utilisateur(user_id)
        serializer = EmpruntSerializer(emprunts, many=True)
        
        return Responses.StandardResponse(
            "success", 
            "OK", 
            serializer.data, 
            status.HTTP_200_OK
        )
    
    def delete(self, request, id=None):
        if not id:
            raise AllParametersAreRequiredException("id nécessaire")
        
        success = EmpruntService.retourner_livre(id)
        if success is False:
            raise NotFoundException("Cette référence d'emprunt n'existe pas.")
        
        return Responses.StandardResponse("success", "Livre retourné et historique mis à jour", None, status.HTTP_200_OK)
        

        

