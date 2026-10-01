"use client";

import { Nfc } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type OAuthProvider = "google" | "github";




export default function SignUp() {
  const supabase = createClient();
  const [isChecked, setIsChecked] = useState<boolean|string>("indeterminate");
  const handleSignUp = async (provider: OAuthProvider) => {
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

      if (error) {
        console.log("Sign up error:", error.message);
      }
    } catch (error) {
      console.log("Sign up error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-1 md:px-4 font-mono">
      <Card className="w-full max-w-md ring-0">
        <CardHeader className="items-center text-center">
          <Nfc className="mx-auto h-10 w-10 text-primary" />

          <CardTitle className="text-2xl font-bold">
            Create your Bank<span className="text-primary">Up</span> account
          </CardTitle>

          <CardDescription>
            Create an account to explore the BankUp banking simulation.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSignUp("google")}
          >
            <Image
              src="https://thesvg.org/icons/google/default.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Sign up with Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSignUp("github")}
          >
            <Image
              src="https://thesvg.org/icons/github/default.svg"
              alt="GitHub"
              width={20}
              height={20}
            />
            Sign up with GitHub
          </Button>
        </CardContent>

        <CardFooter className="flex gap-2 flex-col ">
          <Field className="flex  gap-2" orientation="horizontal">
            <Checkbox id="terms-conditions"  onCheckedChange={setIsChecked} required/>
            <FieldLabel htmlFor="terms-conditions" className="text-xs text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </FieldLabel>
          </Field>
          <div className="flex gap-2 justify-center items-center">
            <p>Already have an account?</p>
            <Link href="/auth" 
              className="text-primary font-semibold relative
                before:w-0 before:h-0 before:transition-all before:duration-500 before:ease-in-out before:absolute before:left-0 before:-bottom-1
                hover:before:w-full hover:before:h-0.5 hover:before:bg-primary">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}