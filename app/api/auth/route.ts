import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getSession()

  return NextResponse.json({ session: data.session })
}
