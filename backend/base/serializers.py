from rest_framework import serializers
from django.contrib.auth.models import User # Django authentication system
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only = True)
    _id  = serializers.SerializerMethodField(read_only = True)
    isAdmin  = serializers.SerializerMethodField(read_only = True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get__id(self, obj):
        return obj.id

    def get_name(self, obj):
        name = obj.firstName
        if name == '':
            name = obj.email

        return name

class userSerializerWithToken(UserSerializer): #folosim aceasta clasa pentru a serializa noul token in cazul in care userul isi face update la datele de profil de exemplu
    token = serializers.SerializerMethodField(read_only = True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__' #returneaza tot