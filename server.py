#!/usr/bin/env python3
"""
Servidor Python para o sistema InspcIA
Sistema offline para inspeções de Obras de Arte Especiais (OAE)
"""

import os
import json
import http.server
import socketserver
from http.server import BaseHTTPRequestHandler

# Configurações
PORT = 3000

class WebHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/' or self.path == '/index.html':
            self.serve_file('index.html')
        else:
            self.serve_file(self.path[1:])  # Remove leading slash



    def serve_file(self, filename):
        """Serve static files"""
        try:
            if not filename or filename == '':
                filename = 'index.html'
            
            # Security: prevent directory traversal
            if '..' in filename or filename.startswith('/'):
                self.send_error(403, "Forbidden")
                return

            with open(filename, 'rb') as f:
                content = f.read()
            
            # Determine content type
            if filename.endswith('.html'):
                content_type = 'text/html; charset=utf-8'
            elif filename.endswith('.js'):
                content_type = 'application/javascript'
            elif filename.endswith('.css'):
                content_type = 'text/css'
            elif filename.endswith('.json'):
                content_type = 'application/json'
            else:
                content_type = 'text/plain'

            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404, "File Not Found")
        except Exception as e:
            print(f"Erro ao servir arquivo {filename}: {e}")
            self.send_error(500, "Internal Server Error")



def main():
    """Main function to start the server"""
    print(f"🚀 Servidor Python rodando em http://localhost:{PORT}")
    print(f"📱 Sistema de Inspeção OAE - Offline")
    print(f"🌐 Acesse: http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), WebHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor interrompido pelo usuário")
            httpd.shutdown()

if __name__ == "__main__":
    main()
