import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter } from "lucide-react";

interface AuthorBioProps {
  name: string;
  bio: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export function AuthorBio({ name, bio, avatarUrl, linkedinUrl, twitterUrl }: AuthorBioProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-muted/50" data-testid="author-bio-box">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-lg" data-testid="text-author-name">
                {name}
              </h3>
              {(linkedinUrl || twitterUrl) && (
                <div className="flex items-center gap-1">
                  {linkedinUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                      data-testid="link-author-linkedin"
                    >
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {twitterUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                      data-testid="link-author-twitter"
                    >
                      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed" data-testid="text-author-bio">
              {bio}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
