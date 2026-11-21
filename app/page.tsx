import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  BarChart3,
  LayoutDashboard,
  Link2,
  Pencil,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant short links",
    description:
      "Paste a long URL and get a clean, shareable short link in seconds.",
  },
  {
    icon: Pencil,
    title: "Custom slugs",
    description:
      "Choose memorable, branded slugs so your links are easy to recognize and share.",
  },
  {
    icon: BarChart3,
    title: "Click tracking",
    description:
      "See how many times each link is visited and understand what resonates.",
  },
  {
    icon: LayoutDashboard,
    title: "Personal dashboard",
    description:
      "Create, edit, and delete all of your links from one organized place.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Your links are tied to your account and protected with modern authentication.",
  },
  {
    icon: Link2,
    title: "Reliable redirects",
    description:
      "Fast, dependable redirects that send your audience exactly where they need to go.",
  },
];

const steps = [
  { title: "Sign up", description: "Create a free account in a few clicks." },
  {
    title: "Paste your link",
    description: "Add any long URL and an optional custom slug.",
  },
  {
    title: "Share and track",
    description: "Share your short link and watch the clicks roll in.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center">
        <Badge variant="secondary">Simple. Fast. Trackable.</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Shorten links. Share smarter.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Turn long, messy URLs into short, memorable links you control, and
          see how they perform, all from one clean dashboard.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SignUpButton mode="modal">
            <Button size="lg">Get started for free</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything you need to manage your links
          </h2>
          <p className="mt-2 text-muted-foreground">
            Powerful features wrapped in a simple experience.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 size-6 text-primary" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map(({ title, description }, index) => (
            <Card key={title}>
              <CardHeader>
                <Badge className="mb-2 w-fit">Step {index + 1}</Badge>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to shorten your first link?
        </h2>
        <p className="text-muted-foreground">
          Join now and start sharing cleaner links today.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg">Create your free account</Button>
        </SignUpButton>
      </section>
    </main>
  );
}
