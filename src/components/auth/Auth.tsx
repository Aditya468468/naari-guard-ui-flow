
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Mail, Lock, Loader2, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/home');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Redirect to home or the page they were trying to access
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      } else {
        // For signup, we'll include the name in the user metadata
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
            data: {
              full_name: name,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Handle specific auth errors
      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. If you just signed up, please check your email to confirm your account first.';
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-naari-purple to-naari-teal flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gradient">NaariGuard AI</h1>
        <p className="text-sm text-gray-400">Your personal safety companion</p>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <Label className="text-sm text-gray-400 mb-1 block">Full Name</Label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-naari-purple"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm text-gray-400 mb-1 block">Email</Label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-naari-purple"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-400 mb-1 block">Password</Label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-naari-purple"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-naari-purple to-naari-teal text-white py-2 rounded-lg flex items-center justify-center shadow-glow-purple disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </div>
  );
};

export default Auth;
