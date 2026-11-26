import { NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ shortcode: string }> },
) {
    const { shortcode } = await params;
    const link = await getLinkByShortCode(shortcode);

    if (!link) {
        return new NextResponse("Link not found", { status: 404 });
    }

    let target: URL;
    try {
        target = new URL(link.url);
    } catch {
        return new NextResponse("Invalid link", { status: 400 });
    }

    if (target.protocol !== "http:" && target.protocol !== "https:") {
        return new NextResponse("Invalid link", { status: 400 });
    }

    return NextResponse.redirect(target, 307);
}
