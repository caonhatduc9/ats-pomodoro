class AuthResponseDto {
  status: string;
  data: {
    userId: number;
    apiToken: string;
    userName: string;
    avatarURL: string;
    payment: 'free' | 'paid';
  };
}
