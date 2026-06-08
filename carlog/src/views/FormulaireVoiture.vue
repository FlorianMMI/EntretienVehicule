<script setup>
import { ref } from 'vue';

const marque = ref('');
const modele = ref('');
const annee = ref('');
const kilometrage = ref('');

const enregistrerVoiture = async () => {
  try {

    const nouvelleVoiture = {
      marque: marque.value,
      modele: modele.value,
      annee: annee.value,
      kilometrage: kilometrage.value 
    };

  
    const reponse = await fetch('http://localhost:3000/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nouvelleVoiture)
    });

    if (reponse.ok) {
      marque.value = ''; modele.value = ''; annee.value = ''; kilometrage.value = '';
    } else {
      alert("❌ Erreur lors de l'enregistrement.");
    }
  } catch (erreur) {
    console.error("Erreur de connexion à l'API:", erreur);
  }
};
</script>

<template>
  <form @submit.prevent="enregistrerVoiture" class="flex flex-col items-center gap-4 mt-10">
    
    <div class="flex gap-4">
      <input v-model="marque" type="text" placeholder="Marque" class="border p-2 rounded" required />
      <input v-model="modele" type="text" placeholder="Modèles" class="border p-2 rounded" required />
    </div>

    <div class="flex gap-4">
      <input v-model="kilometrage" type="number" placeholder="Kilométrage" class="border p-2 rounded" required />
      <input v-model="annee" type="number" placeholder="Année circulation" class="border p-2 rounded"  required />
    </div>

    <button type="submit" class="bg-blue-800 text-white px-4 py-2 mt-4 rounded hover:bg-blue-900">
      Enregistrer la voiture
    </button>

  </form>
</template>