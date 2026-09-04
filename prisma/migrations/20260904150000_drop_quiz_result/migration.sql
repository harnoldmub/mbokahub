-- Le quiz a été retiré du produit : il portait sur une salle et une date
-- précises, pour un événement passé, et n'avait enregistré aucune réponse.
-- La table est vide au moment de cette migration.
DROP TABLE IF EXISTS "QuizResult";
