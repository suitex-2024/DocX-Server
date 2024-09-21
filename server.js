const fs = require('fs');
const path = require('path');
const io = require('socket.io')(5174, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Path to the drive.json file on the server
const filePath = path.join(__dirname, './drive.json');

// Load the JSON data from the drive.json file
let jsonData = {};

// Load the JSON file when the server starts
fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
  try {
    jsonData = JSON.parse(data);
    console.log('Data loaded from drive.json');
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }
});

// Function to save the jsonData object back to drive.json
const saveToFile = () => {
  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to the file:', err);
    } else {
      console.log('File updated successfully');
    }
  });
};

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected!');

  // Handle document requests
  socket.on('get-document', (documentId) => {
    console.log('Loading document with ID:', documentId);

    // Load the document from jsonData or use an empty string
    const documentData = jsonData[documentId] || '';
    socket.join(documentId);
    socket.emit('load-document', documentData);
  });

  // Handle changes from clients (for real-time collaboration)
  socket.on('send-changes', (delta) => {
    const { documentId, changes } = delta;
    
    // Broadcast the changes to other clients
    socket.broadcast.to(documentId).emit('receive-changes', changes);

    // Merge the changes into the document on the server
    if (!jsonData[documentId]) {
      jsonData[documentId] = changes;
    } else {
      jsonData[documentId].ops.push(...changes.ops);
    }
  });

  // Receive full document content from client and save it periodically or when user hits save
  socket.on('save-document', (documentId, content) => {
    console.log(`Saving document with ID: ${documentId}`);

    // Update the document content in jsonData
    jsonData[documentId] = content;

    // Save the updated jsonData back to the drive.json file
    saveToFile();
  });

  // Handle disconnect events
  socket.on('disconnect', () => {
    console.log('Client disconnected!');
  });
});
