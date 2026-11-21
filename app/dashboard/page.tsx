import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Dashboard() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    return <h1>Dashboard</h1>;
}

export default function DashboardPage() {
    return (
        <Suspense>
            <Dashboard />
        </Suspense>
    );
}
