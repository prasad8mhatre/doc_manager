# doc_manager



# data layer

python -m venv venv

source venv/bin/activate

docker run --name pgvector-container -e POSTGRES_USER=langchain -e POSTGRES_PASSWORD=langchain -e POSTGRES_DB=langchain -p 6024:5432 -d pgvector/pgvector:pg16

python main.py

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