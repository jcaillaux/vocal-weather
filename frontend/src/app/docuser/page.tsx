'use client';
import React from 'react';

export default function UserGuide() {
  return (
    <div className="container py-4">
      <h1 className="display-6 mb-4">Guide d'utilisation</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Avant de commencer</h2>
          <p className="card-text">
            Bienvenue dans notre application météo. Sur cette page, vous trouverez toutes les informations pour utiliser notre application.
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Utilisation</h2>
          <ol className="list-group list-group-numbered">
            <li className="list-group-item">Cliquez sur le bouton de reconnaissance vocale</li>
            <li className="list-group-item">Prononcez clairement le nom de la ville ainsi que l'horizon de prédiction</li>
            <li className="list-group-item">Une fois terminé, cliquez à nouveau sur le bouton pour envoyé votre commande</li>
            <li className="list-group-item">Attendez que l'application charge les prévisions météorologiques</li>
            <li className="list-group-item">Si plusieurs jours ont été demandé, vous pouvez sélectionner un jour en particulier grâce au cartes en bas de pages</li>
          </ol>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Fonctionnalités</h2>
          <ul className="list-group">
            <li className="list-group-item">Prévisions détaillées</li>
            <li className="list-group-item">Graphiques interactifs</li>
            <li className="list-group-item">Actualisation sur demande</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Conseils</h2>
          <p className="card-text">
            Pour de meilleurs résultats, parlez clairement et utilisez des noms de villes complets.
          </p>
        </div>
      </div>
    </div>
  );
}