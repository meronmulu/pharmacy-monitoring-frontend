import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Login to your account
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                className="h-11"
                required
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base  bg-[#009966]">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          © 2026 Pharmacy Monitoring System
        </CardFooter>
      </Card>
    </div>
  )
}
