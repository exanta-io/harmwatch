#!/bin/bash

# wait for database to be ready
echo "Waiting for the database to be ready for 20 seconds..."
sleep 20

alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000


# wait for the server to start
echo "Waiting for the server to start for 20 seconds..."
sleep 20

# keep the container running
wait $!
