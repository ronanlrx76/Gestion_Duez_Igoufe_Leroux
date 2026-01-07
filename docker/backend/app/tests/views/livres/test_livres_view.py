from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock

LIVRES_URL = "/livres/"


class LivreViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        # User mock
        self.user = MagicMock()
        self.user.id_utilisateur = 1
        self.user.is_authenticated = True
        self.user.is_admin = True  # IMPORTANT pour POST / DELETE

        self.client.force_authenticate(user=self.user)

    # =========================
    # GET /livres/
    # =========================
    @patch("api.views.livre.livreView.BookService.get_all_livres")
    def test_get_livres_success(self, mock_get_all):
        livre_mock = MagicMock()
        livre_mock.id_livre = 1
        livre_mock.titre = "Livre test"
        livre_mock.id_auteur_id = 1
        livre_mock.emplacement_image_couverture = None

        mock_get_all.return_value = [livre_mock]

        response = self.client.get(LIVRES_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertIsInstance(response.data["data"], list)

    # =========================
    # POST /livres/
    # =========================
    @patch("api.views.livre.livreView.IsAdminUserRole.has_permission", return_value=True)
    @patch("api.views.livre.livreView.BookService.create_livre")
    def test_post_livre_success(self, mock_create, mock_permission):
        livre_mock = MagicMock()
        livre_mock.id_livre = 1
        livre_mock.titre = "Livre test"
        livre_mock.id_auteur_id = 1
        livre_mock.emplacement_image_couverture = None

        mock_create.return_value = livre_mock

        response = self.client.post(
            LIVRES_URL,
            data={
                "titre": "Livre test",
                "id_auteur": 1
            }
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")

    def test_post_livre_missing_params(self):
        response = self.client.post(LIVRES_URL, data={})

        self.assertIn(
            response.status_code,
            [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY]
        )

    # =========================
    # DELETE /livres/{id}/
    # =========================
    @patch("api.views.livre.livreView.IsAdminUserRole.has_permission", return_value=True)
    @patch("api.views.livre.livreView.BookService.delete_livre")
    def test_delete_livre_success(self, mock_delete, mock_permission):
        mock_delete.return_value = True

        response = self.client.delete("/livres/1/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch("api.views.livre.livreView.IsAdminUserRole.has_permission", return_value=True)
    @patch("api.views.livre.livreView.BookService.delete_livre")
    def test_delete_livre_not_found(self, mock_delete, mock_permission):
        mock_delete.return_value = False

        response = self.client.delete("/livres/999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_livre_missing_id(self):
        response = self.client.delete(LIVRES_URL)

        self.assertIn(
            response.status_code,
            [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY]
        )
