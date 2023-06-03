from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Review
from base.serializers import ProductSerializer


from rest_framework import status #error status message

@api_view(['GET'])
def getProducts(request):

    query = request.query_params.get('term')
    if query is None:
        query = ''


    products = Product.objects.filter(name__icontains = query) #daca unul din termenii din searchbarch contine (nu e case sensitive) query-ul returneaza atunci produsele respective
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

@api_view(['POST'])
#@permission_classes([IsAdminUser])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image') #noua imagine va fi setata produsului dupa care adaugam imaginea in static files
    product.save()

    return Response('Image was uploaded!')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    data = request.data
    user = request.user
    product = Product.objects.get(_id = pk)
    

    # 1 - Review-ul deja exista

    alreadyExists = product.review_set.filter(user=user).exists() #returneaza True daca exista deja review sau False daca nu exista
    #review_set returneaza un set de interogari (query set) prin care trecem

    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status = status.HTTP_400_BAD_REQUEST)
    
    # 2 - Userul nu returneaza rating

    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status = status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(

                user = user,
                product = product,
                name = user.first_name, #numele in format string al userului ( de exemplu daca userul isi sterge contul dintr-un motiv anume, dorim ca in review sa ramana numele userului, altfel retuneaza no value )
                rating = data['rating'],
                comment = data['comment'],

            )
    
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total_rating = 0
        for i in reviews:
            total_rating += i.rating

        product.rating = total_rating / len(reviews)
        product.save()

        return Response('Review added')