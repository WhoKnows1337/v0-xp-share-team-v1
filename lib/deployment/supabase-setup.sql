-- Erstelle die erforderlichen Tabellen für die Produktionsumgebung

-- Benutzer-Tabelle (erweitert die auth.users-Tabelle)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  streak_days INTEGER DEFAULT 0 NOT NULL,
  last_streak_date DATE,
  is_premium BOOLEAN DEFAULT false NOT NULL
);

-- Erlebnisse-Tabelle
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  location TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  date_start TIMESTAMP WITH TIME ZONE,
  date_end TIMESTAMP WITH TIME ZONE,
  emotions JSONB,
  media_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  privacy_level TEXT DEFAULT 'private' NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  comment_count INTEGER DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL
);

-- Gruppen-Tabelle
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  privacy_level TEXT DEFAULT 'private' NOT NULL,
  member_count INTEGER DEFAULT 0 NOT NULL,
  experience_count INTEGER DEFAULT 0 NOT NULL
);

-- Gruppenmitglieder-Tabelle
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Gruppen-Erlebnisse-Tabelle
CREATE TABLE IF NOT EXISTS public.group_experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(group_id, experience_id)
);

-- Kommentare-Tabelle
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  reply_count INTEGER DEFAULT 0 NOT NULL,
  CHECK ((experience_id IS NOT NULL AND group_id IS NULL) OR (experience_id IS NULL AND group_id IS NOT NULL))
);

-- Likes-Tabelle
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CHECK ((experience_id IS NOT NULL AND comment_id IS NULL) OR (experience_id IS NULL AND comment_id IS NOT NULL)),
  UNIQUE(user_id, experience_id, comment_id)
);

-- Lesezeichen-Tabelle
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, experience_id)
);

-- Nachrichten-Tabelle
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  media_url TEXT,
  CHECK ((recipient_id IS NOT NULL AND group_id IS NULL) OR (recipient_id IS NULL AND group_id IS NOT NULL))
);

-- Aktivitäten-Tabelle
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Achievements-Tabelle
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Benutzer-Achievements-Tabelle
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Quests-Tabelle
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  requirements JSONB NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_seasonal BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Benutzer-Quests-Tabelle
CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, quest_id)
);

-- Privatsphäre-Einstellungen-Tabelle
CREATE TABLE IF NOT EXISTS public.privacy_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, setting_key)
);

-- Temporäre Freigaben-Tabelle
CREATE TABLE IF NOT EXISTS public.temporary_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  access_count INTEGER DEFAULT 0 NOT NULL
);

-- Gesundheitscheck-Tabelle
CREATE TABLE IF NOT EXISTS public.health_check (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Erstelle Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON public.experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_tags ON public.experiences USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_experiences_location ON public.experiences(location);
CREATE INDEX IF NOT EXISTS idx_experiences_date_start ON public.experiences(date_start);
CREATE INDEX IF NOT EXISTS idx_experiences_privacy_level ON public.experiences(privacy_level);

CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_experience_id ON public.comments(experience_id);
CREATE INDEX IF NOT EXISTS idx_comments_group_id ON public.comments(group_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_experience_id ON public.likes(experience_id);
CREATE INDEX IF NOT EXISTS idx_likes_comment_id ON public.likes(comment_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_experience_id ON public.bookmarks(experience_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON public.messages(group_id);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_target_id ON public.activities(target_id);
CREATE INDEX IF NOT EXISTS idx_activities_target_type ON public.activities(target_type);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON public.user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_quest_id ON public.user_quests(quest_id);

CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON public.privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_setting_key ON public.privacy_settings(setting_key);

CREATE INDEX IF NOT EXISTS idx_temporary_shares_user_id ON public.temporary_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_temporary_shares_experience_id ON public.temporary_shares(experience_id);
CREATE INDEX IF NOT EXISTS idx_temporary_shares_token ON public.temporary_shares(token);
CREATE INDEX IF NOT EXISTS idx_temporary_shares_expires_at ON public.temporary_shares(expires_at);

-- Erstelle Funktionen und Trigger für automatische Aktualisierungen
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für updated_at-Felder
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_experiences
BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_groups
BEFORE UPDATE ON public.groups
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_comments
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_privacy_settings
BEFORE UPDATE ON public.privacy_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Funktion zum Aktualisieren der Zähler
CREATE OR REPLACE FUNCTION update_experience_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'comments' AND NEW.experience_id IS NOT NULL THEN
      UPDATE public.experiences SET comment_count = comment_count + 1 WHERE id = NEW.experience_id;
    ELSIF TG_TABLE_NAME = 'likes' AND NEW.experience_id IS NOT NULL THEN
      UPDATE public.experiences SET like_count = like_count + 1 WHERE id = NEW.experience_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'comments' AND OLD.experience_id IS NOT NULL THEN
      UPDATE public.experiences SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.experience_id;
    ELSIF TG_TABLE_NAME = 'likes' AND OLD.experience_id IS NOT NULL THEN
      UPDATE public.experiences SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.experience_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger für Zähler-Aktualisierungen
CREATE TRIGGER update_experience_comment_count
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION update_experience_counters();

CREATE TRIGGER update_experience_like_count
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION update_experience_counters();

-- Funktion zum Aktualisieren der Gruppenzähler
CREATE OR REPLACE FUNCTION update_group_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'group_members' THEN
      UPDATE public.groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    ELSIF TG_TABLE_NAME = 'group_experiences' THEN
      UPDATE public.groups SET experience_count = experience_count + 1 WHERE id = NEW.group_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'group_members' THEN
      UPDATE public.groups SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.group_id;
    ELSIF TG_TABLE_NAME = 'group_experiences' THEN
      UPDATE public.groups SET experience_count = GREATEST(0, experience_count - 1) WHERE id = OLD.group_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger für Gruppenzähler-Aktualisierungen
CREATE TRIGGER update_group_member_count
AFTER INSERT OR DELETE ON public.group_members
FOR EACH ROW EXECUTE FUNCTION update_group_counters();

CREATE TRIGGER update_group_experience_count
AFTER INSERT OR DELETE ON public.group_experiences
FOR EACH ROW EXECUTE FUNCTION update_group_counters();

-- Funktion zum Aktualisieren der Kommentarzähler
CREATE OR REPLACE FUNCTION update_comment_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE public.comments SET reply_count = reply_count + 1 WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE public.comments SET reply_count = GREATEST(0, reply_count - 1) WHERE id = OLD.parent_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger für Kommentarzähler-Aktualisierungen
CREATE TRIGGER update_comment_reply_count
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION update_comment_counters();

-- Füge einen Eintrag in die Gesundheitscheck-Tabelle ein
INSERT INTO public.health_check (status) VALUES ('ok');
