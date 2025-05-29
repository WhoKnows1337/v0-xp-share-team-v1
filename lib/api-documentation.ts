import type { NextApiRequest, NextApiResponse } from "next"

// OpenAPI Schema Definition
export const apiSchema = {
  openapi: "3.0.0",
  info: {
    title: "XP-Share API",
    version: "1.0.0",
    description: "API für die XP-Share Plattform zum Teilen von Erlebnissen",
    contact: {
      name: "XP-Share Team",
      email: "api@xp-share.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
      description: "Entwicklungsserver",
    },
  ],
  paths: {
    "/api/erlebnisse": {
      get: {
        summary: "Alle Erlebnisse abrufen",
        tags: ["Erlebnisse"],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Seitennummer für Paginierung",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20, maximum: 100 },
            description: "Anzahl der Ergebnisse pro Seite",
          },
          {
            name: "kategorie",
            in: "query",
            schema: { type: "string" },
            description: "Filterung nach Kategorie",
          },
        ],
        responses: {
          "200": {
            description: "Liste der Erlebnisse",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    erlebnisse: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Erlebnis" },
                    },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Neues Erlebnis erstellen",
        tags: ["Erlebnisse"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErlebnisInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Erlebnis erfolgreich erstellt",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Erlebnis" },
              },
            },
          },
        },
      },
    },
    "/api/benutzer/profil": {
      get: {
        summary: "Benutzerprofil abrufen",
        tags: ["Benutzer"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Benutzerprofil",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BenutzerProfil" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Erlebnis: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          titel: { type: "string", maxLength: 200 },
          beschreibung: { type: "string" },
          kategorie: { type: "string" },
          ort: { type: "string" },
          datum: { type: "string", format: "date-time" },
          bewertung: { type: "integer", minimum: 1, maximum: 5 },
          tags: { type: "array", items: { type: "string" } },
          erstellt_am: { type: "string", format: "date-time" },
          autor: { $ref: "#/components/schemas/BenutzerKurz" },
        },
        required: ["id", "titel", "kategorie", "datum", "erstellt_am", "autor"],
      },
      ErlebnisInput: {
        type: "object",
        properties: {
          titel: { type: "string", maxLength: 200 },
          beschreibung: { type: "string" },
          kategorie: { type: "string" },
          ort: { type: "string" },
          datum: { type: "string", format: "date-time" },
          bewertung: { type: "integer", minimum: 1, maximum: 5 },
          tags: { type: "array", items: { type: "string" } },
        },
        required: ["titel", "kategorie", "datum"],
      },
      BenutzerProfil: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          benutzername: { type: "string" },
          anzeigename: { type: "string" },
          bio: { type: "string" },
          avatar_url: { type: "string", format: "uri" },
          level: { type: "integer" },
          xp: { type: "integer" },
          erlebnisse_anzahl: { type: "integer" },
          registriert_am: { type: "string", format: "date-time" },
        },
      },
      BenutzerKurz: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          benutzername: { type: "string" },
          anzeigename: { type: "string" },
          avatar_url: { type: "string", format: "uri" },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" },
          pages: { type: "integer" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
          code: { type: "integer" },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
}

// API-Dokumentations-Endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(apiSchema)
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
