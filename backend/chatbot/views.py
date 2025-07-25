import requests
import base64
import json


from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage


@csrf_exempt

def plantid_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée, utilisez POST'}, status=405)

    if 'image' not in request.FILES:
        return JsonResponse({'error': 'Aucune image reçue'}, status=400)

    image = request.FILES['image']
    base64_image = base64.b64encode(image.read()).decode('utf-8')

    API_KEY = "I9j27Txtbjuxcvz4iDVOTxkEWGNwJGBzS4srDJD1KQWEpJWhfq"

    url = "https://api.plant.id/v3/identification"
    headers = {"Content-Type": "application/json"}
    payload = {
        "api_key": API_KEY,
        "images": [f"data:image/jpeg;base64,{base64_image}"],
        "health": "all"
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        if response.status_code not in [200, 201]:
            return JsonResponse({'error': 'Erreur API Plant.id', 'details': response.json()}, status=500)

        result = response.json()
        health_assessment = result.get("result", {}).get("disease", {}).get("suggestions", [])

        if health_assessment:
            traduction = {
                "Nutrient deficiency": "carence en nutriments",
                "Water deficiency": "manque d’eau",
                "Water excess or uneven watering": "excès d’eau",
                "Senescence": "vieillissement naturel",
                "Fungi": "champignons",
                "Bacteria": "bactéries",
                "Viruses": "Viruses",
                "Animalia": "Animalia",
                "Insecta": "Insecta"
            }

            affichage = "🌱 Maladies ou problèmes détectés :\n\n"

            for issue in health_assessment:
                name = issue.get('name', 'Inconnu')
                probability = issue.get('probability', 0) * 100
                translated_name = traduction.get(name, name)
                affichage += f"{name} ({translated_name}) - {probability:.2f}%\n"

            return JsonResponse({'status': 'success', 'report': affichage})

        else:
            return JsonResponse({'status': 'success', 'report': '✅ Aucune maladie détectée.'})

    except Exception as e:
        return JsonResponse({'error': 'Erreur interne', 'details': str(e)}, status=500)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import requests

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import requests


@csrf_exempt
def ask_api_router(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée, utilisez POST'}, status=405)

    try:
        data = json.loads(request.body)
        print("Données reçues :", data)

        question = data.get("question", "")
        if not isinstance(question, str):
            return JsonResponse({'error': 'La question doit être une chaîne de caractères.'}, status=400)

        question = question.lower().strip()

        if not question:
            return JsonResponse({'error': 'Aucune question fournie'}, status=400)

        # ✅ Mots-clés des plantes
        mots_cles_plantes = [
            "plant", "plantes","hi", "maladie", "maladies", "feuille", "feuilles", "racine", "racines",
            "arbre", "arbres", "champ", "champs", "agriculture", "terre", "sol", "vigne",
            "botanique", "engrais", "parasite", "champignon", "pesticide", "culture",
            "insecte", "bactéries", "traitement", "malade", "santé des plantes","tomato"
        ]

        # ❌ Si la question ne contient aucun mot-clé
        if not any(mot in question for mot in mots_cles_plantes):
            return JsonResponse({
                'response': "🌱 Désolé, je ne peux répondre qu’aux questions liées aux plantes. "
                            "Par exemple : 'Comment traiter les feuilles jaunes de mon citronnier ?'"
            })

        # ✅ Envoi à l'API OpenRouter
        API_KEY = "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"
        API_URL = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [{"role": "user", "content": question}]
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        print("Réponse OpenRouter :", response.text)

        response_data = response.json()
        content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "Pas de réponse")

        return JsonResponse({'response': content})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Format JSON invalide'}, status=400)
    except Exception as e:
        print("Erreur serveur :", str(e))
        return JsonResponse({'error': 'Erreur interne', 'details': str(e)}, status=500)
        
import os
import json
import whisper
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

# Charger le modèle Whisper une seule fois
model = whisper.load_model("base")

@csrf_exempt
def ask_api_text(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée, utilisez POST'}, status=405)

    try:
        # Vérifier si un fichier audio est envoyé
        if 'audio' not in request.FILES:
            return JsonResponse({'error': 'Aucun fichier audio fourni'}, status=400)

        audio_file = request.FILES['audio']
        file_path = default_storage.save(f"temp/{audio_file.name}", audio_file)

        # 🔹 Convertir et transcrire l'audio avec Whisper
        audio_path = os.path.join(default_storage.location, file_path)
        result = model.transcribe(audio_path)
        transcribed_text = result["text"]

        if not transcribed_text.strip():
            return JsonResponse({'error': 'Transcription échouée'}, status=500)

        # 🔹 Envoyer la transcription à OpenRouter
        API_KEY = "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"
        API_URL = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [{"role": "user", "content": transcribed_text}]
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        openrouter_response = response.json()

        bot_response = openrouter_response.get("choices", [{}])[0].get("message", {}).get("content", "Pas de réponse")

        return JsonResponse({
            'transcription': transcribed_text,
            'response': bot_response
        })

    except Exception as e:
        return JsonResponse({'error': 'Erreur interne', 'details': str(e)}, status=500)

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def receive_password(request):
    if request.method == "POST":
        data = json.loads(request.body)
        password = data.get("password")

        if password:
            request.session["user_password"] = password  
            request.session.set_expiry(86400)  # Expiration en 1 jour
            print(f"🔐 Session enregistrée : {request.session.items()}")  # Log
            return JsonResponse({"status": "success", "message": "Session démarrée"}, status=200)

    return JsonResponse({"status": "error", "message": "Mot de passe manquant"}, status=400)

@csrf_exempt
def check_session(request):
    if "user_password" in request.session:
        return JsonResponse({"status": "success", "message": "Session active"}, status=200)
    else:
        return JsonResponse({"status": "error", "message": "Session expirée"}, status=403)
