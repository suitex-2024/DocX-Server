# Real-time Document Collaboration Server

This server enables real-time document collaboration using WebSockets. It allows clients to connect, edit documents, and save their changes to a JSON file (`drive.json`) on the server.

## Features

- **Real-time Collaboration**: Multiple clients can edit documents simultaneously, with changes being reflected in real-time.
- **Document Storage**: Documents are stored in a JSON file, enabling persistent storage.
- **Socket.IO Integration**: Uses Socket.IO for handling WebSocket connections and events.

## Requirements

- Node.js
- Socket.IO

## Getting Started

1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/IBMTechXChange/DocX-Server/
   npm i
   npm run devStart
