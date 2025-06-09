from django.urls import path
from authenticationApp import views

urlpatterns = [
    path('authentication/register/', views.registerUser),
    path('authentication/login/', views.loginUser),
    path('authentication/user/', views.userView),
    path('authentication/logout/', views.logoutView),
    path('authentication/getaccounts/', views.all_users),
    path('authentication/deleteuser/<int:user_id>/', views.delete_user),
    path('authentication/modifyuser/<int:user_id>/', views.modify_user)
]