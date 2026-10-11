# Kervano

Jeu de plateau-quiz à jouer en famille (sur un téléphone ou en ligne), en 6 langues. Thèmes au choix à l'accueil : Islam, Christianisme, Judaïsme, Histoire, Géographie, Sciences et nature, Maths et logique, Culture générale.

Les thèmes autres que l'islam sont dans `packs/<thème>.json` (français) et `packs/<thème>.<langue>.json` (traductions). Vérifier un pack : `node packs/check.js packs/histoire.json packs/histoire.en.json`.

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
