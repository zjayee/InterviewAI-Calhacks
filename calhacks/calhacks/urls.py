"""
URL configuration for calhacks project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('', views.hello_world, name='hello_world'),
    path('db_test', view=views.test_db, name='test_db'),
    path('create_session', view=views.start_session, name='start_session'),
    path('interview_loop', view=views.interview_loop, name='interview_loop'),
    path('get_summary', view=views.get_summary, name='get_summary'),
    path('start_interview', view=views.start_interview, name='start_interview'),
    path('get_transcript', view=views.get_transcript, name='get_transcript'),
]
