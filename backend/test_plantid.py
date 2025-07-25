import requests

url = "http://127.0.0.1:8000/api/plantid/"  # l'URL de ton API
image_path = "fares.jpg"    # remplace par le vrai chemin de l'image

with open(image_path, 'rb') as img:
    files = {'image': img}
    response = requests.post(url, files=files)

print("Statut HTTP:", response.status_code)
print("Réponse JSON:", response.json())
