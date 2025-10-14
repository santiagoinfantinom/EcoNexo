"use client";
import React, { useState, useEffect } from 'react';

interface ImpactMetrics {
  co2Reduction: number; // kg CO2
  wasteReduced: number; // kg
  energySaved: number; // kWh
  waterSaved: number; // liters
  treesPlanted: number;
  biodiversityScore: number; // 0-100
  socialImpact: number; // 0-100
  economicValue: number; // euros
}

interface Event {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  category: string;
  maxVolunteers: number;
  currentVolunteers: number;
  duration: number; // hours
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
}

interface ImpactAnalysisProps {
  event: Event;
  onAnalysisComplete?: (metrics: ImpactMetrics) => void;
}

export default function ImpactAnalysis({ event, onAnalysisComplete }: ImpactAnalysisProps) {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisDetails, setAnalysisDetails] = useState<string[]>([]);

  useEffect(() => {
    calculateImpact();
  }, [event]);

  const calculateImpact = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const calculatedMetrics = await performImpactCalculation(event);
      setMetrics(calculatedMetrics);
      
      const details = generateAnalysisDetails(calculatedMetrics, event);
      setAnalysisDetails(details);
      
      onAnalysisComplete?.(calculatedMetrics);
    } catch (error) {
      console.error('Error calculating impact:', error);
    } finally {
      setLoading(false);
    }
  };

  const performImpactCalculation = async (event: Event): Promise<ImpactMetrics> => {
    // Base multipliers by category
    const categoryMultipliers = {
      environment: {
        co2Reduction: 2.5,
        wasteReduced: 1.8,
        energySaved: 1.2,
        waterSaved: 0.8,
        treesPlanted: 0.3,
        biodiversityScore: 15,
        socialImpact: 8,
        economicValue: 25
      },
      education: {
        co2Reduction: 0.5,
        wasteReduced: 0.3,
        energySaved: 0.8,
        waterSaved: 0.2,
        treesPlanted: 0.1,
        biodiversityScore: 5,
        socialImpact: 20,
        economicValue: 45
      },
      community: {
        co2Reduction: 1.2,
        wasteReduced: 1.0,
        energySaved: 0.6,
        waterSaved: 0.4,
        treesPlanted: 0.2,
        biodiversityScore: 8,
        socialImpact: 25,
        economicValue: 35
      }
    };

    const multiplier = categoryMultipliers[event.category as keyof typeof categoryMultipliers] || 
                      categoryMultipliers.environment;

    // Calculate based on volunteers and duration
    const volunteerHours = event.currentVolunteers * event.duration;
    const participationRate = event.currentVolunteers / event.maxVolunteers;

    const baseMetrics: ImpactMetrics = {
      co2Reduction: volunteerHours * multiplier.co2Reduction * (0.8 + participationRate * 0.4),
      wasteReduced: volunteerHours * multiplier.wasteReduced * (0.7 + participationRate * 0.6),
      energySaved: volunteerHours * multiplier.energySaved * (0.6 + participationRate * 0.8),
      waterSaved: volunteerHours * multiplier.waterSaved * (0.5 + participationRate * 1.0),
      treesPlanted: Math.floor(volunteerHours * multiplier.treesPlanted * (0.5 + participationRate * 1.0)),
      biodiversityScore: Math.min(100, multiplier.biodiversityScore * participationRate * 2),
      socialImpact: Math.min(100, multiplier.socialImpact * participationRate * 1.5),
      economicValue: volunteerHours * multiplier.economicValue * (0.8 + participationRate * 0.4)
    };

    // Add some randomness for realism
    const addRandomness = (value: number, variance: number = 0.1) => {
      const randomFactor = 1 + (Math.random() - 0.5) * variance;
      return Math.max(0, value * randomFactor);
    };

    return {
      co2Reduction: addRandomness(baseMetrics.co2Reduction),
      wasteReduced: addRandomness(baseMetrics.wasteReduced),
      energySaved: addRandomness(baseMetrics.energySaved),
      waterSaved: addRandomness(baseMetrics.waterSaved),
      treesPlanted: Math.floor(addRandomness(baseMetrics.treesPlanted)),
      biodiversityScore: Math.floor(addRandomness(baseMetrics.biodiversityScore)),
      socialImpact: Math.floor(addRandomness(baseMetrics.socialImpact)),
      economicValue: addRandomness(baseMetrics.economicValue)
    };
  };

  const generateAnalysisDetails = (metrics: ImpactMetrics, event: Event): string[] => {
    const details: string[] = [];

    // CO2 Analysis
    if (metrics.co2Reduction > 50) {
      details.push(`🌱 Reducción significativa de CO₂: equivalente a ${Math.round(metrics.co2Reduction / 20)} km menos en coche`);
    } else if (metrics.co2Reduction > 20) {
      details.push(`🌱 Buena reducción de CO₂: equivalente a ${Math.round(metrics.co2Reduction / 20)} km menos en coche`);
    }

    // Waste Analysis
    if (metrics.wasteReduced > 30) {
      details.push(`♻️ Gran impacto en residuos: ${metrics.wasteReduced.toFixed(1)} kg menos en vertederos`);
    }

    // Energy Analysis
    if (metrics.energySaved > 20) {
      details.push(`⚡ Ahorro energético notable: ${metrics.energySaved.toFixed(1)} kWh ahorrados`);
    }

    // Water Analysis
    if (metrics.waterSaved > 100) {
      details.push(`💧 Conservación de agua: ${metrics.waterSaved.toFixed(0)} litros ahorrados`);
    }

    // Trees Analysis
    if (metrics.treesPlanted > 0) {
      details.push(`🌳 Reforestación: ${metrics.treesPlanted} árboles plantados`);
    }

    // Biodiversity Analysis
    if (metrics.biodiversityScore > 70) {
      details.push(`🦋 Alto impacto en biodiversidad: hábitat mejorado significativamente`);
    } else if (metrics.biodiversityScore > 40) {
      details.push(`🦋 Impacto moderado en biodiversidad: contribución positiva al ecosistema`);
    }

    // Social Impact Analysis
    if (metrics.socialImpact > 80) {
      details.push(`👥 Gran impacto social: comunidad fortalecida y conectada`);
    } else if (metrics.socialImpact > 50) {
      details.push(`👥 Impacto social positivo: participación comunitaria activa`);
    }

    // Economic Analysis
    if (metrics.economicValue > 200) {
      details.push(`💰 Alto valor económico: €${metrics.economicValue.toFixed(0)} en beneficios sociales`);
    } else if (metrics.economicValue > 100) {
      details.push(`💰 Valor económico positivo: €${metrics.economicValue.toFixed(0)} en beneficios`);
    }

    return details;
  };

  const getImpactLevel = (score: number): { level: string; color: string; icon: string } => {
    if (score >= 80) return { level: 'Muy Alto', color: 'text-green-600 bg-green-100', icon: '🚀' };
    if (score >= 60) return { level: 'Alto', color: 'text-blue-600 bg-blue-100', icon: '⭐' };
    if (score >= 40) return { level: 'Medio', color: 'text-yellow-600 bg-yellow-100', icon: '📈' };
    if (score >= 20) return { level: 'Bajo', color: 'text-orange-600 bg-orange-100', icon: '📊' };
    return { level: 'Mínimo', color: 'text-red-600 bg-red-100', icon: '📉' };
  };

  const getOverallImpactScore = (): number => {
    if (!metrics) return 0;
    
    const weights = {
      co2Reduction: 0.25,
      wasteReduced: 0.15,
      energySaved: 0.15,
      waterSaved: 0.10,
      biodiversityScore: 0.15,
      socialImpact: 0.20
    };

    const normalizedCO2 = Math.min(100, (metrics.co2Reduction / 100) * 100);
    const normalizedWaste = Math.min(100, (metrics.wasteReduced / 50) * 100);
    const normalizedEnergy = Math.min(100, (metrics.energySaved / 30) * 100);
    const normalizedWater = Math.min(100, (metrics.waterSaved / 200) * 100);

    return Math.round(
      normalizedCO2 * weights.co2Reduction +
      normalizedWaste * weights.wasteReduced +
      normalizedEnergy * weights.energySaved +
      normalizedWater * weights.waterSaved +
      metrics.biodiversityScore * weights.biodiversityScore +
      metrics.socialImpact * weights.socialImpact
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Calculando impacto...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-slate-500 dark:text-slate-400">
            No se pudo calcular el impacto del evento
          </div>
        </div>
      </div>
    );
  }

  const overallScore = getOverallImpactScore();
  const impactLevel = getImpactLevel(overallScore);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Análisis de Impacto
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${impactLevel.color}`}>
            {impactLevel.icon} {impactLevel.level}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {overallScore}/100
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {metrics.co2Reduction.toFixed(1)}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">kg CO₂ reducidos</div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.wasteReduced.toFixed(1)}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">kg residuos reducidos</div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {metrics.energySaved.toFixed(1)}
          </div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">kWh ahorrados</div>
        </div>
        
        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            {metrics.waterSaved.toFixed(0)}
          </div>
          <div className="text-sm text-cyan-700 dark:text-cyan-300">litros agua ahorrados</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {metrics.treesPlanted}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Árboles plantados</div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {metrics.biodiversityScore}/100
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Puntuación biodiversidad</div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            €{metrics.economicValue.toFixed(0)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Valor económico</div>
        </div>
      </div>

      {/* Analysis Details */}
      {analysisDetails.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
            📊 Análisis Detallado
          </h4>
          <ul className="space-y-2">
            {analysisDetails.map((detail, index) => (
              <li key={index} className="text-sm text-slate-600 dark:text-slate-400">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Impact Visualization */}
      <div className="mt-6">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
          📈 Comparación de Impacto
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
              <span>Impacto Ambiental</span>
              <span>{Math.round((metrics.co2Reduction + metrics.wasteReduced + metrics.energySaved) / 3)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (metrics.co2Reduction + metrics.wasteReduced + metrics.energySaved) / 3)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
              <span>Impacto Social</span>
              <span>{metrics.socialImpact}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.socialImpact}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
              <span>Biodiversidad</span>
              <span>{metrics.biodiversityScore}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.biodiversityScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
