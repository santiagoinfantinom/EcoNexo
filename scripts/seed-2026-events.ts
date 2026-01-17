/**
 * Script to seed 2026 events into the database
 * Run with: npx tsx scripts/seed-2026-events.ts
 */

import { events2026 } from '../src/data/events-2026';

async function seedEvents() {
    console.log('🌱 Starting to seed 2026 events...');
    console.log(`📊 Total events to insert: ${events2026.length}`);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    let successCount = 0;
    let errorCount = 0;

    for (const event of events2026) {
        try {
            const response = await fetch(`${baseUrl}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Created event: ${event.title} (${event.date})`);
                successCount++;
            } else {
                const error = await response.text();
                console.error(`❌ Failed to create event: ${event.title}`, error);
                errorCount++;
            }
        } catch (error) {
            console.error(`❌ Error creating event: ${event.title}`, error);
            errorCount++;
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Successfully created: ${successCount} events`);
    console.log(`❌ Failed: ${errorCount} events`);
    console.log('🎉 Seeding complete!');
}

seedEvents().catch(console.error);
