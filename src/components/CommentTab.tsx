import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Divide } from "lucide-react";
export default function CommentTab() {
  const [rendered, setRendered] = useState(false);
  const [id, setId] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  return (
    <div className="overflow-scroll fixed top-[75px] right-0  w-[500px] h-[700px] border-2 flex justify-center items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      {/* <div className="h-[300px] w-[300px] bg-gray-900 rounded-lg"> */}
      {rendered ? (
        <div> </div>
      ) : (
        <div className="flex flex-col gap-4">
          {id.map((element) => (
            <div key={element} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-700" />
                <Skeleton className="h-4 w-[200px] bg-gray-700" />
                {/* </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
