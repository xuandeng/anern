import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserModel } from '../database/models';
import bcrypt from 'bcryptjs';

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // 查找用户
          const user = UserModel.findByEmail(credentials.email);
          
          if (!user) {
            throw new Error('用户不存在');
          }

          if (user.status !== 'active') {
            throw new Error('用户账号已被禁用');
          }

          // 验证密码
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error('密码错误');
          }

          // 获取用户权限
          const permissions = UserModel.getUserPermissions(user.id);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            roleId: user.role_id,
            permissions: permissions.map(p => p.name)
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error(error.message || '认证失败');
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roleId = user.roleId;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.roleId = token.roleId;
        session.user.permissions = token.permissions;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;