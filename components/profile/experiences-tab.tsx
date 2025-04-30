"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { ErlebnisKarte } from "@/components/entdecken/erlebnis-karte"
import type { User } from "@/lib/mock-users"

interface ExperiencesTabProps {
  user: User
  isOwner: boolean
}

export function ExperiencesTab({ user, isOwner }: ExperiencesTabProps) {
  const [viewMode, setViewMode] = useState<"all" | "drafts">("all")

  return (
    <div>
      {isOwner && (
        <div className="mb-6">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "all" | "drafts")}>
            <TabsList>
              <TabsTrigger value="all">Alle Erlebnisse</TabsTrigger>
              <TabsTrigger value="drafts">Entwürfe</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {viewMode === "all" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Geteilte Erlebnisse</h2>
            {isOwner && (
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Neues Erlebnis
              </Button>
            )}
          </div>

          {user.erlebnisse && user.erlebnisse.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.erlebnisse.map((erlebnis) => (
                <motion.div
                  key={erlebnis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ErlebnisKarte
                    erlebnis={{
                      id: erlebnis.id,
                      titel: erlebnis.titel,
                      kurzfassung: erlebnis.kurzfassung || "",
                      beschreibung: erlebnis.beschreibung || "",
                      datum: erlebnis.datum,
                      ort: erlebnis.ort || undefined,
                      kategorie: erlebnis.kategorie || {
                        name: "Allgemein",
                        icon: "FileText",
                        farbe: "#6B7280",
                      },
                      tags: erlebnis.tags || [],
                      medien: erlebnis.medien || [
                        {
                          id: `media-${erlebnis.id}`,
                          typ: "bild",
                          url: erlebnis.bild || "/placeholder.svg",
                        },
                      ],
                      autor: {
                        id: user.id,
                        name: user.username,
                        avatar: user.avatar,
                        isVerifiziert: user.isVerifiziert,
                      },
                      statistik: {
                        likes: erlebnis.likes || 0,
                        kommentare: erlebnis.kommentare || 0,
                        ansichten: erlebnis.ansichten || 0,
                      },
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Erlebnisse gefunden.</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Entwürfe</h2>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Neuer Entwurf
            </Button>
          </div>

          {user.entwuerfe && user.entwuerfe.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.entwuerfe.map((entwurf) => (
                <motion.div
                  key={entwurf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={entwurf.bild || "/placeholder.svg"}
                          alt={entwurf.titel}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center text-white">
                            <h3 className="font-semibold mb-2">{entwurf.titel}</h3>
                            <div className="flex justify-center gap-2">
                              <Button size="sm" variant="outline" className="text-white border-white">
                                <Edit className="h-4 w-4 mr-1" />
                                Bearbeiten
                              </Button>
                              <Button size="sm" variant="outline" className="text-white border-white">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Löschen
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Entwürfe gefunden.</p>
              <Button className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ersten Entwurf erstellen
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
