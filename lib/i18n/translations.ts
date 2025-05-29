export type Locale = "de" | "en"

export type TranslationKey =
  | "common.welcome"
  | "common.login"
  | "common.register"
  | "common.logout"
  | "common.save"
  | "common.cancel"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "common.back"
  | "common.next"
  | "common.finish"
  | "common.search"
  | "common.filter"
  | "common.sort"
  | "common.all"
  | "common.none"
  | "common.yes"
  | "common.no"
  | "common.or"
  | "common.and"
  | "common.email"
  | "common.password"
  | "common.username"
  | "common.profile"
  | "common.settings"
  | "common.help"
  | "common.feedback"
  | "common.share"
  | "common.edit"
  | "common.delete"
  | "common.create"
  | "common.update"
  | "common.view"
  | "common.more"
  | "common.less"
  | "common.show"
  | "common.hide"
  | "common.open"
  | "common.close"
  | "common.add"
  | "common.remove"
  | "common.submit"
  | "common.reset"
  | "common.continue"
  | "common.skip"
  | "common.done"
  | "common.complete"
  | "common.incomplete"
  | "common.required"
  | "common.optional"
  | "common.enabled"
  | "common.disabled"
  | "common.active"
  | "common.inactive"
  | "common.public"
  | "common.private"
  | "common.friends"
  | "common.groups"
  | "common.notifications"
  | "common.messages"
  | "common.experiences"
  | "common.discover"
  | "common.dashboard"
  | "common.settings"
  | "common.profile"
  | "common.account"
  | "common.privacy"
  | "common.appearance"
  | "common.language"
  | "common.theme"
  | "common.dark"
  | "common.light"
  | "common.system"
  | "auth.login"
  | "auth.register"
  | "auth.logout"
  | "auth.forgotPassword"
  | "auth.resetPassword"
  | "auth.confirmPassword"
  | "auth.changePassword"
  | "auth.loginSuccess"
  | "auth.loginError"
  | "auth.registerSuccess"
  | "auth.registerError"
  | "auth.logoutSuccess"
  | "auth.logoutError"
  | "auth.resetPasswordSuccess"
  | "auth.resetPasswordError"
  | "auth.changePasswordSuccess"
  | "auth.changePasswordError"
  | "auth.emailRequired"
  | "auth.emailInvalid"
  | "auth.passwordRequired"
  | "auth.passwordTooShort"
  | "auth.passwordsDoNotMatch"
  | "auth.usernameRequired"
  | "auth.usernameTooShort"
  | "auth.acceptTerms"
  | "auth.acceptTermsRequired"
  | "auth.alreadyHaveAccount"
  | "auth.dontHaveAccount"
  | "auth.resetPasswordLink"
  | "auth.resetPasswordLinkSent"
  | "auth.resetPasswordLinkError"
  | "auth.invalidResetLink"
  | "profile.edit"
  | "profile.save"
  | "profile.cancel"
  | "profile.updateSuccess"
  | "profile.updateError"
  | "profile.deleteAccount"
  | "profile.deleteAccountConfirm"
  | "profile.deleteAccountSuccess"
  | "profile.deleteAccountError"
  | "profile.avatar"
  | "profile.changeAvatar"
  | "profile.uploadAvatar"
  | "profile.removeAvatar"
  | "profile.bio"
  | "profile.website"
  | "profile.location"
  | "profile.joinedDate"
  | "profile.experiences"
  | "profile.friends"
  | "profile.groups"
  | "profile.achievements"
  | "profile.stats"
  | "profile.bookmarks"
  | "profile.comments"
  | "settings.account"
  | "settings.privacy"
  | "settings.notifications"
  | "settings.appearance"
  | "settings.language"
  | "settings.theme"
  | "settings.email"
  | "settings.password"
  | "settings.username"
  | "settings.profileVisibility"
  | "settings.experienceVisibility"
  | "settings.locationInfo"
  | "settings.profileSearch"
  | "settings.emailNotifications"
  | "settings.pushNotifications"
  | "settings.newComments"
  | "settings.friendRequests"
  | "settings.groupActivities"
  | "settings.systemUpdates"
  | "settings.darkMode"
  | "settings.colorScheme"
  | "settings.fontSize"
  | "settings.reduceAnimations"
  | "settings.dataExport"
  | "settings.exportData"
  | "settings.deleteAccount"
  | "settings.deleteAccountWarning"
  | "experience.create"
  | "experience.edit"
  | "experience.delete"
  | "experience.share"
  | "experience.view"
  | "experience.title"
  | "experience.description"
  | "experience.date"
  | "experience.location"
  | "experience.category"
  | "experience.tags"
  | "experience.media"
  | "experience.privacy"
  | "experience.comments"
  | "experience.likes"
  | "experience.bookmarks"
  | "experience.shares"
  | "experience.similar"
  | "experience.related"
  | "experience.createSuccess"
  | "experience.createError"
  | "experience.updateSuccess"
  | "experience.updateError"
  | "experience.deleteSuccess"
  | "experience.deleteError"
  | "experience.shareSuccess"
  | "experience.shareError"
  | "experience.bookmarkSuccess"
  | "experience.bookmarkError"
  | "experience.unbookmarkSuccess"
  | "experience.unbookmarkError"
  | "experience.likeSuccess"
  | "experience.likeError"
  | "experience.unlikeSuccess"
  | "experience.unlikeError"
  | "experience.commentSuccess"
  | "experience.commentError"
  | "experience.deleteCommentSuccess"
  | "experience.deleteCommentError"
  | "experience.editCommentSuccess"
  | "experience.editCommentError"
  | "experience.noExperiences"
  | "experience.noComments"
  | "experience.noTags"
  | "experience.noMedia"
  | "experience.noLocation"
  | "experience.noDate"
  | "experience.noCategory"
  | "experience.noDescription"
  | "experience.noTitle"
  | "experience.noSimilar"
  | "experience.noRelated"
  | "experience.addMedia"
  | "experience.addTags"
  | "experience.addLocation"
  | "experience.addDate"
  | "experience.addCategory"
  | "experience.addDescription"
  | "experience.addTitle"
  | "experience.addComment"
  | "experience.editComment"
  | "experience.deleteComment"
  | "experience.confirmDeleteComment"
  | "experience.confirmDelete"
  | "experience.confirmDeleteWarning"
  | "discover.title"
  | "discover.subtitle"
  | "discover.search"
  | "discover.filter"
  | "discover.sort"
  | "discover.categories"
  | "discover.locations"
  | "discover.dates"
  | "discover.tags"
  | "discover.users"
  | "discover.groups"
  | "discover.noResults"
  | "discover.tryAgain"
  | "discover.clearFilters"
  | "discover.loading"
  | "discover.error"
  | "discover.retry"
  | "discover.showMore"
  | "discover.showLess"
  | "discover.map"
  | "discover.list"
  | "discover.grid"
  | "discover.timeline"
  | "discover.newest"
  | "discover.oldest"
  | "discover.popular"
  | "discover.trending"
  | "discover.recommended"
  | "discover.nearby"
  | "discover.friends"
  | "discover.all"
  | "dashboard.welcome"
  | "dashboard.recentExperiences"
  | "dashboard.sharedWithMe"
  | "dashboard.activityFeed"
  | "dashboard.insights"
  | "dashboard.trends"
  | "dashboard.stats"
  | "dashboard.quests"
  | "dashboard.achievements"
  | "dashboard.leaderboard"
  | "dashboard.friends"
  | "dashboard.groups"
  | "dashboard.messages"
  | "dashboard.notifications"
  | "dashboard.settings"
  | "dashboard.help"
  | "dashboard.feedback"
  | "dashboard.logout"
  | "dashboard.noRecentExperiences"
  | "dashboard.noSharedExperiences"
  | "dashboard.noActivity"
  | "dashboard.noInsights"
  | "dashboard.noTrends"
  | "dashboard.noStats"
  | "dashboard.noQuests"
  | "dashboard.noAchievements"
  | "dashboard.noFriends"
  | "dashboard.noGroups"
  | "dashboard.noMessages"
  | "dashboard.noNotifications"
  | "onboarding.welcome"
  | "onboarding.profile"
  | "onboarding.experiences"
  | "onboarding.sharing"
  | "onboarding.discovering"
  | "onboarding.settings"
  | "onboarding.complete"
  | "onboarding.next"
  | "onboarding.back"
  | "onboarding.skip"
  | "onboarding.finish"
  | "onboarding.step1Title"
  | "onboarding.step1Description"
  | "onboarding.step2Title"
  | "onboarding.step2Description"
  | "onboarding.step3Title"
  | "onboarding.step3Description"
  | "onboarding.step4Title"
  | "onboarding.step4Description"
  | "onboarding.completeTitle"
  | "onboarding.completeDescription"
  | "feedback.title"
  | "feedback.description"
  | "feedback.type"
  | "feedback.suggestion"
  | "feedback.issue"
  | "feedback.praise"
  | "feedback.text"
  | "feedback.submit"
  | "feedback.cancel"
  | "feedback.success"
  | "feedback.error"
  | "feedback.required"
  | "help.title"
  | "help.search"
  | "help.categories"
  | "help.faq"
  | "help.guides"
  | "help.contact"
  | "help.support"
  | "help.noResults"
  | "help.tryAgain"
  | "help.loading"
  | "help.error"
  | "help.retry"
  | "help.showMore"
  | "help.showLess"
  | "help.back"
  | "help.next"
  | "help.previous"
  | "help.relatedArticles"
  | "help.wasHelpful"
  | "help.yes"
  | "help.no"
  | "help.feedback"
  | "help.contactUs"
  | "help.email"
  | "help.phone"
  | "help.chat"
  | "help.hours"
  | "help.response"
  | "help.submit"
  | "help.cancel"
  | "help.success"
  | "help.error"
  | "help.required"

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  de: {
    "common.welcome": "Willkommen",
    "common.login": "Anmelden",
    "common.register": "Registrieren",
    "common.logout": "Abmelden",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.loading": "Wird geladen...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    "common.back": "Zurück",
    "common.next": "Weiter",
    "common.finish": "Fertig",
    "common.search": "Suchen",
    "common.filter": "Filtern",
    "common.sort": "Sortieren",
    "common.all": "Alle",
    "common.none": "Keine",
    "common.yes": "Ja",
    "common.no": "Nein",
    "common.or": "oder",
    "common.and": "und",
    "common.email": "E-Mail",
    "common.password": "Passwort",
    "common.username": "Benutzername",
    "common.profile": "Profil",
    "common.settings": "Einstellungen",
    "common.help": "Hilfe",
    "common.feedback": "Feedback",
    "common.share": "Teilen",
    "common.edit": "Bearbeiten",
    "common.delete": "Löschen",
    "common.create": "Erstellen",
    "common.update": "Aktualisieren",
    "common.view": "Ansehen",
    "common.more": "Mehr",
    "common.less": "Weniger",
    "common.show": "Anzeigen",
    "common.hide": "Ausblenden",
    "common.open": "Öffnen",
    "common.close": "Schließen",
    "common.add": "Hinzufügen",
    "common.remove": "Entfernen",
    "common.submit": "Absenden",
    "common.reset": "Zurücksetzen",
    "common.continue": "Fortfahren",
    "common.skip": "Überspringen",
    "common.done": "Fertig",
    "common.complete": "Vollständig",
    "common.incomplete": "Unvollständig",
    "common.required": "Erforderlich",
    "common.optional": "Optional",
    "common.enabled": "Aktiviert",
    "common.disabled": "Deaktiviert",
    "common.active": "Aktiv",
    "common.inactive": "Inaktiv",
    "common.public": "Öffentlich",
    "common.private": "Privat",
    "common.friends": "Freunde",
    "common.groups": "Gruppen",
    "common.notifications": "Benachrichtigungen",
    "common.messages": "Nachrichten",
    "common.experiences": "Erlebnisse",
    "common.discover": "Entdecken",
    "common.dashboard": "Dashboard",
    "common.settings": "Einstellungen",
    "common.profile": "Profil",
    "common.account": "Konto",
    "common.privacy": "Privatsphäre",
    "common.appearance": "Erscheinungsbild",
    "common.language": "Sprache",
    "common.theme": "Thema",
    "common.dark": "Dunkel",
    "common.light": "Hell",
    "common.system": "System",
    "auth.login": "Anmelden",
    "auth.register": "Registrieren",
    "auth.logout": "Abmelden",
    "auth.forgotPassword": "Passwort vergessen",
    "auth.resetPassword": "Passwort zurücksetzen",
    "auth.confirmPassword": "Passwort bestätigen",
    "auth.changePassword": "Passwort ändern",
    "auth.loginSuccess": "Anmeldung erfolgreich",
    "auth.loginError": "Anmeldung fehlgeschlagen",
    "auth.registerSuccess": "Registrierung erfolgreich",
    "auth.registerError": "Registrierung fehlgeschlagen",
    "auth.logoutSuccess": "Abmeldung erfolgreich",
    "auth.logoutError": "Abmeldung fehlgeschlagen",
    "auth.resetPasswordSuccess": "Passwort zurückgesetzt",
    "auth.resetPasswordError": "Passwort zurücksetzen fehlgeschlagen",
    "auth.changePasswordSuccess": "Passwort geändert",
    "auth.changePasswordError": "Passwort ändern fehlgeschlagen",
    "auth.emailRequired": "E-Mail ist erforderlich",
    "auth.emailInvalid": "Ungültige E-Mail-Adresse",
    "auth.passwordRequired": "Passwort ist erforderlich",
    "auth.passwordTooShort": "Passwort muss mindestens 8 Zeichen lang sein",
    "auth.passwordsDoNotMatch": "Passwörter stimmen nicht überein",
    "auth.usernameRequired": "Benutzername ist erforderlich",
    "auth.usernameTooShort": "Benutzername muss mindestens 3 Zeichen lang sein",
    "auth.acceptTerms": "Ich akzeptiere die Nutzungsbedingungen und Datenschutzrichtlinien",
    "auth.acceptTermsRequired": "Du musst die Nutzungsbedingungen akzeptieren",
    "auth.alreadyHaveAccount": "Bereits ein Konto?",
    "auth.dontHaveAccount": "Noch kein Konto?",
    "auth.resetPasswordLink": "Link zum Zurücksetzen des Passworts senden",
    "auth.resetPasswordLinkSent": "Ein Link zum Zurücksetzen des Passworts wurde gesendet",
    "auth.resetPasswordLinkError": "Fehler beim Senden des Links",
    "auth.invalidResetLink": "Ungültiger Link zum Zurücksetzen des Passworts",
    "profile.edit": "Profil bearbeiten",
    "profile.save": "Profil speichern",
    "profile.cancel": "Abbrechen",
    "profile.updateSuccess": "Profil aktualisiert",
    "profile.updateError": "Fehler beim Aktualisieren des Profils",
    "profile.deleteAccount": "Konto löschen",
    "profile.deleteAccountConfirm": "Bist du sicher, dass du dein Konto löschen möchtest?",
    "profile.deleteAccountSuccess": "Konto gelöscht",
    "profile.deleteAccountError": "Fehler beim Löschen des Kontos",
    "profile.avatar": "Profilbild",
    "profile.changeAvatar": "Profilbild ändern",
    "profile.uploadAvatar": "Profilbild hochladen",
    "profile.removeAvatar": "Profilbild entfernen",
    "profile.bio": "Über mich",
    "profile.website": "Website",
    "profile.location": "Standort",
    "profile.joinedDate": "Beigetreten am",
    "profile.experiences": "Erlebnisse",
    "profile.friends": "Freunde",
    "profile.groups": "Gruppen",
    "profile.achievements": "Erfolge",
    "profile.stats": "Statistiken",
    "profile.bookmarks": "Lesezeichen",
    "profile.comments": "Kommentare",
    "settings.account": "Konto",
    "settings.privacy": "Privatsphäre",
    "settings.notifications": "Benachrichtigungen",
    "settings.appearance": "Erscheinungsbild",
    "settings.language": "Sprache",
    "settings.theme": "Thema",
    "settings.email": "E-Mail",
    "settings.password": "Passwort",
    "settings.username": "Benutzername",
    "settings.profileVisibility": "Profilsichtbarkeit",
    "settings.experienceVisibility": "Erlebnissichtbarkeit",
    "settings.locationInfo": "Standortinformationen",
    "settings.profileSearch": "Profilsuche",
    "settings.emailNotifications": "E-Mail-Benachrichtigungen",
    "settings.pushNotifications": "Push-Benachrichtigungen",
    "settings.newComments": "Neue Kommentare",
    "settings.friendRequests": "Freundschaftsanfragen",
    "settings.groupActivities": "Gruppenaktivitäten",
    "settings.systemUpdates": "System-Updates",
    "settings.darkMode": "Dunkelmodus",
    "settings.colorScheme": "Farbschema",
    "settings.fontSize": "Schriftgröße",
    "settings.reduceAnimations": "Animationen reduzieren",
    "settings.dataExport": "Datenexport",
    "settings.exportData": "Daten exportieren",
    "settings.deleteAccount": "Konto löschen",
    "settings.deleteAccountWarning": "Diese Aktion kann nicht rückgängig gemacht werden",
    "experience.create": "Erlebnis erstellen",
    "experience.edit": "Erlebnis bearbeiten",
    "experience.delete": "Erlebnis löschen",
    "experience.share": "Erlebnis teilen",
    "experience.view": "Erlebnis ansehen",
    "experience.title": "Titel",
    "experience.description": "Beschreibung",
    "experience.date": "Datum",
    "experience.location": "Ort",
    "experience.category": "Kategorie",
    "experience.tags": "Tags",
    "experience.media": "Medien",
    "experience.privacy": "Privatsphäre",
    "experience.comments": "Kommentare",
    "experience.likes": "Likes",
    "experience.bookmarks": "Lesezeichen",
    "experience.shares": "Geteilt",
    "experience.similar": "Ähnliche Erlebnisse",
    "experience.related": "Verwandte Erlebnisse",
    "experience.createSuccess": "Erlebnis erstellt",
    "experience.createError": "Fehler beim Erstellen des Erlebnisses",
    "experience.updateSuccess": "Erlebnis aktualisiert",
    "experience.updateError": "Fehler beim Aktualisieren des Erlebnisses",
    "experience.deleteSuccess": "Erlebnis gelöscht",
    "experience.deleteError": "Fehler beim Löschen des Erlebnisses",
    "experience.shareSuccess": "Erlebnis geteilt",
    "experience.shareError": "Fehler beim Teilen des Erlebnisses",
    "experience.bookmarkSuccess": "Lesezeichen hinzugefügt",
    "experience.bookmarkError": "Fehler beim Hinzufügen des Lesezeichens",
    "experience.unbookmarkSuccess": "Lesezeichen entfernt",
    "experience.unbookmarkError": "Fehler beim Entfernen des Lesezeichens",
    "experience.likeSuccess": "Erlebnis gefällt dir",
    "experience.likeError": "Fehler beim Liken des Erlebnisses",
    "experience.unlikeSuccess": "Like entfernt",
    "experience.unlikeError": "Fehler beim Entfernen des Likes",
    "experience.commentSuccess": "Kommentar hinzugefügt",
    "experience.commentError": "Fehler beim Hinzufügen des Kommentars",
    "experience.deleteCommentSuccess": "Kommentar gelöscht",
    "experience.deleteCommentError": "Fehler beim Löschen des Kommentars",
    "experience.editCommentSuccess": "Kommentar bearbeitet",
    "experience.editCommentError": "Fehler beim Bearbeiten des Kommentars",
    "experience.noExperiences": "Keine Erlebnisse",
    "experience.noComments": "Keine Kommentare",
    "experience.noTags": "Keine Tags",
    "experience.noMedia": "Keine Medien",
    "experience.noLocation": "Kein Ort",
    "experience.noDate": "Kein Datum",
    "experience.noCategory": "Keine Kategorie",
    "experience.noDescription": "Keine Beschreibung",
    "experience.noTitle": "Kein Titel",
    "experience.noSimilar": "Keine ähnlichen Erlebnisse",
    "experience.noRelated": "Keine verwandten Erlebnisse",
    "experience.addMedia": "Medien hinzufügen",
    "experience.addTags": "Tags hinzufügen",
    "experience.addLocation": "Ort hinzufügen",
    "experience.addDate": "Datum hinzufügen",
    "experience.addCategory": "Kategorie hinzufügen",
    "experience.addDescription": "Beschreibung hinzufügen",
    "experience.addTitle": "Titel hinzufügen",
    "experience.addComment": "Kommentar hinzufügen",
    "experience.editComment": "Kommentar bearbeiten",
    "experience.deleteComment": "Kommentar löschen",
    "experience.confirmDeleteComment": "Möchtest du diesen Kommentar wirklich löschen?",
    "experience.confirmDelete": "Erlebnis löschen bestätigen",
    "experience.confirmDeleteWarning": "Diese Aktion kann nicht rückgängig gemacht werden",
    "discover.title": "Entdecken",
    "discover.subtitle": "Entdecke neue Erlebnisse",
    "discover.search": "Suchen",
    "discover.filter": "Filtern",
    "discover.sort": "Sortieren",
    "discover.categories": "Kategorien",
    "discover.locations": "Orte",
    "discover.dates": "Daten",
    "discover.tags": "Tags",
    "discover.users": "Benutzer",
    "discover.groups": "Gruppen",
    "discover.noResults": "Keine Ergebnisse",
    "discover.tryAgain": "Versuche es erneut",
    "discover.clearFilters": "Filter zurücksetzen",
    "discover.loading": "Wird geladen...",
    "discover.error": "Fehler beim Laden",
    "discover.retry": "Erneut versuchen",
    "discover.showMore": "Mehr anzeigen",
    "discover.showLess": "Weniger anzeigen",
    "discover.map": "Karte",
    "discover.list": "Liste",
    "discover.grid": "Raster",
    "discover.timeline": "Zeitstrahl",
    "discover.newest": "Neueste",
    "discover.oldest": "Älteste",
    "discover.popular": "Beliebt",
    "discover.trending": "Trending",
    "discover.recommended": "Empfohlen",
    "discover.nearby": "In der Nähe",
    "discover.friends": "Freunde",
    "discover.all": "Alle",
    "dashboard.welcome": "Willkommen",
    "dashboard.recentExperiences": "Neueste Erlebnisse",
    "dashboard.sharedWithMe": "Mit mir geteilt",
    "dashboard.activityFeed": "Aktivitäten",
    "dashboard.insights": "Einblicke",
    "dashboard.trends": "Trends",
    "dashboard.stats": "Statistiken",
    "dashboard.quests": "Quests",
    "dashboard.achievements": "Erfolge",
    "dashboard.leaderboard": "Bestenliste",
    "dashboard.friends": "Freunde",
    "dashboard.groups": "Gruppen",
    "dashboard.messages": "Nachrichten",
    "dashboard.notifications": "Benachrichtigungen",
    "dashboard.settings": "Einstellungen",
    "dashboard.help": "Hilfe",
    "dashboard.feedback": "Feedback",
    "dashboard.logout": "Abmelden",
    "dashboard.noRecentExperiences": "Keine neuesten Erlebnisse",
    "dashboard.noSharedExperiences": "Keine geteilten Erlebnisse",
    "dashboard.noActivity": "Keine Aktivitäten",
    "dashboard.noInsights": "Keine Einblicke",
    "dashboard.noTrends": "Keine Trends",
    "dashboard.noStats": "Keine Statistiken",
    "dashboard.noQuests": "Keine Quests",
    "dashboard.noAchievements": "Keine Erfolge",
    "dashboard.noFriends": "Keine Freunde",
    "dashboard.noGroups": "Keine Gruppen",
    "dashboard.noMessages": "Keine Nachrichten",
    "dashboard.noNotifications": "Keine Benachrichtigungen",
    "onboarding.welcome": "Willkommen bei XP-Share",
    "onboarding.profile": "Profil erstellen",
    "onboarding.experiences": "Erlebnisse dokumentieren",
    "onboarding.sharing": "Teilen und Entdecken",
    "onboarding.discovering": "Entdecken",
    "onboarding.settings": "Einstellungen",
    "onboarding.complete": "Fertig",
    "onboarding.next": "Weiter",
    "onboarding.back": "Zurück",
    "onboarding.skip": "Überspringen",
    "onboarding.finish": "Fertig",
    "onboarding.step1Title": "Willkommen bei XP-Share",
    "onboarding.step1Description": "Entdecke, wie du deine Erlebnisse teilen und von anderen lernen kannst.",
    "onboarding.step2Title": "Dein erstes Erlebnis",
    "onboarding.step2Description": "Lerne, wie du ein Erlebnis dokumentierst und teilst.",
    "onboarding.step3Title": "Deine Einstellungen",
    "onboarding.step3Description": "Passe XP-Share an deine Bedürfnisse an.",
    "onboarding.step4Title": "Entdecken",
    "onboarding.step4Description": "Finde neue Erlebnisse und Gleichgesinnte.",
    "onboarding.completeTitle": "Bereit zum Starten!",
    "onboarding.completeDescription": "Du bist jetzt bereit, XP-Share zu nutzen.",
    "feedback.title": "Feedback geben",
    "feedback.description": "Teile uns deine Gedanken mit, um XP-Share zu verbessern.",
    "feedback.type": "Feedback-Typ",
    "feedback.suggestion": "Vorschlag",
    "feedback.issue": "Problem",
    "feedback.praise": "Lob",
    "feedback.text": "Dein Feedback",
    "feedback.submit": "Feedback senden",
    "feedback.cancel": "Abbrechen",
    "feedback.success": "Feedback gesendet",
    "feedback.error": "Fehler beim Senden des Feedbacks",
    "feedback.required": "Feedback ist erforderlich",
    "help.title": "Hilfe & Support",
    "help.search": "Suchen",
    "help.categories": "Kategorien",
    "help.faq": "Häufig gestellte Fragen",
    "help.guides": "Anleitungen",
    "help.contact": "Kontakt",
    "help.support": "Support",
    "help.noResults": "Keine Ergebnisse",
    "help.tryAgain": "Versuche es erneut",
    "help.loading": "Wird geladen...",
    "help.error": "Fehler beim Laden",
    "help.retry": "Erneut versuchen",
    "help.showMore": "Mehr anzeigen",
    "help.showLess": "Weniger anzeigen",
    "help.back": "Zurück",
    "help.next": "Weiter",
    "help.previous": "Zurück",
    "help.relatedArticles": "Verwandte Artikel",
    "help.wasHelpful": "War dieser Artikel hilfreich?",
    "help.yes": "Ja",
    "help.no": "Nein",
    "help.feedback": "Feedback",
    "help.contactUs": "Kontaktiere uns",
    "help.email": "E-Mail",
    "help.phone": "Telefon",
    "help.chat": "Chat",
    "help.hours": "Öffnungszeiten",
    "help.response": "Antwortzeit",
    "help.submit": "Absenden",
    "help.cancel": "Abbrechen",
    "help.success": "Erfolgreich gesendet",
    "help.error": "Fehler beim Senden",
    "help.required": "Erforderlich",
  },
  en: {
    "common.welcome": "Welcome",
    "common.login": "Login",
    "common.register": "Register",
    "common.logout": "Logout",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.back": "Back",
    "common.next": "Next",
    "common.finish": "Finish",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.all": "All",
    "common.none": "None",
    "common.yes": "Yes",
    "common.no": "No",
    "common.or": "or",
    "common.and": "and",
    "common.email": "Email",
    "common.password": "Password",
    "common.username": "Username",
    "common.profile": "Profile",
    "common.settings": "Settings",
    "common.help": "Help",
    "common.feedback": "Feedback",
    "common.share": "Share",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.create": "Create",
    "common.update": "Update",
    "common.view": "View",
    "common.more": "More",
    "common.less": "Less",
    "common.show": "Show",
    "common.hide": "Hide",
    "common.open": "Open",
    "common.close": "Close",
    "common.add": "Add",
    "common.remove": "Remove",
    "common.submit": "Submit",
    "common.reset": "Reset",
    "common.continue": "Continue",
    "common.skip": "Skip",
    "common.done": "Done",
    "common.complete": "Complete",
    "common.incomplete": "Incomplete",
    "common.required": "Required",
    "common.optional": "Optional",
    "common.enabled": "Enabled",
    "common.disabled": "Disabled",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.public": "Public",
    "common.private": "Private",
    "common.friends": "Friends",
    "common.groups": "Groups",
    "common.notifications": "Notifications",
    "common.messages": "Messages",
    "common.experiences": "Experiences",
    "common.discover": "Discover",
    "common.dashboard": "Dashboard",
    "common.settings": "Settings",
    "common.profile": "Profile",
    "common.account": "Account",
    "common.privacy": "Privacy",
    "common.appearance": "Appearance",
    "common.language": "Language",
    "common.theme": "Theme",
    "common.dark": "Dark",
    "common.light": "Light",
    "common.system": "System",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "auth.forgotPassword": "Forgot Password",
    "auth.resetPassword": "Reset Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.changePassword": "Change Password",
    "auth.loginSuccess": "Login successful",
    "auth.loginError": "Login failed",
    "auth.registerSuccess": "Registration successful",
    "auth.registerError": "Registration failed",
    "auth.logoutSuccess": "Logout successful",
    "auth.logoutError": "Logout failed",
    "auth.resetPasswordSuccess": "Password reset successful",
    "auth.resetPasswordError": "Password reset failed",
    "auth.changePasswordSuccess": "Password changed",
    "auth.changePasswordError": "Password change failed",
    "auth.emailRequired": "Email is required",
    "auth.emailInvalid": "Invalid email address",
    "auth.passwordRequired": "Password is required",
    "auth.passwordTooShort": "Password must be at least 8 characters long",
    "auth.passwordsDoNotMatch": "Passwords do not match",
    "auth.usernameRequired": "Username is required",
    "auth.usernameTooShort": "Username must be at least 3 characters long",
    "auth.acceptTerms": "I accept the Terms of Service and Privacy Policy",
    "auth.acceptTermsRequired": "You must accept the Terms of Service",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.dontHaveAccount": "Don't have an account?",
    "auth.resetPasswordLink": "Send password reset link",
    "auth.resetPasswordLinkSent": "A password reset link has been sent",
    "auth.resetPasswordLinkError": "Error sending reset link",
    "auth.invalidResetLink": "Invalid password reset link",
    "profile.edit": "Edit Profile",
    "profile.save": "Save Profile",
    "profile.cancel": "Cancel",
    "profile.updateSuccess": "Profile updated",
    "profile.updateError": "Error updating profile",
    "profile.deleteAccount": "Delete Account",
    "profile.deleteAccountConfirm": "Are you sure you want to delete your account?",
    "profile.deleteAccountSuccess": "Account deleted",
    "profile.deleteAccountError": "Error deleting account",
    "profile.avatar": "Avatar",
    "profile.changeAvatar": "Change Avatar",
    "profile.uploadAvatar": "Upload Avatar",
    "profile.removeAvatar": "Remove Avatar",
    "profile.bio": "Bio",
    "profile.website": "Website",
    "profile.location": "Location",
    "profile.joinedDate": "Joined",
    "profile.experiences": "Experiences",
    "profile.friends": "Friends",
    "profile.groups": "Groups",
    "profile.achievements": "Achievements",
    "profile.stats": "Stats",
    "profile.bookmarks": "Bookmarks",
    "profile.comments": "Comments",
    "settings.account": "Account",
    "settings.privacy": "Privacy",
    "settings.notifications": "Notifications",
    "settings.appearance": "Appearance",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.email": "Email",
    "settings.password": "Password",
    "settings.username": "Username",
    "settings.profileVisibility": "Profile Visibility",
    "settings.experienceVisibility": "Experience Visibility",
    "settings.locationInfo": "Location Information",
    "settings.profileSearch": "Profile Search",
    "settings.emailNotifications": "Email Notifications",
    "settings.pushNotifications": "Push Notifications",
    "settings.newComments": "New Comments",
    "settings.friendRequests": "Friend Requests",
    "settings.groupActivities": "Group Activities",
    "settings.systemUpdates": "System Updates",
    "settings.darkMode": "Dark Mode",
    "settings.colorScheme": "Color Scheme",
    "settings.fontSize": "Font Size",
    "settings.reduceAnimations": "Reduce Animations",
    "settings.dataExport": "Data Export",
    "settings.exportData": "Export Data",
    "settings.deleteAccount": "Delete Account",
    "settings.deleteAccountWarning": "This action cannot be undone",
    "experience.create": "Create Experience",
    "experience.edit": "Edit Experience",
    "experience.delete": "Delete Experience",
    "experience.share": "Share Experience",
    "experience.view": "View Experience",
    "experience.title": "Title",
    "experience.description": "Description",
    "experience.date": "Date",
    "experience.location": "Location",
    "experience.category": "Category",
    "experience.tags": "Tags",
    "experience.media": "Media",
    "experience.privacy": "Privacy",
    "experience.comments": "Comments",
    "experience.likes": "Likes",
    "experience.bookmarks": "Bookmarks",
    "experience.shares": "Shares",
    "experience.similar": "Similar Experiences",
    "experience.related": "Related Experiences",
    "experience.createSuccess": "Experience created",
    "experience.createError": "Error creating experience",
    "experience.updateSuccess": "Experience updated",
    "experience.updateError": "Error updating experience",
    "experience.deleteSuccess": "Experience deleted",
    "experience.deleteError": "Error deleting experience",
    "experience.shareSuccess": "Experience shared",
    "experience.shareError": "Error sharing experience",
    "experience.bookmarkSuccess": "Bookmark added",
    "experience.bookmarkError": "Error adding bookmark",
    "experience.unbookmarkSuccess": "Bookmark removed",
    "experience.unbookmarkError": "Error removing bookmark",
    "experience.likeSuccess": "Experience liked",
    "experience.likeError": "Error liking experience",
    "experience.unlikeSuccess": "Like removed",
    "experience.unlikeError": "Error removing like",
    "experience.commentSuccess": "Comment added",
    "experience.commentError": "Error adding comment",
    "experience.deleteCommentSuccess": "Comment deleted",
    "experience.deleteCommentError": "Error deleting comment",
    "experience.editCommentSuccess": "Comment edited",
    "experience.editCommentError": "Error editing comment",
    "experience.noExperiences": "No experiences",
    "experience.noComments": "No comments",
    "experience.noTags": "No tags",
    "experience.noMedia": "No media",
    "experience.noLocation": "No location",
    "experience.noDate": "No date",
    "experience.noCategory": "No category",
    "experience.noDescription": "No description",
    "experience.noTitle": "No title",
    "experience.noSimilar": "No similar experiences",
    "experience.noRelated": "No related experiences",
    "experience.addMedia": "Add media",
    "experience.addTags": "Add tags",
    "experience.addLocation": "Add location",
    "experience.addDate": "Add date",
    "experience.addCategory": "Add category",
    "experience.addDescription": "Add description",
    "experience.addTitle": "Add title",
    "experience.addComment": "Add comment",
    "experience.editComment": "Edit comment",
    "experience.deleteComment": "Delete comment",
    "experience.confirmDeleteComment": "Are you sure you want to delete this comment?",
    "experience.confirmDelete": "Confirm delete experience",
    "experience.confirmDeleteWarning": "This action cannot be undone",
    "discover.title": "Discover",
    "discover.subtitle": "Discover new experiences",
    "discover.search": "Search",
    "discover.filter": "Filter",
    "discover.sort": "Sort",
    "discover.categories": "Categories",
    "discover.locations": "Locations",
    "discover.dates": "Dates",
    "discover.tags": "Tags",
    "discover.users": "Users",
    "discover.groups": "Groups",
    "discover.noResults": "No results",
    "discover.tryAgain": "Try again",
    "discover.clearFilters": "Clear filters",
    "discover.loading": "Loading...",
    "discover.error": "Error loading",
    "discover.retry": "Retry",
    "discover.showMore": "Show more",
    "discover.showLess": "Show less",
    "discover.map": "Map",
    "discover.list": "List",
    "discover.grid": "Grid",
    "discover.timeline": "Timeline",
    "discover.newest": "Newest",
    "discover.oldest": "Oldest",
    "discover.popular": "Popular",
    "discover.trending": "Trending",
    "discover.recommended": "Recommended",
    "discover.nearby": "Nearby",
    "discover.friends": "Friends",
    "discover.all": "All",
    "dashboard.welcome": "Welcome",
    "dashboard.recentExperiences": "Recent Experiences",
    "dashboard.sharedWithMe": "Shared With Me",
    "dashboard.activityFeed": "Activity Feed",
    "dashboard.insights": "Insights",
    "dashboard.trends": "Trends",
    "dashboard.stats": "Stats",
    "dashboard.quests": "Quests",
    "dashboard.achievements": "Achievements",
    "dashboard.leaderboard": "Leaderboard",
    "dashboard.friends": "Friends",
    "dashboard.groups": "Groups",
    "dashboard.messages": "Messages",
    "dashboard.notifications": "Notifications",
    "dashboard.settings": "Settings",
    "dashboard.help": "Help",
    "dashboard.feedback": "Feedback",
    "dashboard.logout": "Logout",
    "dashboard.noRecentExperiences": "No recent experiences",
    "dashboard.noSharedExperiences": "No shared experiences",
    "dashboard.noActivity": "No activity",
    "dashboard.noInsights": "No insights",
    "dashboard.noTrends": "No trends",
    "dashboard.noStats": "No stats",
    "dashboard.noQuests": "No quests",
    "dashboard.noAchievements": "No achievements",
    "dashboard.noFriends": "No friends",
    "dashboard.noGroups": "No groups",
    "dashboard.noMessages": "No messages",
    "dashboard.noNotifications": "No notifications",
    "onboarding.welcome": "Welcome to XP-Share",
    "onboarding.profile": "Create Profile",
    "onboarding.experiences": "Document Experiences",
    "onboarding.sharing": "Sharing and Discovering",
    "onboarding.discovering": "Discover",
    "onboarding.settings": "Settings",
    "onboarding.complete": "Complete",
    "onboarding.next": "Next",
    "onboarding.back": "Back",
    "onboarding.skip": "Skip",
    "onboarding.finish": "Finish",
    "onboarding.step1Title": "Welcome to XP-Share",
    "onboarding.step1Description": "Discover how to share your experiences and learn from others.",
    "onboarding.step2Title": "Your First Experience",
    "onboarding.step2Description": "Learn how to document and share an experience.",
    "onboarding.step3Title": "Your Settings",
    "onboarding.step3Description": "Customize XP-Share to your needs.",
    "onboarding.step4Title": "Discover",
    "onboarding.step4Description": "Find new experiences and like-minded people.",
    "onboarding.completeTitle": "Ready to Start!",
    "onboarding.completeDescription": "You are now ready to use XP-Share.",
    "feedback.title": "Give Feedback",
    "feedback.description": "Share your thoughts to help improve XP-Share.",
    "feedback.type": "Feedback Type",
    "feedback.suggestion": "Suggestion",
    "feedback.issue": "Issue",
    "feedback.praise": "Praise",
    "feedback.text": "Your Feedback",
    "feedback.submit": "Submit Feedback",
    "feedback.cancel": "Cancel",
    "feedback.success": "Feedback submitted",
    "feedback.error": "Error submitting feedback",
    "feedback.required": "Feedback is required",
    "help.title": "Help & Support",
    "help.search": "Search",
    "help.categories": "Categories",
    "help.faq": "FAQ",
    "help.guides": "Guides",
    "help.contact": "Contact",
    "help.support": "Support",
    "help.noResults": "No results",
    "help.tryAgain": "Try again",
    "help.loading": "Loading...",
    "help.error": "Error loading",
    "help.retry": "Retry",
    "help.showMore": "Show more",
    "help.showLess": "Show less",
    "help.back": "Back",
    "help.next": "Next",
    "help.previous": "Previous",
    "help.relatedArticles": "Related Articles",
    "help.wasHelpful": "Was this article helpful?",
    "help.yes": "Yes",
    "help.no": "No",
    "help.feedback": "Feedback",
    "help.contactUs": "Contact Us",
    "help.email": "Email",
    "help.phone": "Phone",
    "help.chat": "Chat",
    "help.hours": "Hours",
    "help.response": "Response Time",
    "help.submit": "Submit",
    "help.cancel": "Cancel",
    "help.success": "Successfully submitted",
    "help.error": "Error submitting",
    "help.required": "Required",
  },
}
