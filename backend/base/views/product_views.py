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