from rest_framework import serializers

class RegisterInputSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=50)
    prenom = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    date_naissance = serializers.DateField()
    id_role = serializers.IntegerField()
