#!/usr/bin/env python3
import os

filepath = "/Users/santiago/Documents/Projects/EcoNexo/src/data/jobs.ts"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    '"https://www.linkedin.com/jobs/search/?keywords=European%20Energy%20Renewable%20Energy%20Project%20Manager"': '"https://careers.europeanenergy.com/jobs"',
    '"https://www.linkedin.com/jobs/search/?keywords=Northvolt%20Battery%20Systems%20Engineer"': '"https://northvolt.com/career/"',
    '"https://www.linkedin.com/jobs/search/?keywords=Vestas%20Wind%20Turbine%20Technician"': '"https://www.vestas.com/en/careers/job-opportunities"',
    '"https://www.linkedin.com/jobs/search/?keywords=%C3%98rsted%20Offshore%20Wind%20Engineer"': '"https://orsted.com/en/careers"',
    '"https://www.linkedin.com/jobs/search/?keywords=Enel%20Green%20Power%20Solar%20PV%20Design%20Engineer"': '"https://www.enelgreenpower.com/careers"',
    '"https://www.linkedin.com/jobs/search/?keywords=Ecosia%20Software%20Engineer%20-%20Green%20Search"': '"https://www.ecosia.org/jobs"',
    '"https://www.linkedin.com/jobs/search/?keywords=ClimateAI%20Climate%20Data%20Scientist"': '"https://www.climate.ai/careers"',
    '"https://www.linkedin.com/jobs/search/?keywords=Plan%20A%20Sustainability%20Software%20Developer"': '"https://plana.earth/careers"',
    '"https://www.linkedin.com/jobs/search/?keywords=Siemens%20ESG%20Reporting%20Manager"': '"https://jobs.siemens.com/careers"',
    '"https://www.linkedin.com/jobs/search/?keywords=Deloitte%20Sustainability%20Consultant"': '"https://www2.deloitte.com/de/de/pages/karriere/topics/karriere.html"'
}

new_content = content
count = 0
for old, new in replacements.items():
    if old in new_content:
        new_content = new_content.replace(old, new)
        count += 1
    
with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Replaced {count} apply_url instances in {filepath}")
