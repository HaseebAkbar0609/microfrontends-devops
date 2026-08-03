import type { ModuleRichContent } from "./types";

export const inkopMottagningContent: ModuleRichContent = {
  "heroTitle": "Mottagnings­checklista för leveranser",
  "heroDesc": "Digitalt kvitto på varje leverans – antal, kvalitet, transportskador, bilder, GPS och signatur i samma flöde. Så här ser mottagningsdialogen ut i TimeFlow Work.",
  "sections": [
    {
      "label": "Steg",
      "title": "Mottagningsflödet i åtta steg",
      "items": [
        "Steg 1 · 📋 Leveransinfo",
        "Steg 2 · 🔢 Antal",
        "Steg 3 · 🔎 Kvalitet",
        "Steg 4 · ⚠️ Skador",
        "Steg 5 · 📸 Bilder",
        "Steg 6 · 📍 GPS",
        "Steg 7 · ✍️ Signatur",
        "Steg 8 · ✅ Sammanfattning"
      ]
    },
    {
      "label": "Steg 1 · Leveransinfo",
      "title": "Leveransinformation",
      "intro": "Koppla mottagningen till rätt inköpsorder – då uppdateras mottagna antal och status automatiskt.",
      "items": [
        "Välj inköpsorder",
        "Uppdatera",
        "+ Skapa demo-order",
        "Leverantör",
        "Inköpsordernr",
        "Följesedelsnr",
        "Projekt"
      ],
      "text": "🔒 Logga in för att koppla mottagningen till en riktig inköpsorder. Du kan fortfarande testa checklistan i demo-läge. Inga öppna inköpsorder ännu. Skapa en demo-order för att testa hela flödet."
    },
    {
      "label": "Steg 2 · Antal",
      "title": "Kontrollera antal",
      "intro": "Registrera vad som faktiskt levererats mot beställt antal. Avvikelser skapar reklamationsunderlag.",
      "items": [
        "Artikel",
        "Beställt",
        "Mottaget",
        "− X saknas",
        "+ X extra",
        "OK",
        "+ Lägg till artikel"
      ],
      "text": "Totalt beställt: X · Mottaget: X · Avvikande rader: X"
    },
    {
      "label": "Steg 3 · Kvalitet",
      "title": "Kvalitetskontroll",
      "intro": "Bedöm materialets skick vid mottagning.",
      "items": [
        "🟢 godkänd",
        "🟡 anmärkning",
        "🔴 avvisad",
        "Kommentar"
      ]
    },
    {
      "label": "Steg 4 · Skador",
      "title": "Transportskador & avvikelser",
      "intro": "Markera alla avvikelser – reklamation skapas automatiskt.",
      "items": [
        "Transportskada",
        "Felskickat material",
        "Saknat material",
        "Felaktig produkt",
        "Kvalitetsbrist",
        "Leveransförsening",
        "Beskrivning"
      ]
    },
    {
      "label": "Steg 5 · Bilder",
      "title": "Foton från leveransen",
      "intro": "Ta bilder på pallar, följesedel och eventuella skador. Alla foton sparas i projektets dokumentmapp.",
      "items": [
        "Ta foto eller ladda upp bilder",
        "JPG/PNG · flera filer stöds"
      ]
    },
    {
      "label": "Steg 6 · GPS",
      "title": "GPS-position",
      "intro": "Registrera var leveransen togs emot – används för spårbarhet och ID06.",
      "items": [
        "📍 Hämta min position",
        "Uppdatera position"
      ],
      "text": "Lat: X · Lng: X · Noggrannhet: ± X m"
    },
    {
      "label": "Steg 7 · Signatur",
      "title": "Signatur",
      "intro": "Mottagaren skriver under för att bekräfta leveransen.",
      "items": [
        "Namn på mottagare",
        "Rensa",
        "✓ Signatur registrerad"
      ]
    },
    {
      "label": "Steg 8 · Sammanfattning",
      "title": "Sammanfattning",
      "items": [
        "Leverantör",
        "Inköpsorder",
        "Följesedel",
        "Projekt",
        "Artiklar",
        "Kvalitet",
        "Avvikelser",
        "Bilder",
        "GPS",
        "Signerad av",
        "Slutför & uppdatera order",
        "Slutför mottagning"
      ],
      "text": "⚠️ Avvikelser upptäckta – reklamation skapas automatiskt och notifiering skickas till inköparen. 🔗 Kopplas till inköpsordern – mottagna antal och orderstatus uppdateras automatiskt. Ingen inköpsorder vald – rapporten registreras i demo-läge utan att uppdatera någon order."
    },
    {
      "label": "Resultat",
      "title": "Mottagning registrerad",
      "intro": "Rapporten är sparad. Reklamationer öppnas automatiskt vid avvikelser.",
      "items": [
        "Inköpsorder: ordernr",
        "Ny status",
        "Artiklar med mottaget/beställt antal per rad",
        "Registrera ny mottagning"
      ]
    },
    {
      "label": "Orderstatus",
      "title": "Inköpsorderns status",
      "items": [
        "Öppen",
        "Delvis mottagen",
        "Mottagen",
        "Avvikelse",
        "Stängd"
      ]
    },
    {
      "label": "Så används checklistan",
      "title": "Direkt i mobilen på plats.",
      "items": [
        {
          "icon": "📱",
          "title": "TimeFlow Work",
          "desc": "Hantverkaren startar mottagningen från inköpsordern eller genom att skanna följesedeln."
        },
        {
          "icon": "🔗",
          "title": "Kopplat till allt",
          "desc": "Rapporten kopplas automatiskt till projekt, budget, leverantör och ekonomi."
        },
        {
          "icon": "📨",
          "title": "Reklamation direkt",
          "desc": "Vid avvikelser skapas reklamationsärende och inköparen får notis i realtid."
        }
      ]
    }
  ]
};
