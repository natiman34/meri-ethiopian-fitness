let { data: profile, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", sessionUser.id)
  .single()