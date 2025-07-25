import webbrowser
import os

def ouvrir_fichier_html(nom_fichier):
    chemin_complet = os.path.abspath(nom_fichier)
    webbrowser.open(f'file://{chemin_complet}')

# Appel de la fonction
ouvrir_fichier_html('test_upload.html')
