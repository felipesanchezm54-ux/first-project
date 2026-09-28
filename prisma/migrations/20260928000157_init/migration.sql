-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "empresa" TEXT,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "servicio" TEXT NOT NULL,
    "plan" TEXT,
    "mensaje" TEXT NOT NULL,
    "origen" TEXT NOT NULL DEFAULT 'contacto',
    "consentimientoHabeasData" BOOLEAN NOT NULL,
    "aceptaComercial" BOOLEAN NOT NULL DEFAULT false,
    "correoEnviado" BOOLEAN NOT NULL DEFAULT false,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "correo" TEXT NOT NULL,
    "consentimiento" BOOLEAN NOT NULL,
    "origen" TEXT NOT NULL DEFAULT 'footer',
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "logo" TEXT,
    "lineaBaseConversionesSemana" REAL NOT NULL,
    "metaAumento" REAL NOT NULL,
    "inicioProyecto" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "correo" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "meta" REAL,
    "fecha" DATETIME NOT NULL,
    CONSTRAINT "Metric_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "inversion" INTEGER NOT NULL,
    "resultados" TEXT NOT NULL,
    "inicio" DATETIME NOT NULL,
    "fin" DATETIME,
    CONSTRAINT "Campaign_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "fechaActualizacion" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "problema" TEXT NOT NULL,
    "estrategia" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "metricasDestacadas" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Lead_fecha_idx" ON "Lead"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_correo_key" ON "Subscriber"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");

-- CreateIndex
CREATE INDEX "Metric_clientId_fecha_idx" ON "Metric"("clientId", "fecha");

-- CreateIndex
CREATE INDEX "Metric_clientId_canal_nombre_idx" ON "Metric"("clientId", "canal", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");
