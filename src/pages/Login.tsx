// import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { Calendar } from 'lucide-react';
// import { Input } from '../components/ui/Input';
// import { Button } from '../components/ui/Button';
// import { useAuth } from '../context/AuthContext';
// import { supabase } from '../lib/supabase';
// import { getUser } from '../lib/api';
// import toast from 'react-hot-toast';

// export const Login: React.FC = () => {
//   const { isAuthenticated, loading } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Please enter both email and password');
//       return;
//     }

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         toast.error(error.message);
//         return;
//       }

//       if (data.user) {
//         const userData = await getUser(data.user.id);
//         if (!userData) {
//           toast.error('User account not found');
//         }
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error('An error occurred during login');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <Calendar className="h-12 w-12 text-primary-600" />
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
//           eventto
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Sign in to your account to manage events
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="rounded-md bg-error-50 p-4">
//                 <div className="text-sm text-error-700">{error}</div>
//               </div>
//             )}

//             <Input
//               label="Email Address"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//             />

//             <Input
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <div>
//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={loading}
//               >
//                 Sign In
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
