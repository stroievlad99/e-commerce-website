from rest_framework import serializers
from django.contrib.auth.models import User # Django authentication system
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Order, OrderItem, ShippingAddress, Review


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
        name = obj.first_name
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
    
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__' #returneaza tot

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = Product
        fields = '__all__' #returneaza tot

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data
    

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'        

class OrderSerializer(serializers.ModelSerializer):
    #trebuie sa imbricam toate datele 
    orderItems = serializers.SerializerMethodField(read_only = True)
    shippingAddress = serializers.SerializerMethodField(read_only = True)
    user = serializers.SerializerMethodField(read_only = True)

    class Meta:
        model = Order
        fields = '__all__'   

    def get_orderItems(self,obj):
        items = obj.orderitem_set.all() #obține toate obiectele OrderItem asociate obiectului Order
        serializer = OrderItemSerializer(items, many = True)
        return serializer.data
    
    def get_shippingAddress(self,obj):
        try:
            address = ShippingAddressSerializer(obj.shippingaddress, many = False).data
        except:
            address = False
        return address
    
    def get_user(self,obj):
        user = obj.user
        serializer = UserSerializer(user, many = False)
        return serializer.data  