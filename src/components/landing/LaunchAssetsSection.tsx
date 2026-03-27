import { ArrowUpRight, CalendarDays, Download, Sparkles } from "lucide-react";

import SectionIntro from "@/components/landing/SectionIntro";
import { Button } from "@/components/ui/button";

const launchAssets = [
  {
    title: "Launch poster",
    format: "SVG poster",
    description: "A keynote-style poster for launch day screens, printed standees, or event pages.",
    href: "/launch-assets/flinke-launch-poster.svg",
    useCase: "Venue signage",
    accent: "from-[#241c18] via-[#5f4a3a] to-[#d5c2a1]",
  },
  {
    title: "Social square",
    format: "1080 x 1080",
    description: "A square announcement card for Facebook, LinkedIn, or Instagram feed posts.",
    href: "/launch-assets/flinke-social-square.svg",
    useCase: "Social launch post",
    accent: "from-[#cbb38f] via-[#8f735b] to-[#241c18]",
  },
  {
    title: "Story frame",
    format: "1080 x 1920",
    description: "A vertical story asset for countdowns, reminders, and behind-the-scenes updates.",
    href: "/launch-assets/flinke-story-vertical.svg",
    useCase: "Instagram story",
    accent: "from-[#f5ede2] via-[#d7c2aa] to-[#8b6d57]",
  },
  {
    title: "Email banner",
    format: "Wide banner",
    description: "A clean horizontal banner for launch emails, partner outreach, or press updates.",
    href: "/launch-assets/flinke-email-banner.svg",
    useCase: "Email and press kit",
    accent: "from-[#1f1814] via-[#4c3d31] to-[#c4a886]",
  },
] as const;

export default function LaunchAssetsSection() {
  return (
    <section id="launch-assets" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Launch kit"
          title="Ready-to-use assets for the website launch event."
          description="These branded pieces give you something concrete to publish on launch day instead of scrambling for last-minute graphics."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div className="section-shell overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  What is included
                </p>
                <h3 className="mt-3 text-2xl font-display font-bold tracking-tight text-foreground md:text-3xl">
                  Four launch-ready assets in the current Flinke visual system.
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-4 py-2 text-sm text-text-secondary">
                <Sparkles className="h-4 w-4 text-foreground" />
                Edit-friendly SVG files
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {launchAssets.map((asset) => (
                <article
                  key={asset.title}
                  className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4"
                >
                  <div
                    className={`relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${asset.accent} p-5 text-white premium-shadow`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(0_0%_100%_/_0.18),transparent_30%),linear-gradient(180deg,transparent,hsl(24_18%_10%_/_0.22))]" />
                    <div className="relative min-h-[13rem]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                        {asset.useCase}
                      </p>
                      <div className="mt-8 max-w-[14rem]">
                        <p className="text-sm uppercase tracking-[0.24em] text-white/68">
                          Flinke launch week
                        </p>
                        <h4 className="mt-3 text-2xl font-display font-bold leading-tight">
                          {asset.title}
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-white/78">
                          Websites and product experiences built to turn attention into inquiries.
                        </p>
                      </div>
                      <div className="absolute bottom-0 right-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/76">
                        Now live
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-lg font-display font-semibold text-foreground">
                          {asset.title}
                        </h4>
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary">
                          {asset.format}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {asset.description}
                      </p>
                    </div>

                    <Button variant="heroOutline" size="lg" className="w-full sm:w-auto" asChild>
                      <a href={asset.href} download>
                        Download asset <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="section-shell flex flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                Suggested rollout
              </p>
              <h3 className="mt-3 text-2xl font-display font-bold tracking-tight text-foreground">
                A tighter launch sequence would make the site feel more intentional.
              </h3>
              <p className="mt-4 text-base leading-7 text-text-secondary">
                The current page has solid ingredients, but it reads like a general agency site. For a
                launch push, it helps to surface one specific campaign layer and make it easy to share.
              </p>
            </div>

            <div className="mt-8 space-y-4 border-t border-border/70 pt-6">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 h-5 w-5 text-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Pre-launch</p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Use the story frame for countdown reminders and speaker or team teasers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Launch day</p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Lead with the square post and poster, then push traffic back into the site CTA flow.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowUpRight className="mt-1 h-5 w-5 text-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Follow-up</p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Reuse the email banner for partner outreach, recap mailers, or an investor update.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-muted/45 p-5">
              <p className="text-sm font-semibold text-foreground">Immediate improvement I’m fixing</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Anchor links like Pricing, Work, FAQ, and the new Launch Kit now have a router-aware
                scroll handler so they land on the right section instead of relying on browser luck.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
