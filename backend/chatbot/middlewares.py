from django.http import JsonResponse
import session_middleware

class SessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Liste des URLs non protégées (ex: login, register)
        excluded_paths = ["/receive_password", "/login"]

        # Vérifier si l'URL actuelle nécessite une session active
        if request.path not in excluded_paths:
            if "password" not in request.session:  
                return JsonResponse({"status": "error", "message": "Session expirée, veuillez vous reconnecter"}, status=401)

        return self.get_response(request)
