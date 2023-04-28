interface AuthResponse {
  status: string;
  data: {
    userId: string;
    apiToken: string;
    userName: string;
    avatarURL: string;
    payment: 'free' | 'paid';
  };
}
