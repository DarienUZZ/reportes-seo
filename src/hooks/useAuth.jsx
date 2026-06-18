import { useState, useEffect, createContext, useContext, useRef } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileFetched = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;

      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      const newUser = session?.user ?? null;
      setUser(newUser);

      // Solo refetch si cambia el ID del usuario
      if (newUser && profileFetched.current !== newUser.id) {
        await fetchProfile(newUser.id);
      } else if (!newUser) {
        setProfile(null);
        profileFetched.current = null;
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId) {
    profileFetched.current = userId;
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      }
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    profileFetched.current = null;
  }

  const isAdmin = profile?.rol === "admin" && profile?.activo === true;

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signOut, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
