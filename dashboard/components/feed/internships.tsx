import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Link } from 'lucide-react';


export default function InternshipEntry({ role, company, dateReleased, applicationUrl }) {
  return (
    <div>
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={40} className="h-full">
        <div className="flex h-full items-center justify-center">
          <span className="font-semibold line-clamp-2 min-h-[3rem]">{role}</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center">
          <span className="font-semibold line-clamp-2">{company}</span>
        </div>
      </ResizablePanel>
      <ResizablePanel defaultSize={20}>
        <div className="flex h-full items-center justify-center">
          <span className="font-semibold line-clamp-2">{new Date(dateReleased._seconds * 1000).toLocaleDateString("en-US", {month: "2-digit", day: "2-digit",})}</span>
        </div>
      </ResizablePanel>
      <ResizablePanel defaultSize={10}>
        <a href={applicationUrl} className="flex h-full items-center justify-center">
          <Link className="text-[#326273] hover:text-[#e39774]"/>
        </a>
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  );
}

