import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, staggerParent, viewportOnce } from "./motion";
import { AVATAR_URL } from "./data";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader eyebrow="about" title="Engineer who ships, operator who keeps it running." />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start"
        >
          {/* Floating portrait */}
          <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-sm lg:mx-0">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/30 via-accent/5 to-amber/30 opacity-70 blur-2xl" />
              <div className="absolute -inset-px -z-10 rounded-[1.75rem] bg-gradient-to-br from-accent/40 via-transparent to-amber/40" />
              <div className="overflow-hidden rounded-[1.7rem] border border-border bg-surface">
                <img
                  src={AVATAR_URL}
                  alt="Fahad Al Noman portrait"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              {/* Floating tag */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-3 rounded-full border border-accent/40 bg-background/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-accent shadow-glow-sm backdrop-blur"
              >
                ▸ Malta · 2026
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bio + profile */}
          <div className="space-y-6">
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <motion.p variants={fadeUp}>
                I'm <span className="text-foreground">Fahad Al Noman</span>, a Full-Stack Developer and DevOps Engineer based in Qormi, Malta. I build scalable marketplaces and property platforms with React, Next.js, Node.js, Laravel, and Python — and deploy, containerize, and maintain production systems with Docker, Linux, and PostgreSQL/MySQL. Originally from Bangladesh, I pair clean front-end delivery with reliable back-end infrastructure and digital-marketing know-how.
              </motion.p>
              <motion.p variants={fadeUp}>
                My work spans hands-on engineering and operations — from writing Python backup scripts and hardening VPS servers at <span className="text-foreground">CartUp LTD</span>, to building the Bonikbazar.com classifieds marketplace and running paid campaigns that drove over <span className="text-accent">5 million visits</span> at <span className="text-foreground">SAIL Corporation</span>. Today I coordinate web delivery and marketing at <span className="text-foreground">Prochimps LTD</span> in Malta.
              </motion.p>
              <motion.p variants={fadeUp}>
                I hold a BA in Business Economics from Times University, Bangladesh, and I'm currently completing an OTHM Level 4 Diploma in Business Management in Malta. Earlier in my career I volunteered with the <span className="text-foreground">Bangladesh Innovation Forum</span> (2017–2020), running 20+ innovation and career programs and mentoring a NASA Problem Solving Challenge team. Today I actively work with AI-assisted ("vibe coding") workflows as part of my modern engineering toolkit.
              </motion.p>
            </div>

            <motion.aside
              variants={fadeUp}
              className="relative rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur"
            >
              <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-amber/20 opacity-60 blur" />
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">▸ profile</div>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                {[
                  ["Location", "Qormi, Malta"],
                  ["Experience", "5+ years production"],
                  ["Focus", "Full-Stack + DevOps"],
                  ["Languages", "EN · BN"],
                  ["Open to", "Freelance · Remote EU"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:last:border-b sm:last:pb-3">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                    <dd className="text-right font-display text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
