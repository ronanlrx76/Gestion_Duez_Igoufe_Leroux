from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock

LOGIN_URL = "/api/login/"

class LoginViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.valid_login_data = {
            "mail": "jean.dupont@example.com",
            "mdp": "securepassword123"
        }

        self.invalid_login_data = {
            "mail": "",
            "mdp": ""
        }

    @patch("api.views.auth.loginView.UserProfileSerializer")
    @patch("api.services.authService.AuthService.generate_tokens")
    @patch("api.services.authService.AuthService.authenticate_user")
    def test_login_success(
        self,
        mock_authenticate,
        mock_generate_tokens,
        mock_user_serializer
    ):
        mock_user = MagicMock()
        mock_authenticate.return_value = mock_user

        mock_generate_tokens.return_value = {
            "access": "fake-access-token",
            "refresh": "fake-refresh-token"
        }

        # ⚠️ serializer.data DOIT être un dict réel
        serializer_instance = MagicMock()
        serializer_instance.data = {
            "id": 1,
            "nom": "Dupont",
            "prenom": "Jean"
        }
        serializer_instance.is_valid.return_value = True

        mock_user_serializer.return_value = serializer_instance

        response = self.client.post(LOGIN_URL, self.valid_login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)


    @patch("api.services.authService.AuthService.authenticate_user")
    def test_login_invalid_credentials(self, mock_authenticate):
        mock_authenticate.return_value = None

        response = self.client.post(LOGIN_URL, self.valid_login_data, format="json")

        self.assertIn(
            response.status_code,
            [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED]
        )
        self.assertIn("email", str(response.data).lower())
        self.assertIn("mot de passe", str(response.data).lower())

    def test_login_missing_params(self):
        response = self.client.post(LOGIN_URL, self.invalid_login_data, format="json")

        self.assertIn(
            response.status_code,
            [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY]
        )
        self.assertIn("paramètres", str(response.data).lower())
