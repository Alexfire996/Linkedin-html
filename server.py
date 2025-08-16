#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format for cleaner output
        print(f"[{self.date_time_string()}] {format % args}")

def main():
    # Change to the directory containing the website files
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    # Create the server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🌟 Alex's Personal Website")
        print(f"📍 Server running at: http://localhost:{PORT}")
        print(f"📂 Serving files from: {web_dir}")
        print(f"🎵 Don't forget to add 'dialtone.mp3' to the directory!")
        print(f"🔗 Opening in browser...")
        print(f"💡 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Open the website in the default browser
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
            print("👋 Thanks for visiting Alex's website!")

if __name__ == "__main__":
    main()