from rest_framework import serializers

class LoginInputSerializer(serializers.Serializer):
    mail = serializers.EmailField()
    mdp = serializers.CharField(write_only=True, min_length=8)
