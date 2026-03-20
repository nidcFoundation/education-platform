"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mail, Send } from "lucide-react";
import { donorMessages } from "@/lib/constants";

export default function DonorMessagesPage() {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(donorMessages[0]?.id ?? null);
    const activeThread = donorMessages.find((thread) => thread.id === selectedThreadId) ?? null;

    return (
        <PageContainer
            title="Messages"
            description="Direct communication with the programme office, scholar support team, and finance operations."
            action={<Button>New Message</Button>}
        >
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            Threads
                        </CardTitle>
                        <CardDescription>Recent donor conversations and reporting requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {donorMessages.map((thread) => {
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

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>{activeThread ? activeThread.participant : "No thread selected"}</CardTitle>
                        <CardDescription>{activeThread ? activeThread.role : "There are no donor messages yet."}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeThread ? (
                            <>
                                <div className="space-y-3">
                                    {activeThread.messages.map((message) => {
                                        const isDonor = message.sender === "Crescent Impact Fund";

                                        return (
                                            <div
                                                key={message.id}
                                                className={`rounded-xl p-4 text-sm ${isDonor ? "bg-primary text-primary-foreground ml-8" : "bg-muted/30 mr-8"}`}
                                            >
                                                <p className="font-medium">{message.sender}</p>
                                                <p className={`mt-2 ${isDonor ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                                                    {message.body}
                                                </p>
                                                <p className={`mt-2 text-xs ${isDonor ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                                                    {message.time}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="rounded-xl border bg-background p-4">
                                    <Textarea rows={5} placeholder="Write a reply or request a specific funding or impact breakdown..." />
                                    <div className="mt-3 flex justify-end">
                                        <Button>
                                            <Send className="mr-1" />
                                            Send Message
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                                Your donor inbox is empty. Once the programme office sends an update, it will appear here.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
