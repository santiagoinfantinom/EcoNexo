#!/usr/bin/env python3
import os

filepath = "/Users/santiago/Documents/Projects/EcoNexo/EcoNexo/src/data/projects.ts"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    # Barcelona
    '"https://ajuntament.barcelona.cat/ecologiaurbana/ca/horts-urbans"': '"https://ajuntament.barcelona.cat/mediambient/ca/horts-urbans"',
    
    # Stockholm
    '"https://aterbruketstockholm.se/"': '"https://start.stockholm/om-stockholms-stad/sa-arbetar-vi-med/avfall-och-atervinning/"',
    '"https://www.stockholm.se/TrafikStadsplanering/Stadsodling/"': '"https://start.stockholm/om-stockholms-stad/sa-arbetar-vi-med/stadsutveckling/stadsodling/"',
    
    # Paris
    '"https://natureurbaine.paris/"': '"https://www.nu-paris.com/"',
    '"https://zerowasteparis.org/"': '"https://www.zerowastefrance.org/"',
    
    # Madrid
    '"https://redhuertourbanoslareti.org/"': '"https://redhuertosurbanosmadrid.wordpress.com/"',
    '"https://www.medialabmatadero.es/"': '"https://www.medialab-matadero.es/"',
    
    # Roma
    '"https://romacircularcenter.it/"': '"https://www.comune.roma.it/"',
    
    # Berlin
    '"https://www.gls.de/berlin/"': '"https://www.gls.de/privatkunden/gls-bank/standorte/"',
    '"https://www.nachbarschaftsgarten-prinzenallee.de/"': '"https://himmelbeet.de/"',
    
    # London
    '"https://www.circulareconomyclub.com/organizer/cec-london/"': '"https://www.circulareconomy.com/"',
    
    # Zurich
    '"https://www.stadt-zuerich.ch/2000watt"': '"https://www.stadt-zuerich.ch/gud/de/index/umwelt/energie/2000-watt-gesellschaft.html"',
    
    # Asuncion 
    '"https://es.wikipedia.org/wiki/Comit%C3%A9_Impulsor_Juventud_Colibri"': '"https://www.facebook.com/ComiteJuventudColibri/"',
}

new_content = content
for old, new in replacements.items():
    new_content = new_content.replace(old, new)
    
with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Replaced {sum(1 for old in replacements if old in content)} URLs.")
