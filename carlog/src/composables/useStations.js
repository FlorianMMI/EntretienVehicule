import { ref } from 'vue';
import { fetchNearbyStations } from '../services/stations.service.js';

export function useStations() {
  const stations = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const loadStations = (radius = 10) => {
    isLoading.value = true;
    error.value = null;

    if (!navigator.geolocation) {
      error.value = "La géolocalisation n'est pas supportée.";
      isLoading.value = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          stations.value = await fetchNearbyStations(latitude, longitude, radius);
        } catch (err) {
          error.value = "Impossible de récupérer les stations.";
        } finally {
          isLoading.value = false;
        }
      },
      (err) => {
        error.value = "Veuillez autoriser la géolocalisation.";
        isLoading.value = false;
      }
    );
  };

  return { stations, isLoading, error, loadStations };
}