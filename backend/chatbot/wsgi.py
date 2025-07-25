"""
WSGI config for chatbot project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import py_eureka_client.eureka_client as eureka_client
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot.settings')

application = get_wsgi_application()

EUREKA_SERVER = "http://127.0.0.1:8087/"
APP_NAME = "chatbot-service"

# Définition des ports
PORTS = [8001, 8002, 8003]

for port in PORTS:
    eureka_client.init(
        eureka_server=EUREKA_SERVER,
        app_name=APP_NAME,
        instance_host="127.0.0.1",
        instance_port=port,
    )
    print(f"✅ Instance {APP_NAME} enregistrée sur le port {port} !")
