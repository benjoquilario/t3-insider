"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AiOutlineGoogle } from "react-icons/ai"
import { FiGithub } from "react-icons/fi"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { IRegister, registerValidator } from "@/lib/validations/credentials"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useTransition, useState } from "react"
import { register } from "@/server/auth"
import { useRouter } from "next/navigation"

const Register = () => {
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const form = useForm<IRegister>({
    resolver: zodResolver(registerValidator),
  })
  const router = useRouter()

  function handleOnSubmit(values: IRegister) {
    setError("")
    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          setError(data.error)
        }

        if (data.ok) {
          router.push("/")
        }
      })
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-2 w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account!</CardTitle>
          <CardDescription>
            Enter your email below to create your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="outline">
              <AiOutlineGoogle aria-hidden="true" className="mr-2 size-4" />
              Google
            </Button>
            <Button variant="outline">
              <FiGithub aria-hidden="true" className="mr-2 size-4" />
              Github
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <div className="flex flex-col gap-3.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid w-full grid-cols-2 gap-2">
                <div className="flex flex-col gap-3.5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3.5">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-3.5">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-2 text-destructive">{error}</div>
              <Button disabled={isPending} className="w-full" type="submit">
                Create an account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="grid gap-1.5">
          <div className="mt-2 text-left text-sm">
            <span className="text-muted-foreground">
              Already have an account
            </span>
            <Link
              href="/login"
              className="ml-1 text-muted-foreground underline transition duration-200 ease-in-out hover:text-primary"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register
