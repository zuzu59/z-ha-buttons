<template>
  <div class="help-page">
    <h2 class="mb-2">❓ Aide</h2>

    <div class="card mb-2">
      <h3 class="mb-1">🚀 Guide de démarrage</h3>
      <ol class="steps">
        <li><strong>Configurer</strong> la connexion Home Assistant (page ⚙️)</li>
        <li><strong>Ajouter des boutons</strong> pour chaque appareil</li>
        <li><strong>Appuyer</strong> sur une carte pour l'allumer/éteindre</li>
        <li><strong>Appui long</strong> sur une lampe pour les réglages</li>
      </ol>
    </div>

    <div class="card mb-2">
      <h3 class="mb-1">⚙️ Configuration</h3>
      <ul>
        <li>URL du serveur : <code>https://votre-ha:8123</code></li>
        <li>Token : généré dans Home Assistant → Profil → Tokens</li>
        <li>Master password : protège l'accès à l'app</li>
      </ul>
    </div>

    <div class="card mb-2">
      <h3 class="mb-1">🎯 Utilisation courante</h3>
      <ul>
        <li><strong>Toggle</strong> : tap sur une carte</li>
        <li><strong>Réglage lampe</strong> : appui long → détail</li>
        <li><strong>Ordre</strong> : menu hamburger → Ordre d'affichage</li>
        <li><strong>Verrouillage</strong> : configurable dans Settings</li>
      </ul>
    </div>

    <div class="card mb-2">
      <h3 class="mb-1">🔧 Maintenance</h3>
      <ul>
        <li><strong>Refresh PWA</strong> : menu → Tools → Force refresh</li>
        <li><strong>Reset factory</strong> : menu → Tools → Reset (demande confirmation)</li>
        <li><strong>Export/Import</strong> : menu → Tools → CSV</li>
        <li><strong>À jour ?</strong> : voir page About</li>
      </ul>
    </div>

    <div class="text-center">
      <router-link to="/about" class="btn-secondary">ℹ️ Informations & Changelog</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.help-page {
  max-width: 600px;
  margin: 0 auto;
}

.steps {
  padding-left: 1.5rem;
  line-height: 1.8;
}

code {
  background: var(--bg-primary);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
}

ul {
  padding-left: 1.5rem;
  line-height: 1.8;
}
</style>
