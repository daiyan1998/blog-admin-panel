import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/_mail/mails/")({
  component: () => {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Re: The Future of Renewable Energy: Innovations and Challenges Ahead
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt="JS" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">Jayvion Simon</div>
              <div className="text-sm text-muted-foreground">
                To: demo@minimals.cc, tyrel.greenholt@gmail.com
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              13 Jan 2025 2:53 pm
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <p>
              Occaecati est et illo quibusdam accusamus qui. Incidunt aut et
              molestiae ut facere aut. Est quidem iusto praesentium excepturi
              harum nihil tenetur facilis. Ut omnis voluptates nihil accusantium
              doloribus eaque debitis.
            </p>
          </div>
        </div>
      </div>
    );
  },
});
