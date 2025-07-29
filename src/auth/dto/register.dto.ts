import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string
    
    @IsString()
    password: string

    @IsString()
    username: string
    
    @IsString()
    fullname: string

    @IsDateString()
    @IsOptional()
    birthDate?: string
}