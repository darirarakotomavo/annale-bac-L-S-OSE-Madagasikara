CREATE TABLE "matieres" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100) NOT NULL,
	"code" varchar(10) NOT NULL,
	CONSTRAINT "matieres_nom_unique" UNIQUE("nom"),
	CONSTRAINT "matieres_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "matieres_series" (
	"id" serial PRIMARY KEY NOT NULL,
	"matiere_id" integer NOT NULL,
	"serie_id" integer NOT NULL,
	"coefficient" integer NOT NULL,
	CONSTRAINT "matieres_series_matiere_id_serie_id_unique" UNIQUE("matiere_id","serie_id")
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(10) NOT NULL,
	"description" text,
	CONSTRAINT "series_nom_unique" UNIQUE("nom")
);
--> statement-breakpoint
CREATE TABLE "sujets" (
	"id" serial PRIMARY KEY NOT NULL,
	"annee" integer NOT NULL,
	"session" varchar(20) DEFAULT 'Principale' NOT NULL,
	"matiere_id" integer NOT NULL,
	"serie_id" integer NOT NULL,
	"sujet_pdf_url" text NOT NULL,
	"corrige_pdf_url" text
);
--> statement-breakpoint
ALTER TABLE "matieres_series" ADD CONSTRAINT "matieres_series_matiere_id_matieres_id_fk" FOREIGN KEY ("matiere_id") REFERENCES "public"."matieres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matieres_series" ADD CONSTRAINT "matieres_series_serie_id_series_id_fk" FOREIGN KEY ("serie_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sujets" ADD CONSTRAINT "sujets_matiere_id_matieres_id_fk" FOREIGN KEY ("matiere_id") REFERENCES "public"."matieres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sujets" ADD CONSTRAINT "sujets_serie_id_series_id_fk" FOREIGN KEY ("serie_id") REFERENCES "public"."series"("id") ON DELETE no action ON UPDATE no action;