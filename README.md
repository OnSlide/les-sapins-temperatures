# Températures Les Sapins — V3 synchronisée

Application PWA de relevé des températures PMS / HACCP.

## V3
- synchronisation centralisée Supabase entre PC, iPhone et autres appareils ;
- authentification par email / mot de passe ;
- premier compte : administrateur ;
- comptes suivants : en attente jusqu’à approbation par un administrateur ;
- rôles administrateur / employé ;
- photos privées dans Supabase Storage ;
- file d’attente locale lorsque le réseau est indisponible ;
- reprise automatique de la synchronisation ;
- Realtime pour rafraîchir les autres appareils ;
- historique d’audit côté base ;
- export PDF HACCP.

## Première mise en route
1. Publier tous les fichiers à la racine de GitHub Pages.
2. Ouvrir l’application avec Internet.
3. Créer le premier compte puis confirmer l’email si demandé.
4. Se reconnecter : le premier compte devient administrateur.
5. Si l’appareil contient déjà des données V2, accepter leur import vers la base synchronisée.
6. Sur les autres appareils, créer un compte puis le faire approuver depuis Réglages > Utilisateurs, ou se connecter avec un compte déjà approuvé.

Aucune clé secrète Supabase n’est incluse dans le frontend ; seule la clé publiable est utilisée et les accès aux données sont protégés par RLS.
