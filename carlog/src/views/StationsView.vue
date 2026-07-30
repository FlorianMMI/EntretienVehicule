<script setup>
import { onMounted } from 'vue';
import { useStations } from '../composables/useStations';

const { stations, isLoading, error, loadStations } = useStations();

onMounted(() => {
  loadStations(10);
});
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 mt-10">
    
    <!-- En-tête -->
    <header class="flex flex-col sm:flex-row justify-between items-center border-b pb-4 mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">⛽ Stations à proximité</h1>
      <button 
        @click="loadStations(10); console.log('test');" 
        :disabled="isLoading"
        class="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {{ isLoading ? 'Recherche...' : 'Actualiser' }}
      </button>
    </header>

    <!-- Alertes (Erreur) -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
      ⚠️ {{ error }}
    </div>

    <!-- Chargement (Spinner Tailwind) -->
    <div v-else-if="isLoading" class="flex flex-col items-center justify-center py-12 text-gray-500">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-800 mb-4"></div>
      <p class="font-medium">Recherche des stations autour de vous...</p>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="stations.length === 0" class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-center">
      Aucune station-service trouvée dans ce rayon.
    </div>

    <!-- Grille des stations -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="station in stations" :key="station.id" class="bg-white border rounded shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
        
        <!-- Remplace cette partie dans ton fichier Vue -->
      <div class="bg-gray-50 p-4 border-b">
        <h2 class="font-bold text-lg text-gray-800 text-capitalize">
          Station de {{ station.ville.toLowerCase() }}
        </h2>
        <!-- Et l'adresse exacte en dessous -->
        <p class="text-sm text-gray-500 mt-1">{{ station.adresse }}</p>
        <p class="text-xs text-blue-600 mt-1" v-if="station.horaires_automate_24_24 === 'Oui'">
          24h/24 par automate
        </p>
      </div>

        <!-- Corps de la carte (Prix) -->
        <div class="p-4 grow">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Prix affichés</h3>
          <ul class="space-y-2">
            
            <li v-if="station.gazole_prix" class="flex justify-between items-center border-b border-dashed pb-2">
              <span class="font-medium text-gray-700">Gazole</span>
              <span class="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-sm">{{ station.gazole_prix }} €</span>
            </li>
            
            <li v-if="station.e10_prix || station.sp95_prix" class="flex justify-between items-center border-b border-dashed pb-2">
              <span class="font-medium text-gray-700">SP95 / E10</span>
              <span class="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-sm">{{ station.e10_prix || station.sp95_prix }} €</span>
            </li>
            
            <li v-if="station.sp98_prix" class="flex justify-between items-center border-b border-dashed pb-2">
              <span class="font-medium text-gray-700">SP98</span>
              <span class="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-sm">{{ station.sp98_prix }} €</span>
            </li>
            
            <li v-if="station.e85_prix" class="flex justify-between items-center border-b border-dashed pb-2">
              <span class="font-medium text-gray-700">E85</span>
              <span class="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-sm">{{ station.e85_prix }} €</span>
            </li>

          </ul>
        </div>
        
        
        <!-- Pied de la carte -->
        <div v-if="station.prix_maj" class="bg-gray-50 p-3 text-right text-xs text-gray-400 border-t">
          Mise à jour : {{ new Date(station.prix_maj).toLocaleDateString('fr-FR') }}
        </div>

      </div>
    </div>
    
  </div>
</template>