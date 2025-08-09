import os
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime

import requests
from bs4 import BeautifulSoup

from selenium import webdriver

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore 


# Access DB
db_path = os.getenv("FIRESTORE_PRIVATE_PATH") 
cred = credentials.Certificate(db_path)
firebase_admin.initialize_app(cred)
db = firestore.client()


def update_internships():
    '''
    Scrapes data from internship list on GitHub and populates internship DB
    '''
    # Scrape data from Github repo
    list_url = "https://github.com/vanshb03/Summer2026-Internships?tab=readme-ov-file"
    soup = BeautifulSoup(requests.get(list_url).text, "html.parser")
    
    collection = "internships"
    internships = soup.find_all("tbody")[-1]
    
    # Clean data and add to database collection
    prev_company = None
    for row in internships.find_all("tr")[:100]:
        cells = row.find_all("td")
    
        if not prev_company:
            prev_company = cells[0]
    
        if str(cells[0]) == "<td>↳</td>":
            cells[0] = prev_company
        else:
            prev_company = str(cells[0])
        
        data = {
            "company":str(cells[0]).split("<td>")[1].split("</td>")[0], 
            "role":str(cells[1]).split("<td>")[1].split("</td>")[0], 
            "link":cells[3].find("a")["href"],
            "date":str(cells[4]).split("<td>")[1].split("</td>")[0]
        }
        
        data["date"] = datetime.strptime(f"{data["date"]} {datetime.now().year}", "%b %d %Y")
    
        entry_id = data["role"] + " @ " + data["company"]
        
        doc = db.collection(collection).document(entry_id)
        
        # if we have already updated the db this far, there is no need to keep going. 
        # All further entries are already in the db.
        if doc.get().exists:
            break
        else:
            doc.set(data)


def update_news():
    '''
    Makes API calls to NYT and WSJ and populates DB
    '''
    # Get data from NYT API
    api_call = f"https://api.nytimes.com/svc/topstories/v2/home.json?api-key={os.getenv("NYT_API_KEY")}"
    response = requests.get(api_call).json()["results"]
    
    collection = "news"
    id_count = 0
    for article in response:
        data = {
            "title": article["title"],
            "topic": article["section"],
            "abstract": article["abstract"],
            "author": article["byline"],
            "date": datetime.fromisoformat(article["published_date"]),
            "thumbnail_link": article["multimedia"][0]["url"],
            "link": article["url"]
        }
        
        article_id = f"NYT Article {id_count}"
    
        doc = db.collection(collection).document(article_id)
        
        doc.set(data)
        
        id_count += 1
    
    # Gets data from WSJ API
    api_call = "https://wall-street-journal.p.rapidapi.com/api/v2/getArticleList"

    params = { "id": "Mobile_Section_wsj_us_WEB_NOW_TOP_NEWS_PROD" }

    headers = {
        'x-rapidapi-key': os.getenv("WSJ_API_KEY"),
        'x-rapidapi-host': "wall-street-journal.p.rapidapi.com"
    } 
    
    response = requests.get(api_call, headers=headers, params=params).json()["data"]
    
    for i in range(25):
        article = response[i]
        
        data = {}
        
        title = article["headline"]
        if title:
            title = title["text"]
        data["title"] = title 
        
        data["topic"] = article["sectionName"]
        
        abstract = article["summary"]
        if abstract:
            abstract = abstract["descriptions"]
            if abstract:
                abstract = abstract[0]
                if abstract:
                    abstract = abstract["content"]
                    if abstract:
                        abstract = abstract["text"]
        
        data["abstract"] = abstract

        date = article["publishedDateTime"]
        if date:
            date = datetime.fromisoformat(date)
        data["date"] = date 
        
        thumbnail_link = article["summary"]
        if thumbnail_link:
            thumbnail_link = thumbnail_link["image"]
            if thumbnail_link:
                thumbnail_link = thumbnail_link[0]
                if thumbnail_link:
                    thumbnail_link = thumbnail_link["combinedRegularUrl"]
        
        data["thumbnail_link"] = thumbnail_link
        
        data["link"] = article["sourceUrl"]

        author = article["flattenedByline"]
        if author:
            author = author["text"]
        data["author"] = author
       

        article_id = f"WSJ Article {i}"
        
        doc = db.collection(collection).document(article_id)
        
        doc.set(data)
    


update_internships()
update_news()
