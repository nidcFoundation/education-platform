import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Pin } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ScholarAnnouncementsPage() {
    const supabase = await createSupabaseServerClient();

    const { data: announcements, error } = await supabase
        .from("announcements")
        .select("*")
        .or("audience.eq.all,audience.eq.scholars")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching announcements:", error);
    }

    const announcementsList = announcements || [];

    return (
        <PageContainer
            title="Announcements"
            description="Important updates, events, and notices from the programme office."
        >
            <div className="grid gap-6">
                {announcementsList.length > 0 ? (
                    announcementsList.map((announcement) => {
                        const isPinned = announcement.is_pinned || announcement.isPinned;
                        const createdAt = announcement.created_at || announcement.createdAt;

                        return (
                            <Card key={announcement.id} className={`border-border/60 ${isPinned ? "border-primary/50 bg-primary/5" : ""}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                {isPinned ? (
                                                    <Pin className="h-4 w-4 text-primary shrink-0" />
                                                ) : (
                                                    <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
                                                )}
                                                {announcement.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(createdAt).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                                <span className="text-muted-foreground/50 mx-1">•</span>
                                                <span>Posted by {announcement.author}</span>
                                            </CardDescription>
                                        </div>
                                        {isPinned && (
                                            <Badge variant="default" className="w-fit">
                                                Pinned
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {announcement.body}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Card className="border-border/60 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mb-4 text-muted-foreground/50" />
                            <p>No announcements at this time.</p>
                            <p className="text-sm mt-1">Check back later for updates from the programme office.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PageContainer>
    );
}
