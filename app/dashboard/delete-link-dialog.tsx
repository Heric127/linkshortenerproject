"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteLink } from "./actions";

export function DeleteLinkDialog({ id, shortCode }: { id: number; shortCode: string }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (next) setError(null);
    }

    function handleDelete() {
        setError(null);
        startTransition(async () => {
            const result = await deleteLink({ id });
            if (result.error) {
                setError(result.error);
                return;
            }
            setOpen(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                <Trash2 />
                Delete
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete link?</DialogTitle>
                    <DialogDescription>
                        This will permanently delete /{shortCode}. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
