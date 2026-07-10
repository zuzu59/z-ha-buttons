<template>
  <section class="view-stack help-view">
    <div class="panel help-hero">
      <div class="eyebrow">Guide rapide</div>
      <h1>Help</h1>
      <p class="help-lead">
        L’application garde tes boutons en local, synchronise leur état avec
        Home Assistant et te permet de piloter l’essentiel depuis l’écran
        d’accueil.
      </p>
    </div>

    <div class="help-grid">
      <div class="panel help-card">
        <div class="eyebrow">1. Commencer</div>
        <ol class="help-steps">
          <li>Ouvre <strong>Configuration</strong> depuis le menu hamburger.</li>
          <li>Renseigne l’URL Home Assistant et le token.</li>
          <li>Définis aussi le mot de passe maître pour protéger l’accès.</li>
          <li>Enregistre puis reviens à l’accueil.</li>
          <li>Ajoute ensuite tes boutons dans <strong>Ajout d’un bouton</strong>.</li>
        </ol>
      </div>

      <div class="panel help-card">
        <div class="eyebrow">2. Utiliser l’application</div>
        <ul class="bullet-list help-bullets">
          <li>Tape un bouton pour basculer son état.</li>
          <li>Un appui long sur une lampe ouvre son détail avancé.</li>
          <li>La page d’accueil affiche l’état le plus récent reçu de Home Assistant.</li>
          <li><strong>Ordre d’affichage des boutons</strong> sert à réorganiser l’accueil.</li>
          <li><strong>Exportation / importation CSV</strong> permet de sauvegarder ou restaurer ta configuration.</li>
        </ul>
      </div>

      <div class="panel help-card">
        <div class="eyebrow">3. Maintenance</div>
        <div class="help-actions">
          <article class="help-action">
            <h2>Force refresh PWA</h2>
            <p>Utilise-le si un ancien cache bloque l’affichage d’une nouvelle version.</p>
          </article>
          <article class="help-action">
            <h2>Reset factory</h2>
            <p>Réinitialise complètement l’application locale après confirmation.</p>
          </article>
          <article class="help-action">
            <h2>About</h2>
            <p>Affiche la version courante, le changelog et les liens GitHub.</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
