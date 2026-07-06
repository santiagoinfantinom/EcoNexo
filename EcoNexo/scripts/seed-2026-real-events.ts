/**
 * Script to seed REAL 2026 events into the database
 * All events are verified from official sources
 * Run with: npx tsx scripts/seed-2026-real-events.ts
 */

import { realEvents2026 } from '../src/data/events-2026-real';

async function seedRealEvents() {
    console.log('🌱 Starting to seed REAL 2026 events...');
    console.log(`📊 Total events to insert: ${realEvents2026.length}`);
    console.log('✅ All events are verified from official sources\n');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    let successCount = 0;
    let errorCount = 0;

    // First, delete existing 2026 events
    console.log('🗑️  Deleting existing 2026 events...');
    try {
        const deleteResponse = await fetch(`${baseUrl}/api/events?year=2026`, {
            method: 'DELETE',
        });
        if (deleteResponse.ok) {
            console.log('✅ Existing 2026 events deleted\n');
        }
    } catch (error) {
        console.log('⚠️  Could not delete existing events (continuing anyway)\n');
    }

    for (const event of realEvents2026) {
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
                console.log(`✅ Created: ${event.title} (${event.date}) - ${event.city}, ${event.country}`);
                successCount++;
            } else {
                const error = await response.text();
                console.error(`❌ Failed: ${event.title}`, error);
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
    console.log(`✅ Successfully created: ${successCount} REAL events`);
    console.log(`❌ Failed: ${errorCount} events`);
    console.log('\n🎉 Real events seeding complete!');
    console.log('\n📝 All events are verified from official sources:');
    console.log('   - Surfrider Foundation');
    console.log('   - European Commission');
    console.log('   - EARTHDAY.ORG');
    console.log('   - World Cleanup Day');
    console.log('   - And other verified organizations');
}

seedRealEvents().catch(console.error);
