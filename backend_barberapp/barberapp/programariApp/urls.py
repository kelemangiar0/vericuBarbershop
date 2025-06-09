from django.urls import path
from programariApp import views

urlpatterns = [
    path('programari/', views.all_programari),
    path('programari/user/<int:user_id>/', views.programari_for_user),
    path('programari/faprogramare/', views.make_programare),
    path('programari/delete/<int:programare_id>/', views.delete_programare),
    path('programlucru/', views.getProgramLucru),
    path('programlucru/insert/', views.insertProgramLucru),
    path('get-working-hours/', views.get_working_hours),
    path('programari/deleteAllProgramari/<str:data>/', views.deleteAllFromProgramari),
    path('programlucru/delete/<str:zi>/', views.deleteFromProgramLucru)
]