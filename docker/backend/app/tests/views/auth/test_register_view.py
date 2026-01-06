from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from api.models import Utilisateur, Role
from unittest.mock import MagicMock


REGISTER_URL = "/api/register/"

class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        mock_role = MagicMock(spec=Role)
        mock_role.id_role = 1
        mock_role.libelle_role = "Utilisateur"
        mock_role.emprunt_max = 5
        self.valid_user_data = {
            "nom": "Dupont",
            "prenom": "Jean",
            "email": "jean.dupont@example.com",
            "password": "securepassword123",
            "date_naissance": "1990-01-01",
            "id_role": self.role.id_role
        }
        self.invalid_user_data = {
            "nom": "Dupont",
            "prenom": "Jean",
            "email": "",  # email manquant
            "password": "",  # mot de passe manquant
            "date_naissance": "1990-01-01",
            "id_role": self.role.id_role
        }

    @patch("api.services.authService.AuthService.register_user")
    def test_register_success(self, mock_register):
        # Crée un vrai utilisateur dans le test, mais sans toucher la DB
        mock_user = Utilisateur(
            id_utilisateur=1,
            nom=self.valid_user_data["nom"],
            prenom=self.valid_user_data["prenom"],
            date_naissance=self.valid_user_data["date_naissance"],
            id_role=self.role
        )
        mock_register.return_value = mock_user

        response = self.client.post(REGISTER_URL, self.valid_user_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Utilisateur créé")
        self.assertEqual(response.data["data"]["nom"], self.valid_user_data["nom"])

    @patch("api.services.authService.AuthService.register_user")
    def test_register_email_exists(self, mock_register):
        mock_register.return_value = None  # Email déjà utilisé
        response = self.client.post(REGISTER_URL, self.valid_user_data, format="json")
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_409_CONFLICT])
        self.assertIn("Email déjà utilisé", str(response.data))

    def test_register_missing_params(self):
        response = self.client.post(REGISTER_URL, self.invalid_user_data, format="json")
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY])
        self.assertIn("Les paramètres", str(response.data))
