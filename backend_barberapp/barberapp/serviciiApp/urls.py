from django.urls import path
from serviciiApp import views

urlpatterns = [
    path('servicii/', views.all_servicii),
    path('servicii/<int:serviciu_id>/', views.delete_serviciu),
    path('add_serviciu/', views.add_serviciu),
    path('modify_serviciu/<int:serviciu_id>/', views.modify_serviciu),
]