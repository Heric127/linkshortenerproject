import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getLinksByUserId } from "@/data/links";

async function Dashboard() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const userLinks = await getLinksByUserId(userId);

    return (
        <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
            <h1 className="text-2xl font-semibold">Your Links</h1>
            {userLinks.length === 0 ? (
                <p className="text-muted-foreground">You haven&apos;t created any links yet.</p>
            ) : (
                <ul className="space-y-3">
                    {userLinks.map((link) => (
                        <li key={link.id}>
                            <Card size="sm">
                                <CardHeader>
                                    <CardTitle>/{link.shortCode}</CardTitle>
                                    <CardDescription className="break-all">{link.url}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-xs text-muted-foreground">
                                    Created {link.createdAt.toLocaleDateString()}
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

export default function DashboardPage() {
    return (
        <Suspense>
            <Dashboard />
        </Suspense>
    );
}
