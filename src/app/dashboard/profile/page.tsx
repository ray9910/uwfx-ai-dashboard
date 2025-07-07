'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, KeyRound } from 'lucide-react';
import type { UpdateEmailForm, UpdatePasswordForm } from '@/types';
import { SidebarTrigger } from '@/components/ui/sidebar';

const updateEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ProfilePage() {
  const { user, updateUserEmail, updateUserPassword } = useAuth();
  const { toast } = useToast();
  const [isEmailLoading, setIsEmailLoading] = React.useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = React.useState(false);

  const emailForm = useForm<UpdateEmailForm>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: user?.email ?? '',
    },
  });

  const passwordForm = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleAuthError = (error: any) => {
    if (error.code === 'auth/requires-recent-login') {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'This action is sensitive and requires recent authentication. Please sign out and sign in again before retrying.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: error.message,
      });
    }
  };

  const onEmailSubmit = async (data: UpdateEmailForm) => {
    setIsEmailLoading(true);
    try {
      await updateUserEmail(data);
      toast({
        title: 'Email Updated',
        description: 'Your email has been successfully updated.',
      });
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const onPasswordSubmit = async (data: UpdatePasswordForm) => {
    setIsPasswordLoading(true);
    try {
      await updateUserPassword(data);
      passwordForm.reset();
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-svh p-4 md:p-6 lg:p-8">
      <div className="bg-card rounded-xl border p-4 sm:p-6 lg:p-8 w-full flex-1 flex flex-col">
        <header className="flex items-center gap-4 mb-8">
          <div className="hidden md:block">
            <SidebarTrigger />
          </div>
          <h1 className="text-2xl font-semibold flex items-center gap-3">
            <User className="h-6 w-6" />
            Profile & Settings
          </h1>
        </header>

        <main className="flex-1 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Change Email</CardTitle>
              <CardDescription>Update the email address associated with your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-email">Current Email</Label>
                  <Input id="current-email" type="email" value={user.email!} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">New Email</Label>
                  <Input id="email" type="email" placeholder="new.email@example.com" {...emailForm.register('email')} />
                  {emailForm.formState.errors.email && <p className="text-sm font-medium text-destructive">{emailForm.formState.errors.email.message}</p>}
                </div>
                <Button type="submit" disabled={isEmailLoading}>
                  {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Email
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Change Password</CardTitle>
              <CardDescription>Choose a new, strong password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" type="password" {...passwordForm.register('password')} />
                  {passwordForm.formState.errors.password && <p className="text-sm font-medium text-destructive">{passwordForm.formState.errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" {...passwordForm.register('confirmPassword')} />
                  {passwordForm.formState.errors.confirmPassword && <p className="text-sm font-medium text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
