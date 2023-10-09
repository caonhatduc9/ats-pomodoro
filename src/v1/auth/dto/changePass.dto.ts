import { IsEmail, IsNotEmpty, Length, isNotEmpty } from 'class-validator';

export class ChangePassDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8, 20)
  currentPassword: string;
  @IsNotEmpty()
  @Length(8, 20)
  newPassword: string;
}
