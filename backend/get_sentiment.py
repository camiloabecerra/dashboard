import sys
import os
from dotenv import load_dotenv
load_dotenv()

import heapq

import numpy as np
import matplotlib.pyplot as plt

import praw
from transformers import pipeline, logging
from gpt4all import GPT4All

import warnings

warnings.filterwarnings("ignore")
logging.set_verbosity_error()

CONTEXT_SIZE = 2**12
N_POSTS = 5
MAX_COMMENTS_PER_POST = 20
MAX_CHARS_PER_COMMENT = 200

reddit = praw.Reddit(client_id=os.getenv("REDDIT_API_ID"), client_secret=os.getenv("REDDIT_API_SECRET"), user_agent=os.getenv("REDDIT_API_USER_AGENT"))
model = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf", n_ctx=CONTEXT_SIZE)
sentiment_pipeline = pipeline(model="cardiffnlp/twitter-roberta-base-sentiment-latest") # -- must set truncation=True

def get_sentiment(input):
    response = reddit.subreddit("all").search(input, limit=20)

    top = heapq.nlargest(N_POSTS, response, key=lambda x: x.score)
    sentiments = []
    
    for post in top:
        n_comments = 0
        
        post_sentiments = []
        for c in post.comments:
            if isinstance(c, praw.models.MoreComments):
                continue
            
            if n_comments > MAX_COMMENTS_PER_POST:
                break
            else:
                if len(c.body) > MAX_CHARS_PER_COMMENT:
                    post_sentiments.append(c.body[:MAX_CHARS_PER_COMMENT])
                else:
                    post_sentiments.append(c.body)
                
                n_comments += 1
        
        sentiments.append(post_sentiments)


    sentiment_str = ""
    for i in range(MAX_COMMENTS_PER_POST):
        for j in range(N_POSTS):
            sentiment_str += sentiments[j][i]
            sentiment_str += " ||| "
        
        if len(sentiment_str) > CONTEXT_SIZE:
            sentiment_str = sentiment_str[:CONTEXT_SIZE]
            break

    with model.chat_session():
        summary = model.generate(f"Summarize these opinions, and state the general opinion about the subject {input}. Opinions: {sentiment_str}", max_tokens=200)

    return summary

    '''
    sentiments_flat = []
    for post_sentiment in sentiments:
        sentiments_flat += post_sentiment
    
    res = sentiment_pipeline(sentiments_flat, truncation=True, max_length=512)
    bars = {
        "positive": 0,
        "neutral": 0,
        "negative": 0
    }
    for r in res:
        bars[r["label"]] += r["score"]
    
    
    plt.title(f"Reddit sentiment about {input}")
    plt.bar(bars.keys(), bars.values()) 
    plt.show()
    '''

print(get_sentiment(sys.argv[1]))
