from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.database import get_db
from utils.embedding import retrieve_embeddings
from models import QAModel

from langchain.chains import ConversationalRetrievalChain
from langchain_community.llms import GPT4All
from langchain.prompts import PromptTemplate
from typing import List
from utils.embedding import get_retriever,generate_embedding
from langchain_core.callbacks import BaseCallbackHandler
from langchain_ollama.llms import OllamaLLM
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
import os
from dotenv import load_dotenv

from langchain.chains import (
    create_history_aware_retriever,
    create_retrieval_chain,
)
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import RetrievalQA

load_dotenv()



router = APIRouter()
count = 0

class MyCustomHandler(BaseCallbackHandler):
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        global count
        if count < 10:
            print(f"Token: {token}")
            count += 1

model = "orca-mini-3b-gguf2-q4_0.gguf"
#gpt4all_model = GPT4All(model=model, callbacks=[MyCustomHandler()], streaming=True)
#model = OllamaLLM(model="tinyllama")
model = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

#qa_chain = ConversationalRetrievalChain.from_llm(model, get_retriever())

# qa_chain = RetrievalQAWithSourcesChain(
#     llm=model,
#     retriever=get_retriever(),
#     return_source_documents=True
# )





@router.post("/infer")
async def answer_question(query: QAModel, db: Session = Depends(get_db)):
    if not query.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    
    documents = retrieve_embeddings(query.question)
    
    if not documents:
        raise ValueError("No relevant documents found.")


    memory = ConversationBufferMemory(memory_key="chat_history",return_messages=True, output_key='result')

    #memory.save_context("inputs": "how many company has served","outputs": "2 companies")
    memory.save_context({"input":  "how many company has served"}, {"result": "2 companies"})


   


    qa_chain = RetrievalQA.from_chain_type(
        llm=model,
        retriever=get_retriever(),
        chain_type="stuff",
        return_source_documents=True,
        memory = memory

    )
    
        
    response = qa_chain.invoke(query.question)


    
    print("Response:"+ str(response))

    
    return {"answer": response['result'], "documents": response['source_documents']}


   
   
