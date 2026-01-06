from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ...exceptions import AllParametersAreRequiredException
from ...responses import Responses
from ...serializers import LivreSerializer
from ...services import BookService
from ...config import IsAdminUserRole

class LivreView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminUserRole()]

    # GET : Liste des livres
    @extend_schema(
        summary="Liste des livres (Paginée)",
        description="Récupère la liste des livres avec support de la recherche par titre et pagination.",
        parameters=[
            OpenApiParameter("title", OpenApiTypes.STR, description="Recherche par titre (partiel)", required=False),
            OpenApiParameter("page", OpenApiTypes.INT, description="Numéro de la page", required=False),
        ],
        responses={200: OpenApiTypes.OBJECT} # On peut aussi définir un Serializer spécifique pour la pagination
    )
    def get(self, request):
        titre_search = request.query_params.get('title')
        
        # Le service filtre la base de données
        livres = BookService.get_all_livres(titre=titre_search)

        paginator = PageNumberPagination()
        paginator.page_size = 25
        result_page = paginator.paginate_queryset(livres, request)

        serializer = LivreSerializer(result_page, many=True)
        data = {
            "count": paginator.page.paginator.count,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
            "results": serializer.data
        }
        return Responses.StandardResponse("success", "OK", data, status.HTTP_200_OK)

    # POST : Ajouter un livre
    @extend_schema(
        summary="=> Admin | Ajouter un livre",
        description="Crée une nouvelle entrée de livre dans la base. Réservé aux administrateurs.",
        request=LivreSerializer,
        responses={201: LivreSerializer}
    )
    def post(self, request):
        serializer = LivreSerializer(data=request.data)
        if not serializer.is_valid():
            raise AllParametersAreRequiredException("Titre et id_auteur sont requis")
        
        livre = BookService.create_livre(serializer.validated_data)
        return Responses.StandardResponse("success", "Livre ajouté", LivreSerializer(livre).data, status.HTTP_201_CREATED)
