# doc_manager : Document Management and RAG-based Q&A Application
Purpose: Three-part application that involves backend services,
frontend interface, and Q&A features powered by a Retrieval-Augmented Generation (RAG)
system. The application aims to manage users, documents, and an ingestion process that
generates embeddings for document retrieval in a Q&A setting.


# Documentation:
This project has 4 parts 
 1. Datalayer - RAG, Ingestion on data in vector and can ask question on those document
 2. Backend - Management of docuement, user, authentication
 3. frontend - frontend for this application
 4. Api automation - automation for api exposed by data layer and backend service



Datalayer - 
 API documentation - http://localhost:9000/docs - swagger doc

Backend 
 API documentation - http://localhost:3000/api - swagger doc





## How to setup:- 


# Prod setup
==============================
1. Take a server - ec2 machine
2. Clone this repo
3. follow developer setup steps
4. setup LLM creds and DB creds





# Developer setup
=================================================
# data layer

python -m venv venv

source venv/bin/activate

-- setup DB
docker run --name pgvector-container -e POSTGRES_USER=langchain -e POSTGRES_PASSWORD=langchain -e POSTGRES_DB=langchain -p 6024:5432 -d pgvector/pgvector:pg16

python main.py

.env file
DATABASE_URL=set your cred
GOOGLE_API_KEY= set your cred

http://localhost:9000/ - 

http://localhost:9000/docs - swagger doc


# Backend service

npm install


http://localhost:3000/ -

http://localhost:3000/api - swagger doc


# frontend
npm install

ng serve

npx playwright install




#  api automation
npm run test:api


# UI automation
npx playwright test --headed


Architecture:
=======================
![diagram drawio](https://github.com/user-attachments/assets/03848b25-b43f-450b-ba2a-ee6e3a0cde20)

