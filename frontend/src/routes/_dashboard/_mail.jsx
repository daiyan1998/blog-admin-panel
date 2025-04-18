import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Mail,
  Send,
  File,
  Trash2,
  AlertCircle,
  Star,
  MessageSquare,
  Tag,
  Users,
  Archive,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosInstance";
import { formatDate } from "@/utils/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mailItems = [
  { icon: <Mail />, label: "All", count: 3 },
  { icon: <Archive />, label: "Inbox", count: 1 },
  { icon: <Send />, label: "Sent" },
  { icon: <File />, label: "Drafts" },
  { icon: <Trash2 />, label: "Trash" },
  { icon: <AlertCircle />, label: "Spam", count: 1 },
  { icon: <Star />, label: "Starred", count: 1 },
  { icon: <Users />, label: "Social" },
  { icon: <Tag />, label: "Promotions", count: 2 },
  { icon: <MessageSquare />, label: "Forums", count: 1 },
];

export const Route = createFileRoute("/_dashboard/_mail")({
  component: () => {
    const { data: mails, isLoading } = useQuery({
      queryKey: ["mails"],
      queryFn: () => api.get("/mails").then((res) => res.data.mails),
    });
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="pt-10">
        <h1 className="text-3xl font-bold mb-5">Email</h1>
        <div className="flex h-screen bg-background">
          {/* Left Sidebar */}
          <div className="w-64 border-r flex flex-col">
            <div className="p-4">
              <Button className="w-full" size="lg">
                <Mail className="mr-2 h-4 w-4" /> Compose
              </Button>
            </div>

            <nav className="flex-1">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  {mailItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      {item.icon}
                      <span className="mr-2">{item.label}</span>
                      {item.count && (
                        <span className="ml-auto opacity-70">{item.count}</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Middle Panel - Email List */}
          <div className="flex-1 flex flex-col border-r">
            <div className="p-4 border-b">
              <Input
                type="search"
                placeholder="Search..."
                className="max-w-xl"
              />
            </div>

            <ScrollArea className="flex-1">
              <div className="divide-y">
                {mails?.map((mail) => (
                  <div
                    key={mail.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mail.avatar} alt={mail.sender} />
                      <AvatarFallback>{mail.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{mail.email}</span>
                        <span className="text-muted-foreground text-sm">
                          {formatDate(mail.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {mail.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <Outlet />
        </div>
      </div>
    );
  },
});
