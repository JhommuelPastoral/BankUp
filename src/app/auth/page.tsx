"use client";

  import {Nfc } from "lucide-react";
  import Image from "next/image";
  import Link from "next/link";
  import { toast } from "sonner";
  import {useState, useEffect} from "react";
  import {redirect} from "next/navigation";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {Checkbox} from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {createClient} from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

type OAuthProvider = "google" | "github" | "apple";
const getSession = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
export default function Auth() {
  const supabase = createClient();
  const [isChecked, setIsChecked] = useState<boolean|string>("indeterminate");
  const searchParams = useSearchParams();
  useEffect(() => {
    const error = searchParams.get("error");
    const checkSession = async () => {
      const session = await getSession();
      console.log("session", session);
    };

    checkSession();
    if (error === "user-not-found") {
      // Clean the url
      toast.error("User does not exist. Please sign up first.", {
        style: {
          color: "red",
          textAlign: "center",
          borderRadius: "0",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
        },
      });
      redirect("/auth");

    }
  }, [searchParams]);
  const handleLogin = async (provider: OAuthProvider) => {
    if(isChecked === false || isChecked === "indeterminate"){
      toast.error("Please agree to the Terms of Service and Privacy Policy.",{
        style:{
          color: "red",
          textAlign: "center",
          borderRadius: "0",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
        }
      });
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
    } catch (error) {
      console.log("Sign in error", error);      
    }

  }
  return (
    <div className="flex min-h-screen items-center justify-center md:px-4 px-1 font-mono">
      <Card className="w-full max-w-md ring-0">
        <CardHeader className="items-center text-center">
          <Nfc className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-2xl font-bold">
            Welcome to Bank<span className="text-primary">Up.</span>
          </CardTitle>
          <CardDescription>
            A simple banking simulation tool for learning and exploring financial features.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleLogin("google")}
          > 
            <Image
              src="https://thesvg.org/icons/google/default.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleLogin("github")}
          > 
            <Image
              src="https://thesvg.org/icons/github/default.svg"
              alt="Github"
              width={20}
              height={20}
            />
            Sign in with Github
          </Button>
        </CardContent>
        <CardFooter className="flex gap-2 flex-col ">
          <Field className="flex  gap-2" orientation="horizontal">
            <Checkbox id="terms-conditions"  onCheckedChange={setIsChecked} required/>
            <FieldLabel htmlFor="terms-conditions" className="text-xs text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </FieldLabel>
          </Field>
          <div className="flex gap-2 justify-center items-center">
            <p>Don't have an account?</p>
            <Link href="/auth/signUp" 
              className="text-primary font-semibold relative
                before:w-0 before:h-0 before:transition-all before:duration-500 before:ease-in-out before:absolute before:left-0 before:-bottom-1
                hover:before:w-full hover:before:h-0.5 hover:before:bg-primary">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}