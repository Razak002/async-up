import { joinWorkspaceAction } from '@/app/actions/auth';
import { getCurrentUser } from '@/services/auth/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cookies } from 'next/headers';

export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params promise in Next.js 15
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // We need to pass the token explicitly for server actions during SSR to work cleanly
  // Let&apos;s get it from cookies if possible, or fallback
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const user = await getCurrentUser(token);
  
  if (!user) {
    // Redirect to signup and tell the client where to go back to
    redirect(`/auth/signup?callbackUrl=${encodeURIComponent(`/invite/${slug}`)}`);
  }

  // Define the server action here to capture the slug and pass the token
  const handleJoin = async () => {
    'use server';
    // In a server action, cookies are accessible directly, but we can also rely
    // on our auth utility if we passed the token
    const _cookieStore = await cookies();
    const actionToken = _cookieStore.get('auth_token')?.value;
    
    const result = await joinWorkspaceAction(slug, actionToken);
    
    if (result.success) {
      redirect('/dashboard');
    } else {
      // For simplicity in this neat version, redirect with an error param
      // A more robust version would use useActionState
      redirect(`/invite/${slug}?error=${encodeURIComponent(result.error || 'Failed to join')}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center text-primary">
            {/* Using a standard icon, lucide-react might not export 'WorkspaceIcon', falling back to Briefcase */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <CardTitle className="text-2xl font-bold">Workspace Invitation</CardTitle>
          <CardDescription className="text-base">
            You have been invited to join the workspace <strong>{slug}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleJoin} className="space-y-4">
            <Button type="submit" className="w-full">
              Accept Invitation
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Signed in as {user.email}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
