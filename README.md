# La Caravane du Savoir

Jeu de plateau et quiz sur l'islam à jouer en famille sur un seul téléphone : Duo, Carré ou Cash, cases spéciales, réponse au micro.

Jouer : https://dims5k.github.io/Quizz-islam/

## Firebase (mode en ligne et signalements)

Règles à coller dans Realtime Database → Règles :

```json
{
  "rules": {
    "rooms": { "$code": { ".read": "auth != null", ".write": "auth != null" } },
    "reports": {
      ".read": false,
      "$id": { ".write": "auth != null && !data.exists() && newData.child('txt').isString() && newData.child('txt').val().length <= 300" }
    }
  }
}
```

Les erreurs signalées par les joueurs arrivent dans `reports` (numéro de question, langue, commentaire).
