from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product
from base.serializers import ProductSerializer


from rest_framework import status #error status message

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializier = ProductSerializer(products, many = True) #many=True, deoarece vrem sa serializam mai multe obiecte
    return Response(serializier.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id = pk)
    serializier = ProductSerializer(product, many = False) #many=False, deoarece vrem sa serializam un singur produs
    return Response(serializier.data)
# metoda veche (cand aveam date statice)
#    product = None
#   for i in products:
#        if i['_id'] == pk:
#            product = i
#            break
#    return Response(product)

@api_view(['POST']) #aici se creeaza un sample product si avem nevoie si de urmatorul view de update pentru a updata obiectul sample proaspat creat
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user #avem nevoie de user sa stim ce admin a creat produsul respectiv

    product = Product.objects.create(
            user = user,
            name='Sample name',
            price=0,
            brand='Sample Brand',
            countInStock=0,
            category='Sample category',
            description=''
        )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT']) 
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data #luam datele pentru a avea la ce face update
    product = Product.objects.get(_id=pk) #luam produsul pe care vrem sa-l updatam

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False) #serializam noile informatii updatate
    return Response(serializer.data) #trimitem catre frontend


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    productForDeletion = Product.objects.get(_id = pk)
    productForDeletion.delete()
    return Response('Product deleted!')  