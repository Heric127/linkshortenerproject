"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
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
import { createLink } from "./actions";

export function CreateLinkDialog() {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (!next) {
            setUrl("");
            setShortCode("");
            setError(null);
        }
    }

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await createLink({ url, shortCode });
            if (result.error) {
                setError(result.error);
                return;
            }
            handleOpenChange(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button />}>
                <Plus />
                Create link
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Create link</DialogTitle>
                        <DialogDescription>
                            Enter a destination URL and choose a short code.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="url">Destination URL</Label>
                        <Input
                            id="url"
                            type="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="shortCode">Short code</Label>
                        <Input
                            id="shortCode"
                            placeholder="my-link"
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
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
