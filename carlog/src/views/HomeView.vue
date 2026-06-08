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
  <div className="flex justify-center">
    
    <h4> Mon suivi auto </h4>
  
  
  </div>
</template>