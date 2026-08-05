<script setup>
import { onMounted, ref, computed } from 'vue'
import { useStations } from '../composables/useStations'

const { stations, isLoading, error, loadStations } = useStations()
const rayon = ref(10) // ref permet à vue de surveiller cette variable

const userLat = ref(null)
const userLon = ref(null)
const messageErreur = ref('')
const enChargement = ref(false)

const recupererPosition = () => {
  enChargement.value = true
  messageErreur.value = ''

  navigator.geolocation.getCurrentPosition(
    // 🟢 SUCCÈS : L'utilisateur a accepté
    (position) => {
      userLat.value = position.coords.latitude
      userLon.value = position.coords.longitude
      enChargement.value = false

      console.log('Position trouvée :', userLat.value, userLon.value)
    },
    (erreur) => {
      enChargement.value = false
      switch (erreur.code) {
        case erreur.PERMISSION_DENIED:
          messageErreur.value =
            'Vous devez autoriser la localisation pour trouver les stations proches.'
          break
        case erreur.POSITION_UNAVAILABLE:
          messageErreur.value = 'Les informations de localisation sont indisponibles.'
          break
        case erreur.TIMEOUT:
          messageErreur.value = 'La demande a pris trop de temps.'
          break
        default:
          messageErreur.value = 'Une erreur inconnue est survenue.'
          break
      }
    },
  )
}

// Fonction mathématique pure pour le tri (retourne un nombre)
const calculerDistanceBrute = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity

  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const stationsTrieesParDistance = computed(() => {
  // Si l'utilisateur n'a pas encore donné sa position, on retourne la liste normale
  if (!userLat.value || !userLon.value) {
    return stations.value
  }

  // On crée une copie du tableau original avec [...tableau]
  const copie = [...stations.value]

  // On trie la copie en utilisant la valeur mathématique pure
  return copie.sort((stationA, stationB) => {
    const distA = calculerDistanceBrute(
      userLat.value,
      userLon.value,
      stationA.geom.lat,
      stationA.geom.lon,
    )
    const distB = calculerDistanceBrute(
      userLat.value,
      userLon.value,
      stationB.geom.lat,
      stationB.geom.lon,
    )

    // Le tri se fait ici : distance A moins distance B (du plus proche au plus lointain)
    return distA - distB
  })
})

onMounted(() => {
  recupererPosition()
  loadStations(10)
})

const naviguerVersWaze = (latitude, longitude) => {
  // Construction de l'URL Universal Link
  const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
  window.open(url, '_blank')
}

// Fonction pour l'affichage (retourne du texte arrondi)
const calculerDistance = (lat1, lon1, lat2, lon2) => {
  const distance = calculerDistanceBrute(lat1, lon1, lat2, lon2)
  if (distance === Infinity) return null
  return distance.toFixed(1)
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 mt-10">
    <!-- En-tête -->
    <header
      class="flex flex-wrap sm:flex-row justify-between items-center border-b pb-4 mb-6 gap-4"
    >
      <h1 class="text-2xl font-bold text-gray-800">Stations à proximité</h1>
      <button
        @click="loadStations(10); console.log('test')"
        :disabled="isLoading"
        class="bg-blue-200 text-white px-4 py-2 rounded hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        <img src="/icon/refresh.svg" alt="Actualiser" class="w-5 h-5" />
      </button>
      <div class="flex gap-2 items-center">
        <span>Rayon :</span>
        <input
          v-model="rayon"
          @change="loadStations(rayon)"
          class="bg-white border-gray-300 w-20 text-center border rounded px-2 py-1"
          type="number"
        />
      </div>
    </header>

    <!-- Alertes (Erreur) -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center"
    >
      ⚠️ {{ error }}
    </div>

    <!-- Chargement (Spinner Tailwind) -->
    <div
      v-else-if="isLoading"
      class="flex flex-col items-center justify-center py-12 text-gray-500"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-200 mb-4"></div>
      <p class="font-medium">Recherche des stations autour de vous...</p>
    </div>

    <!-- Aucun résultat -->
    <div
      v-else-if="stations.length === 0"
      class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-center"
    >
      Aucune station-service trouvée dans ce rayon.
    </div>

    <!-- Grille des stations -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="station in stationsTrieesParDistance"
        :key="station.id"
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
      >
        <div class="bg-gray-50 p-4 border-b">
          <h2 class="font-bold text-lg text-gray-800 capitalize">
            Station de {{ station.ville.toLowerCase() }}
          </h2>
          <!-- Et l'adresse exacte en dessous -->
          <p class="text-sm text-gray-500 mt-1">{{ station.adresse }}</p>
          <p class="text-xs text-blue-600 mt-1" v-if="station.horaires_automate_24_24 === 'Oui'">
            24h/24 par automate
          </p>
        </div>

        <!-- Corps de la carte (Prix) -->
        <div class="p-4 grow flex flex-col justify-between">
          
          <!-- Bloc des prix -->
          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Prix affichés
            </h3>
            <ul class="flex flex-wrap gap-2 mt-3 mb-4">
              <!-- GAZOLE (Jaune / Orange) -->
              <li
                v-if="station.gazole_prix"
                class="flex items-center bg-yellow-100 text-yellow-800 font-bold px-3 py-1.5 rounded-lg text-sm w-max"
              >
                Gazole {{ station.gazole_prix }} €
              </li>

              <!-- SP95 / E10 (Vert classique) -->
              <li
                v-if="station.e10_prix || station.sp95_prix"
                class="flex items-center bg-green-100 text-green-800 font-bold px-3 py-1.5 rounded-lg text-sm w-max"
              >
                SP95/E10 {{ station.e10_prix || station.sp95_prix }} €
              </li>

              <!-- SP98 (Vert émeraude) -->
              <li
                v-if="station.sp98_prix"
                class="flex items-center bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg text-sm w-max"
              >
                SP98 {{ station.sp98_prix }} €
              </li>

              <!-- E85 (Bleu) -->
              <li
                v-if="station.e85_prix"
                class="flex items-center bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-lg text-sm w-max"
              >
                E85 {{ station.e85_prix }} €
              </li>
            </ul>
          </div>

          <!-- Bloc Navigation et Distance -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div v-if="userLat && userLon" class="text-gray-500 text-sm font-bold flex items-center gap-1">
              À {{ calculerDistance(userLat, userLon, station.geom.lat, station.geom.lon) }} km (vol d'oiseau)
            </div>
            
            <button 
              class="bg-blue-400 p-2 rounded-lg shadow-sm hover:bg-blue-500 hover:shadow transition-all cursor-pointer flex items-center justify-center" 
              @click="naviguerVersWaze(station.geom.lat, station.geom.lon)"
              title="Y aller avec Waze"
            >
              <img src="/icon/navigation.svg" alt="Navigation" class="w-5 h-5" />
            </button>

          </div>

          

        </div>

        
        
      </div>
    </div>
  </div>
</template>