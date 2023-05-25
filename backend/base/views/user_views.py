from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.response import Response

from base.products import products
from base.serializers import ProductSerializer, UserSerializer, userSerializerWithToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password #hash passwords

from rest_framework import status #error status message



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = userSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer #serializer class = returneaza datele userului

@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )

        serializer = userSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST) #daca email-ul deja e folosit, returneaza eroare

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user #pentru a avea nevoie sa vedem ce user face update
    serializier = userSerializerWithToken(user, many = False) #many=False, vrem sa ne returneze un singur user, nu o lista
    
    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    if data['password'] != '' :
        user.password = make_password(data['password'])

    user.save() #salvam noile update-uri facute de user

    return Response(serializier.data)  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializier = UserSerializer(user, many = False) #many=False, vrem sa ne returneze un singur user, nu o lista
    return Response(serializier.data)    

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request): #accesul la toti userii din interfata Admin
    users = User.objects.all()
    serializier = UserSerializer(users, many = True) 
    return Response(serializier.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk): #edit user in admin panel
    user = User.objects.get(id=pk)
    serializier = UserSerializer(user, many = False) 
    return Response(serializier.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)
   
    data = request.data
    user.first_name = data['first_name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save() 
    
    serializier = UserSerializer(user, many = False) 
    return Response(serializier.data) #returnam rezultatul catre frontend serializat 

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id = pk)
    userForDeletion.delete()
    return Response('User was deleted!')  
    






   
