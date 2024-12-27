import json
from locust import HttpUser, TaskSet, task, between


class JWTUserBehavior(TaskSet):
    def on_start(self):
        self.login()

    def login(self):
        response = self.client.post(
            "/api/token/", json={"username": "admin", "password": "testing321"}
        )

        if response.status_code == 200:
            self.access_token = response.json().get("access")
            self.refresh_token = response.json().get("refresh")
        else:
            self.access_token = None
            print("Logowanie zakończone niepowodzeniem")

    def refresh_token_method(self):
        if self.refresh_token:
            response = self.client.post(
                "/api/token/refresh/", json={"refresh": self.refresh_token}
            )
            if response.status_code == 200:
                self.access_token = response.json().get("access")
                print("Token odświeżony pomyślnie.")
            else:
                print("Nie udało się odświeżyć tokenu.")
        else:
            print("Brak refresh tokenu")

    @task(1)
    def get_protected_resource(self):
        if not self.access_token:
            print("Brak tokenu aby wykoknać żadanie do /api/movies/")
            return

        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        response = self.client.get("/api/movies/", headers=headers)

        if response.status_code == 401:
            print("Token przedawniony, następuje próba odświeżenia...")
            self.refresh_token_method()

            if self.access_token:
                headers = {"Authorization": f"Bearer {self.access_token}"}
                response = self.client.get("/api/movies/", headers=headers)

        if response.status_code != 200:
            print(f"Żądanie zakończone niepowodzeniem: {response.status_code} - {response.text}")
        else:
            print("Pomyślnie wykonano żadanie do chronionego zasobu")

class JWTUser(HttpUser):
    tasks = [JWTUserBehavior]
    host = "http://localhost:8000"
    wait_time = between(1, 5)
