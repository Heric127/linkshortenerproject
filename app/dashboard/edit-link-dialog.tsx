"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLink } from "./actions";

export function EditLinkDialog({
    id,
    initialUrl,
    initialShortCode,
}: {
    id: number;
    initialUrl: string;
    initialShortCode: string;
}) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState(initialUrl);
    const [shortCode, setShortCode] = useState(initialShortCode);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (next) {
            setUrl(initialUrl);
            setShortCode(initialShortCode);
            setError(null);
        }
    }

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await updateLink({ id, url, shortCode });
            if (result.error) {
                setError(result.error);
                return;
            }
            setOpen(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
                <Pencil />
                Edit
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Edit link</DialogTitle>
                        <DialogDescription>
                            Update the destination URL or short code.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor={`edit-url-${id}`}>Destination URL</Label>
                        <Input
                            id={`edit-url-${id}`}
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`edit-shortCode-${id}`}>Short code</Label>
                        <Input
                            id={`edit-shortCode-${id}`}
                            value={shortCode}
                            onChange={(e) => setShortCode(e.target.value)}
                            minLength={3}
                            maxLength={32}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
