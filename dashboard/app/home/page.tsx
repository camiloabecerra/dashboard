"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import NewsEntry from "@/components/feed/news";
import InternshipEntry from "@/components/feed/internships";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
      const goBack = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/login");
        }
  });

  
  return () => goBack();
  }, []);
  
  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-news`).then((res) => res.json()).then((data) => setArticles(data));
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-internships`).then((res) => res.json()).then((data) => setInternships(data));
  }, []);
  
  const [currentNewsPage, setCurrentNewsPage] = useState(1);
  const eltsPerNewsPage = 5;
  const totalNewsPages = 10;
  const startNewsIdx = (currentNewsPage - 1) * eltsPerNewsPage;

  const [query, setQuery] = useState("");
  const [sentiment, setSentiment] = useState("");
  const sendTopic = async () => {
    console.log("entered");
    console.log(`prompt:${query}`);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-reddit-sentiment?topic=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSentiment(data);
        console.log(data);
        console.log(sentiment);
    }
    catch (e) {
        console.error(e);
    } 
  }

  const [currentPage, setCurrentPage] = useState(1);
  const eltsPerPage = 10;
  const startIdx = (currentPage - 1) * eltsPerPage;
  
  return (
      <div className="bg-[#eeeeee]">
        <div className="flex py-[8%] gap-3 px-2">
          <div className="flex-1">  
            <Card>
              <CardTitle className="text-xl text-[#326273] flex justify-center">Latest News</CardTitle>
              <CardContent>
              <div>
                {[...articles].sort((x,y) => y.date._seconds - x.date._seconds).slice(startNewsIdx, startNewsIdx+eltsPerNewsPage).map((article) => (
                  <NewsEntry
                    key = {article.id}
                    imgUrl = {article.thumbnail_link}
                    title = {article.title}
                    author = {article.author}
                    articleUrl = {article.link}
                    abstract = {article.abstract}
                  />
                ))}
              </div>
              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem className="cursor-pointer">
                      <PaginationPrevious onClick={() => setCurrentNewsPage((i) => Math.max(1, i - 1))}/>
                    </PaginationItem>
                      <PaginationItem className="cursor-pointer">
                        <PaginationLink onClick={() => setCurrentNewsPage(1)}>1</PaginationLink>
                      </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem className="cursor-pointer">
                      <PaginationNext onClick={() => setCurrentNewsPage((i) => i + 1)} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              </CardContent>
            </Card>
          </div>  
          <div className="flex-1">
            <Card>
              <CardTitle className="text-xl text-[#326273] flex justify-center">Summarize Reddit Opinion</CardTitle>
              <CardContent>
              <div className="flex w-full max-w-sm items-center gap-2">
                <Input placeholder="Enter Topic To Analyze" onChange={(topic) => setQuery(topic.target.value)}/>
                <Button type="submit" variant="outline" onClick={sendTopic}>
                    Submit
                </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1">
            <Card>
              <CardTitle className="text-xl text-[#326273] flex justify-center">Latest Tech Internships</CardTitle>
              <CardContent>
                <div>
                  {[...internships].sort((x,y) => y.date._seconds - x.date._seconds).slice(startIdx, startIdx + eltsPerPage).map((internship) => (
                      <InternshipEntry
                      key = {internship.id}
                      role = {internship.role}
                      company = {internship.company}
                      dateReleased = {internship.date}
                      applicationUrl = {internship.link}
                      />
                  ))}
                </div>
                <div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem className="cursor-pointer">
                        <PaginationPrevious onClick={() => setCurrentPage((i) => Math.max(1, i - 1))}/>
                      </PaginationItem>
                      <PaginationItem className="cursor-pointer">
                        <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem className="cursor-pointer">
                        <PaginationNext onClick={() => setCurrentPage((i) => Math.min(totalNewsPages, i + 1))}/>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
