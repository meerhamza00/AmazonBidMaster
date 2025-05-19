#!/bin/bash

# Check if the server is running
echo "Checking if the server is running on port 4000..."
if curl -s http://localhost:4000 > /dev/null; then
  echo "✅ Server is running on port 4000"
else
  echo "❌ Server is not running on port 4000"
fi

# Check if the client is running
echo "Checking if the client is running on port 3000..."
if curl -s http://localhost:3000 > /dev/null; then
  echo "✅ Client is running on port 3000"
else
  echo "❌ Client is not running on port 3000"
fi

# Check if the API is accessible
echo "Checking if the API is accessible..."
if curl -s http://localhost:4000/api/campaigns > /dev/null; then
  echo "✅ API is accessible"
else
  echo "❌ API is not accessible"
fi

echo "Done!"