import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';
import GetErrorResponse from 'src/utilities/utilities.error-responses';
import { AuthGuard, AdminGuard } from './auth.guard';
import { signUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: signInDto) {
        try {
            const user = await this.authService.signIn(signInDto);
            return user;
        } catch (error) {
            GetErrorResponse(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('signup')
    async signUp(@Body() signUpDto: signUpDto) {
        try {
            const user = await this.authService.signUp(signUpDto);
            return user;
        } catch (error) {
            GetErrorResponse(error);
        }
    }

    @UseGuards(AdminGuard)
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
