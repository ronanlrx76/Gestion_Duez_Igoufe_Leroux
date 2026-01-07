from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock

AUTEURS_URL = "/api/authors/"
AUTEUR_DETAIL_URL = lambda id: f"/api/authors/{id}"

class AuteurViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # 🔹 Mock Role
        mock_role = MagicMock()
        mock_role.libelle_role = "Administrateur"

        # 🔹 Mock User
        mock_user = MagicMock()
        mock_user.is_authenticated = True
        mock_user.id_user = MagicMock()  # la permission regarde id_user
        mock_user.id_user.id_role = mock_role

        # 🔹 Force authentification du client avec le mock user
        self.client.force_authenticate(user=mock_user)

        self.valid_auteur_data = {"nom": "Hugo", "prenom": "Victor"}
        self.invalid_auteur_data = {"nom": "", "prenom": ""}
        self.auteur_id = 1


    # -------- GET auteurs --------
    @patch("api.services.AuthorService.get_all_auteurs")
    @patch("api.serializers.AuteurSerializer")
    def test_get_auteurs_success(self, mock_serializer, mock_service):
        mock_auteurs = [MagicMock(nom="Hugo", prenom="Victor")]
        mock_service.return_value = mock_auteurs

        serializer_instance = MagicMock()
        # renvoyer uniquement nom/prenom pour matcher l'assertion
        serializer_instance.data = [{"nom": "Hugo", "prenom": "Victor"}]
        mock_serializer.return_value = serializer_instance

        response = self.client.get(AUTEURS_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "succes")
        self.assertEqual(response.data["data"], [{'id_auteur': 1, 'nom': 'Hugo', 'prenom': 'Victor'}])

    # -------- POST auteur --------
    @patch("api.services.AuthorService.create_auteur")
    @patch("api.serializers.AuteurSerializer")
    def test_post_auteur_success(self, mock_serializer, mock_service):
        mock_auteur = MagicMock(nom="Hugo", prenom="Victor")
        mock_service.return_value = mock_auteur

        serializer_instance = MagicMock()
        serializer_instance.is_valid.return_value = True
        serializer_instance.validated_data = self.valid_auteur_data
        serializer_instance.data = self.valid_auteur_data
        mock_serializer.return_value = serializer_instance

        response = self.client.post(AUTEURS_URL, self.valid_auteur_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["data"], {'id_auteur': 1, 'nom': 'Hugo', 'prenom': 'Victor'})

    @patch("api.serializers.AuteurSerializer")
    def test_post_auteur_missing_params(self, mock_serializer):
        serializer_instance = MagicMock()
        serializer_instance.is_valid.return_value = False
        mock_serializer.return_value = serializer_instance

        response = self.client.post(AUTEURS_URL, self.invalid_auteur_data, format="json")

        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY])
        self.assertIn("paramètres", str(response.data).lower())

    # -------- DELETE auteur --------
    @patch("api.services.AuthorService.delete_auteur")
    def test_delete_auteur_success(self, mock_delete):
        mock_delete.return_value = True
        response = self.client.delete(AUTEUR_DETAIL_URL(self.auteur_id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch("api.services.AuthorService.delete_auteur")
    def test_delete_auteur_not_found(self, mock_delete):
        mock_delete.return_value = False
        response = self.client.delete(AUTEUR_DETAIL_URL(self.auteur_id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch("api.services.AuthorService.delete_auteur")
    def test_delete_auteur_missing_id(self, mock_delete):
        mock_delete.side_effect = ValueError("ID manquant")
        response = self.client.delete(AUTEURS_URL)
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY])
