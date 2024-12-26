from django.urls import path

from .views import LogoutView, MovieListView, UserRegisterView

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="user-register"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("movies/", MovieListView.as_view(), name="movie-list"),
]