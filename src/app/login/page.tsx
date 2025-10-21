"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "@/lib/auth-client"
import { Github } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn.social({ provider: "github" })}
            className="w-full"
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
