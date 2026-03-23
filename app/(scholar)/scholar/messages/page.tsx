"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mail, Send } from "lucide-react";
import { scholarMessages } from "@/lib/constants";

export default function ScholarMessagesPage() {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(scholarMessages[0]?.id ?? null);
    const activeThread = scholarMessages.find((thread) => thread.id === selectedThreadId) ?? null;

    return (
        <PageContainer
            title="Messages"
            description="Direct communication with your programme mentor, academic support, and finance team."
            action={<Button>New Message</Button>}
        >
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            Threads
                        </CardTitle>
                        <CardDescription>Recent conversations and requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {scholarMessages.map((thread) => {
                            const isActive = thread.id === selectedThreadId;

                            return (
                                <button
                                    key={thread.id}
                                    type="button"
                                    onClick={() => setSelectedThreadId(thread.id)}
                                    aria-pressed={isActive}
                                    className={cn(
                                        "w-full rounded-xl border bg-background p-4 text-left transition-colors",
                                        isActive ? "border-primary/40 bg-primary/5" : "hover:bg-muted/30"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium">{thread.participant}</p>
                                            <p className="text-xs text-muted-foreground">{thread.role}</p>
                                        </div>
                                        {thread.unreadCount > 0 && <Badge>{thread.unreadCount}</Badge>}
                                    </div>
                                    <p className="mt-3 text-sm text-muted-foreground">{thread.lastMessage}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">{thread.timestamp}</p>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card className="border-border/60 flex flex-col min-h-[500px]">
                    <CardHeader>
                        <CardTitle>{activeThread ? activeThread.participant : "No thread selected"}</CardTitle>
                        <CardDescription>{activeThread ? activeThread.role : "There are no messages yet."}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                        {activeThread ? (
                            <>
                                <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-4">
                                    {activeThread.messages.map((message) => {
                                        const isScholar = message.sender === "You" || message.sender === "Scholar";

                                        return (
                                            <div
                                                key={message.id}
                                                className={`rounded-xl p-4 text-sm ${isScholar ? "bg-primary text-primary-foreground ml-8" : "bg-muted/30 mr-8"}`}
                                            >
                                                <p className="font-medium">{message.sender}</p>
                                                <p className={`mt-2 ${isScholar ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                                                    {message.body}
                                                </p>
                                                <p className={`mt-2 text-xs ${isScholar ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                                                    {message.time}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="rounded-xl border bg-background p-4 mt-auto">
                                    <Textarea
                                        rows={4}
                                        placeholder="Send not implemented yet..."
                                        className="resize-none"
                                        readOnly
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <Button disabled aria-disabled title="Send not implemented">
                                            <Send className="mr-1 h-4 w-4" />
                                            Send Message
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground text-center">
                                Your inbox is empty. Once you receive a message from the programme office or your mentor, it will appear here.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
