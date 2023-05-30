from django.urls import path
from base.views import order_views as views


urlpatterns = [

    path('orderlist/', views.getAdminOrders, name="admin-getAllOrders"),

    path('add/', views.addOrderItems, name="orders-add"),
    path('myorders/', views.getMyOrders, name="my-orders"),
    
    path('<str:pk>/', views.getOrderById, name="user-order"),
    path('<str:pk>/pay/', views.updateOrderToPaid, name="pay"),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name="order-delivered"),
]