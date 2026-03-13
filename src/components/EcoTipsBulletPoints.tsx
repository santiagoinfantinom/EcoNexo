import { useI18n } from "@/lib/i18n";
import {
  Beef,
  Sun,
  Building2,
  Train,
  Lightbulb,
  Recycle,
  ShoppingBasket,
  Droplets,
  Info,
  Ban
} from "lucide-react";

export default function EcoTipsBulletPoints() {
  const { t, locale } = useI18n();

  const tips = [
    {
      id: "reduce-meat",
      icon: <Ban className="text-primary" />,
      text: locale === 'es'
        ? "Reduce el consumo de carne y lácteos vacunos. La ganadería es responsable del 14.5% de las emisiones globales de gases de efecto invernadero."
        : locale === 'de'
          ? "Reduziere den Konsum von Rindfleisch und Milchprodukten. Die Viehzucht ist für 14,5% der globalen Treibhausgasemissionen verantwortlich."
          : "Reduce consumption of beef and dairy products. Livestock accounts for 14.5% of global greenhouse gas emissions."
    },
    {
      id: "solar-panels",
      icon: <Sun className="text-secondary" />,
      text: locale === 'es'
        ? "Instala paneles solares en tu hogar. Pueden reducir tu huella de carbono hasta en un 80% y ahorrar dinero a largo plazo."
        : locale === 'de'
          ? "Installiere Solarpanels auf deinem Dach. Sie können deinen CO2-Fußabdruck um bis zu 80% reduzieren und langfristig Geld sparen."
          : "Install solar panels on your home. They can reduce your carbon footprint by up to 80% and save money long-term."
    },
    {
      id: "sustainable-banking",
      icon: <Building2 className="text-cta" />,
      text: locale === 'es'
        ? "Elige una banca ética que apoye proyectos sostenibles como GLS Bank, Triodos Bank o banca cooperativa. Tu dinero puede financiar proyectos ecológicos."
        : locale === 'de'
          ? "Wähle eine ethische Bank wie GLS Bank, Triodos Bank oder Genossenschaftsbanken, die nachhaltige Projekte unterstützen. Dein Geld kann ökologische Projekte finanzieren."
          : "Choose an ethical bank that supports sustainable projects like GLS Bank, Triodos Bank, or cooperative banks. Your money can finance green projects."
    },
    {
      id: "public-transport",
      icon: <Train className="text-primary" />,
      text: locale === 'es'
        ? "Usa transporte público, bicicleta o camina siempre que sea posible. Reducir un viaje en coche por semana puede ahorrar hasta 0.5 toneladas de CO₂ al año."
        : locale === 'de'
          ? "Nutze öffentliche Verkehrsmittel, Fahrrad oder gehe zu Fuß, wann immer möglich. Eine Autofahrt pro Woche weniger kann bis zu 0,5 Tonnen CO₂ pro Jahr einsparen."
          : "Use public transport, bicycle, or walk whenever possible. Reducing one car trip per week can save up to 0.5 tons of CO₂ per year."
    },
    {
      id: "energy-efficiency",
      icon: <Lightbulb className="text-secondary" />,
      text: locale === 'es'
        ? "Mejora la eficiencia energética de tu hogar: aislamiento, bombillas LED, electrodomésticos eficientes. Puede reducir tu consumo energético hasta en un 30%."
        : locale === 'de'
          ? "Verbessere die Energieeffizienz deines Zuhauses: Isolierung, LED-Lampen, energieeffiziente Geräte. Kann deinen Energieverbrauch um bis zu 30% reduzieren."
          : "Improve your home's energy efficiency: insulation, LED bulbs, efficient appliances. Can reduce your energy consumption by up to 30%."
    },
    {
      id: "reduce-waste",
      icon: <Recycle className="text-cta" />,
      text: locale === 'es'
        ? "Reduce, reutiliza y recicla. Evita productos de un solo uso, compra a granel y reutiliza envases. El reciclaje puede reducir las emisiones hasta en un 70%."
        : locale === 'de'
          ? "Reduziere, wiederverwende und recycle. Vermeide Einwegprodukte, kaufe lose und verwende Behälter wieder. Recycling kann Emissionen um bis zu 70% reduzieren."
          : "Reduce, reuse, and recycle. Avoid single-use products, buy in bulk, and reuse containers. Recycling can reduce emissions by up to 70%."
    },
    {
      id: "local-food",
      icon: <ShoppingBasket className="text-primary" />,
      text: locale === 'es'
        ? "Compra alimentos locales y de temporada. Reducen las emisiones del transporte y apoyan la economía local. Los alimentos locales pueden tener hasta 10 veces menos emisiones."
        : locale === 'de'
          ? "Kaufe lokale und saisonale Lebensmittel. Sie reduzieren Transportemissionen und unterstützen die lokale Wirtschaft. Lokale Lebensmittel können bis zu 10-mal weniger Emissionen haben."
          : "Buy local and seasonal food. They reduce transport emissions and support local economy. Local food can have up to 10 times fewer emissions."
    },
    {
      id: "water-conservation",
      icon: <Droplets className="text-secondary" />,
      text: locale === 'es'
        ? "Ahorra agua: duchas cortas, grifos eficientes, recolección de agua de lluvia. El agua es un recurso escaso y su tratamiento consume mucha energía."
        : locale === 'de'
          ? "Spare Wasser: kurze Duschen, effiziente Armaturen, Regenwassersammlung. Wasser ist eine knappe Ressource und seine Aufbereitung verbraucht viel Energie."
          : "Save water: short showers, efficient faucets, rainwater collection. Water is a scarce resource and its treatment consumes a lot of energy."
    }
  ];

  return (
    <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        {locale === 'es'
          ? 'Consejos Prácticos para el Día a Día'
          : locale === 'de'
            ? 'Praktische Tipps für den Alltag'
            : 'Practical Daily Tips'
        }
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="flex items-start gap-3 p-4 bg-green-50 dark:bg-slate-700/50 rounded-lg hover:bg-green-100 dark:hover:bg-slate-700 transition-colors border border-green-100 dark:border-slate-600"
          >
            <span className="text-2xl flex-shrink-0">{tip.icon}</span>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1">
              {tip.text}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
        <p className="text-sm text-foreground/60 text-center flex items-center justify-center gap-2">
          <Info size={16} className="text-primary" />
          {locale === 'es'
            ? 'Tip: Empieza implementando 2-3 consejos a la vez. Los pequeños cambios suman un gran impacto.'
            : locale === 'de'
              ? 'Tipp: Beginne mit 2-3 Tipps gleichzeitig. Kleine Änderungen summieren sich zu großer Wirkung.'
              : 'Tip: Start by implementing 2-3 tips at a time. Small changes add up to big impact.'
          }
        </p>
      </div>
    </div>
  );
}

