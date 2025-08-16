import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import Image from "next/image";
import { Link } from 'lucide-react';


export default function NewsEntry({ imgUrl, title, author, articleUrl, abstract }) {
  return (
    <div>
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={30}>
        <div className="flex h-[100px] items-center justify-center">
          <Image 
            src={imgUrl}
            alt={title}
            width={800} 
            height={800} 
          />  
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">{title}</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizablePanel defaultSize={10}>
        <a href={articleUrl} className="flex h-full items-center justify-center">
          <Link className="text-[#326273] hover:text-[#e39774]"/>
        </a>
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  );
}

