from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

from .models import Movie


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class MovieSerializer(ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title"]
