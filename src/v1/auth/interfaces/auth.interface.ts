interface AuthResponse {
  status: string;
  data: {
    userId: number;
    access_token: string;
    userName: string;
    avatarURL: string;
    payment: 'free' | 'paid';
  };
}
