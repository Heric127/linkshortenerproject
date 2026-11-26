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
import { CreateLinkDialog } from "./create-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";

async function Dashboard() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const userLinks = await getLinksByUserId(userId);

    return (
        <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Your Links</h1>
                <CreateLinkDialog />
            </div>
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
                                <CardContent className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Created {link.createdAt.toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <EditLinkDialog
                                            id={link.id}
                                            initialUrl={link.url}
                                            initialShortCode={link.shortCode}
                                        />
                                        <DeleteLinkDialog id={link.id} shortCode={link.shortCode} />
                                    </div>
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
