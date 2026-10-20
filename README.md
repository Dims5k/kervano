# Kervano

Jeu de plateau-quiz à jouer en famille (sur un téléphone ou en ligne), en 6 langues. Thèmes au choix à l'accueil : Islam, Christianisme, Judaïsme, Histoire, Géographie, Sciences et nature, Maths et logique, Culture générale, Capitales du monde.

Les thèmes autres que l'islam sont dans `packs/<thème>.json` (français) et `packs/<thème>.<langue>.json` (traductions). Vérifier un pack : `node packs/check.js packs/histoire.json packs/histoire.en.json`.

Jouer : https://dims5k.github.io/kervano/

## Mode Salon (TV)

Sur l'accueil, « Afficher le jeu sur cette TV » : à ouvrir dans le navigateur de la Smart TV, ou sur un iPhone / iPad / Mac recopié en AirPlay (iPhone tourné en paysage). La TV affiche le plateau 3D, les questions et les sons ; chaque joueur scanne le QR code et répond sur son téléphone, qui sert de manette (silencieux, sans plateau). La TV n'est pas un joueur : elle rejoint la salle Firebase comme écran. QR code généré par `qrcode.js` (Kazuhiko Arase, licence MIT).

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
