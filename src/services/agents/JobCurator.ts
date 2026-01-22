// import { toast } from 'react-hot-toast'; // Removed to avoid dependency error


export interface ScrapedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    source: string;
    status: 'pending' | 'verified' | 'fixed' | 'rejected';
    confidenceScore: number;
    tags: string[];
    log: string[];
}

class JobCuratorAgent {
    private isRunning: boolean = false;
    private memory: ScrapedJob[] = [];

    // Simulated "broken" data sources that the agent needs to fix
    private rawSources = [
        { raw_title: "Senior React Dev - GREEN ENERGY", raw_loc: "Berlin (Remote possible)", raw_broken_field: null },
        { raw_title: null, raw_loc: "Hamburg", raw_company: "WindPower Co", error: "MISSING_TITLE" }, // Broken
        { raw_title: "Sustainability Manager", raw_loc: "Madrid", raw_source: "linkedin_v2_scraper" },
        { raw_title: "Eco-Consultant", raw_loc: "Paris", raw_tags: "environment,consulting,broken_tag_format_123" } // Malformed tags
    ];

    public async startCurating(onUpdate: (job: ScrapedJob) => void) {
        if (this.isRunning) return;
        this.isRunning = true;

        // Simulate agent "waking up"
        await this.simulateDelay(1000);
        this.log("🤖 Job Curator Agent initialized. Starting autonomous scrape cycle...");

        for (const source of this.rawSources) {
            if (!this.isRunning) break;

            // 1. Simulate Scraping
            await this.simulateDelay(1500);
            const jobAttempt = this.parseSource(source);

            // 2. Simulate Validation & Self-Correction
            if (jobAttempt.status === 'rejected') {
                this.log(`⚠️ Alert: Found broken job entry. Attempting self-correction pattern...`);
                await this.simulateDelay(1000);

                const fixedJob = this.attemptSelfCorrection(source, jobAttempt);
                if (fixedJob) {
                    this.log(`✅ self-correction successful! Recovered job: ${fixedJob.title}`);
                    onUpdate(fixedJob);
                } else {
                    this.log(`❌ Failed to recover job. Skipping.`);
                }
            } else {
                // Healthy job
                this.log(`✅ Verified valid job: ${jobAttempt.title}`);
                onUpdate(jobAttempt);
            }
        }

        this.log("💤 Curating cycle complete. Sleeping until next trigger.");
        this.isRunning = false;
    }

    private parseSource(raw: any): ScrapedJob {
        const log: string[] = [`Searching source: ${raw.raw_source || 'general_crawler'}...`];

        // Simulate valid extraction
        if (raw.raw_title && raw.raw_loc && !raw.error) {
            return {
                id: Math.random().toString(36).substr(2, 9),
                title: raw.raw_title,
                company: raw.raw_company || "Unknown Eco Company",
                location: raw.raw_loc,
                source: "Autonomous Crawler",
                status: 'verified',
                confidenceScore: 0.98,
                tags: ['green', 'verified'],
                log
            };
        }

        // Simulate broken extraction
        return {
            id: "broken",
            title: "Unknown",
            company: "Unknown",
            location: "Unknown",
            source: "Error",
            status: 'rejected',
            confidenceScore: 0.1,
            tags: [],
            log
        };
    }

    private attemptSelfCorrection(raw: any, failedJob: ScrapedJob): ScrapedJob | null {
        // Agent "Logic" to fix things

        // Case 1: Missing Title (Simulate inferring from other fields or DOM)
        if (raw.error === "MISSING_TITLE" && raw.raw_company === "WindPower Co") {
            return {
                ...failedJob,
                id: Math.random().toString(36).substr(2, 9),
                title: "Wind Energy Engineer (Inferred)", // Agent "guessed" the title
                company: raw.raw_company,
                location: raw.raw_loc,
                status: 'fixed',
                confidenceScore: 0.75, // Lower confidence due to inference
                log: [...failedJob.log, "⚠️ Title missing. Inferred 'Wind Energy Engineer' based on company profile 'WindPower Co'."]
            };
        }

        // Case 2: Malformed tags
        if (raw.raw_tags && raw.raw_tags.includes('broken_tag')) {
            return {
                ...failedJob,
                id: Math.random().toString(36).substr(2, 9),
                title: raw.raw_title,
                company: "EcoServe",
                location: raw.raw_loc,
                status: 'fixed',
                confidenceScore: 0.85,
                tags: ['environment', 'consulting'], // Cleaned tags
                log: [...failedJob.log, "⚠️ Detected malformed tags. Applied regex cleaner pattern #4 to sanitize."]
            };
        }

        return null;
    }

    private simulateDelay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private log(message: string) {
        console.log(`[JobCurator] ${message}`);
        // In a real app, this would stream to the UI
    }
}

export const jobCurator = new JobCuratorAgent();
