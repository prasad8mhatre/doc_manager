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

import os
from dotenv import load_dotenv

from langchain.chains import (
    create_history_aware_retriever,
    create_retrieval_chain,
)
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import RetrievalQA
from langchain_core.callbacks.manager import CallbackManagerForChainRun
from models import Embedding
from utils.database import query_database_for_docs
import json
from langchain import hub
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema import Document

load_dotenv()

prompt_string = hub.pull("rlm/rag-prompt")

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



@router.post("/infer")
async def answer_question(query: QAModel, db: Session = Depends(get_db)):
    if not query.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    
    documents = await retrieve_embeddings(query.question, query.docId)
    print(documents)

    context = "\n".join([doc.page_content for doc in documents])
    
    if not documents:
        raise ValueError("No relevant documents found.")

    chain = LLMChain(llm=model, prompt=prompt_string)
    response = chain.run(context=context, question=query.question)
   
    print("Response:"+ str(response))
    
    return {"answer": response, "documents": documents}


   
   
